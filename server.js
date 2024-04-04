// app.js
const express = require('express');
// const cors = require('cors');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');

const app = express();
// app.use(cors());
app.use(express.json());
app.use("/", express.static("./public"));
app.use(cookieParser());

// Middleware global pour les en-têtes CORS
// app.use((req, res, next) => {
//     const allowedOrigins = ['*'];
//     const origin = req.headers.origin;
  
//     if (allowedOrigins.includes(origin)) {
//       res.header('Access-Control-Allow-Origin', origin);
//     }
  
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });

app.use('/', routes);

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Le serveur back tourne correctement sur le port ${port}`);
});