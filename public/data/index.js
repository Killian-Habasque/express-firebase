

import * as THREE from '../node_modules/three/build/three.module.js';
console.log(THREE)
import { user } from "./user.js";
import { score } from "./score.js";
// console.log(THREE )
const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("text");
  const passwordInput = document.getElementById("password");

  try {
    const { message } = await user.auth.register(emailInput.value, passwordInput.value);
    console.log(message); // Affichez un message de succès après l'inscription
  } catch (error) {
    console.error("Registration error:", error);
  }
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const emailInput = document.getElementById("login-text");
  const passwordInput = document.getElementById("login-password");
  try {
    const data = await user.auth.login(emailInput.value, passwordInput.value);
    if (data.error) {
      console.error('Login error:', data.error);
      alert('Échec de la connexion: ' + data.error);
    } else {
      console.log('Connexion réussie');
      console.log('Utilisateur connecté:', data);
      initUser()
      // Faire quelque chose après une connexion réussie, comme rediriger l'utilisateur
    }
  } catch (error) {
    console.error('Erreur lors de la connexion utilisateur', error);
    alert('Échec de la connexion: ' + error.message);
  }
});

const logout = document.getElementById("logout");
logout.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    const data = await user.auth.logout();
    if (data.error) {
      console.error('Logout error:', data.error);
      alert('Échec de la déconnexion: ' + data.error);
    } else {
      console.log('Déconnexion réussie');
      console.log('Utilisateur déconnecté:', data);
      initUser()
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion utilisateur', error);
    alert('Échec de la déconnexion: ' + error.message);
  }
});



document.addEventListener("DOMContentLoaded", async (event) => {
  const board = document.getElementById("data-score");
  try {
    const data = await score.board.getScores();

    if (data.error) {
      console.error('Scores error:', data.error);
      alert('Erreur lors de la récupération des scores: ' + data.error);
    }

    board.innerHTML = '';

    data.forEach((user, index) => {
      const listItem = document.createElement('li');
      listItem.classList.add('score-item');

      let emoji = '';
      if (index === 0) {
        emoji = '🥇';
      } else if (index === 1) {
        emoji = '🥈';
      } else if (index === 2) {
        emoji = '🥉';
      }

      listItem.innerHTML = `
                <span class="position">${emoji}${index + 1}</span>
                <span class="username">${user.pseudo}</span>
                <span class="score">${user.bestscore}</span>
            `;
      board.appendChild(listItem);
    });


  } catch (error) {
    console.error('Erreur lors de la récupération des scores', error);
    alert('Erreur lors de la récupération des scores: ' + error.message);
  }
});


async function initUser() {
  const profil = document.getElementById("data-user");
  try {
    const data = await user.auth.getUser();
    if (data) {
      profil.innerHTML = `
                  <li class="position">${data.pseudo}</li>
                  <li class="username">${data.bestscore}</li>
              `;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des scores', error);
    profil.innerHTML = '';
  }
}
initUser()


const addScore = document.getElementById("add-score");
addScore.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const scoreValue = document.getElementById("value-score");
    console.log(scoreValue.value)
    const data = await score.board.setScore(scoreValue.value);
    if (data.error) {
      console.error('Update score error:', data.error);
      alert('Échec de la modification du score: ' + data.error);
    } else {
      console.log('Score modifié:', data);
      initUser()
    }
  } catch (error) {
    console.error('Échec de la modification du score', error);
    alert('Échec de la modification du score: ' + error.message);
  }
});
