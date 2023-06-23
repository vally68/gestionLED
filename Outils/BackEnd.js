const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: '10.31.201.113', // Remplacer par l'adresse IP de votre Raspberry Pi
  user: 'serfa_etudiants',      // Remplacer par votre utilisateur MariaDB
  password: '0123456789'  // Remplacer par votre mot de passe MariaDB
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MariaDB');
});

// Création de la base de données
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE mydb'; // Remplacer par le nom de votre base de données
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Database created...');
  });
});

// Utilisation de la base de données
db.changeUser({database : 'mydb'}, function(err) {
  if (err) throw err;
});

// Création de la table
app.get('/createTable', (req, res) => {
  let sql = 'CREATE TABLE myTable(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))'; // Remplacer par votre requête de création de table
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Table created...');
  });
});

app.listen('3000', () => {
  console.log('Server started on port 3000');
});
