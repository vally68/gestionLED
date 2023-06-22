const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: '10.31.201.113', // Replace with your Raspberry Pi IP address
  user: 'root',      // Replace with your MariaDB user
  password: ''  // Replace with your MariaDB password
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MariaDB');
});

// Create the database
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE mydb'; // Replace with your database name
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Database created...');
  });
});

// Use the database
db.changeUser({database : 'mydb'}, function(err) {
  if (err) throw err;
});

// Create the tables
app.get('/createTables', (req, res) => {
  const tables = [
    `CREATE TABLE User (
      UserID int PRIMARY KEY,
      Username varchar(255),
      Password varchar(255)
    ) ENGINE=InnoDB;`,
    `CREATE TABLE Configuration (
      ConfigID int PRIMARY KEY,
      LEDMode varchar(255),
      SystemStatus varchar(255),
      AbsenceModeStatus varchar(255),
      BrightnessThreshold int,
      UserID int,
      FOREIGN KEY (UserID) REFERENCES User(UserID)
    ) ENGINE=InnoDB;`,
    `CREATE TABLE Notification (
      NotificationID int PRIMARY KEY,
      Message varchar(255),
      TimeStamp datetime,
      UserID int,
      FOREIGN KEY (UserID) REFERENCES User(UserID)
    ) ENGINE=InnoDB;`,
    `CREATE TABLE LEDColor (
      LEDColorID int PRIMARY KEY,
      Color varchar(255),
      TemperatureRange varchar(255),
      ConfigID int,
      FOREIGN KEY (ConfigID) REFERENCES Configuration(ConfigID)
    ) ENGINE=InnoDB;`,
    `CREATE TABLE Luminosity (
      LuminosityID int PRIMARY KEY,
      LuminosityValue int,
      ConfigID int,
      FOREIGN KEY (ConfigID) REFERENCES Configuration(ConfigID)
    ) ENGINE=InnoDB;`,
    `CREATE TABLE Temperature (
      TemperatureID int PRIMARY KEY,
      TemperatureValue float,
      ConfigID int,
      FOREIGN KEY (ConfigID) REFERENCES Configuration(ConfigID)
    ) ENGINE=InnoDB;`,
    `CREATE TABLE Presence (
      PresenceID int PRIMARY KEY,
      NumberOfPeople int,
      ConfigID int,
      FOREIGN KEY (ConfigID) REFERENCES Configuration(ConfigID)
    ) ENGINE=InnoDB;`,
    `CREATE TABLE TimeSlot (
      TimeSlotID int PRIMARY KEY,
      StartTime time,
      EndTime time,
      ConfigID int,
      FOREIGN KEY (ConfigID) REFERENCES Configuration(ConfigID)
    ) ENGINE=InnoDB;`
  ];

  tables.forEach((table) => {
    db.query(table, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  });

  res.send('Tables created...');
});

app.listen('3000', () => {
  console.log('Server started on port 3000');
});
