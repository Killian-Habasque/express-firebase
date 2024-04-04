import { client } from "./client.js";

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  try {
    const { message } = await client.auth.register(emailInput.value, passwordInput.value);
    console.log(message); // Affichez un message de succès après l'inscription
  } catch (error) {
    console.error("Registration error:", error);
  }
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    try {
        const data = await client.auth.login(emailInput.value, passwordInput.value);
        if (data.error) {
            console.error('Login error:', data.error);
            alert('Échec de la connexion: ' + data.error);
        } else {
            console.log('Connexion réussie');
            console.log('Utilisateur connecté:', data);
            // Faire quelque chose après une connexion réussie, comme rediriger l'utilisateur
        }
    } catch (error) {
        console.error('Erreur lors de la connexion utilisateur', error);
        alert('Échec de la connexion: ' + error.message);
    }
});