const { collection, getDocs, addDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const db = require('../models/firebaseModel');

const getData = async (req, res) => {
    try {
        const dataRef = collection(db, 'users');
        const snapshot = await getDocs(dataRef);
        const data = snapshot.docs.map(doc => doc.data());
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis Firestore', error);
        res.status(500).send('Erreur serveur');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        // Stocker le jeton dans Firestore (facultatif, dépend de vos besoins)
        const tokenDocRef = await addDoc(collection(db, 'tokens'), { uid: user.uid, token });

        res.cookie('token', token, {
            httpOnly: true, 
            secure: true,
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ uid: user.uid, email: user.email, token });
    } catch (error) {
        console.error('Erreur lors de la connexion utilisateur', error);
        res.status(401).json({ error: 'Identifiants invalides', details: error.message });
    }
};

module.exports = { getData, login};