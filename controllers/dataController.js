const { collection, addDoc, query, where, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } = require('firebase/auth');
const db = require('../models/firebaseModel');


const login = async (req, res) => {
    const { pseudo, password } = req.body;

    try {
        const email = pseudo + '@yatzee.fr'
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
    const { pseudo, password, score } = req.body;

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
            bestscore: score ?? 0
        };
        const newUserRef = await addDoc(collection(db, 'users'), userData);

        res.status(200).json({ uid: user.uid, email: userData.pseudo });
    } catch (error) {
        console.error('Erreur lors de l\'inscription utilisateur', error);
        res.status(400).json({ error: 'Erreur lors de l\'inscription', details: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion utilisateur', error);
        res.status(500).json({ error: 'Erreur serveur lors de la déconnexion' });
    }
};

const getUser = async (req, res) => {
    try {
        const { uid } = req.user;
        const dataRef = collection(db, 'users');
        const snapshot = await getDocs(dataRef);

        let userDoc;
        snapshot.forEach((doc) => {
            if (doc.data().uid === uid) {
                userDoc = doc;
            }
        });
        if (!userDoc) {
            console.error('Utilisateur non trouvé.');
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const userData = userDoc.data();
        res.status(200).json({
            uid: userData.uid,
            email: userData.email,
            pseudo: userData.pseudo,
            bestscore: userData.bestscore,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
        res.status(500).send('Erreur serveur');
    }
};


const getScores = async (req, res) => {
    try {
        const dataRef = collection(db, 'users');
        const snapshot = await getDocs(dataRef);
        let data = snapshot.docs.map(doc => doc.data());
        data = data.filter(user => user.bestscore !== 0);
        data.sort((a, b) => b.bestscore - a.bestscore);
        data = data.slice(0, 20);
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
        res.status(500).send('Erreur serveur');
    }
};


const setScore = async (req, res) => {
    try {
        const { uid } = req.user;

        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        let userDoc;
        snapshot.forEach((doc) => {
            if (doc.data().uid === uid) {
                userDoc = doc;
            }
        });

        if (!userDoc) {
            console.error('Utilisateur non trouvé.');
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const { bestscore } = req.body;

        if (bestscore > userDoc.data().bestscore) {
            await updateDoc(userDoc.ref, { bestscore });
            res.status(200).json({ message: 'Nouveau meilleur score mis à jour avec succès' });
        } else {
            res.status(200).json({ message: 'Le score reçu n\'est pas supérieur au meilleur score actuel. Aucune mise à jour effectuée.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
        res.status(500).send('Erreur serveur');
    }
};



module.exports = { getScores, setScore, getUser, login, register, logout};