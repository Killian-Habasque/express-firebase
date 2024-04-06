const { collection, addDoc, query, where, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } = require('firebase/auth');
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

const register = async (req, res) => {
    const { pseudo, password } = req.body;

    try {
        const q = query(collection(db, 'users'), where('pseudo', '==', pseudo));
        const userRef = await getDocs(q);

        if (!userRef.empty) {
            return res.status(400).json({ error: 'Le pseudo est déjà pris. Veuillez en choisir un autre.' });
        }
        const email = pseudo + "@yatzee.fr"
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            uid: user.uid,
            pseudo: pseudo,
            bestscore: 0
        };
        const newUserRef = await addDoc(collection(db, 'users'), userData);
        
        res.status(200).json({ uid: user.uid, email: userData.pseudo });
    } catch (error) {
        console.error('Erreur lors de l\'inscription utilisateur', error);
        res.status(400).json({ error: 'Erreur lors de l\'inscription', details: error.message });
    }
};


module.exports = { getData, login, register};