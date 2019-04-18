const admin = require('firebase-admin');
const serviceAccount = require('/etc/lol-ranks/gregbateman-me-247fe3ed8a98.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const fs = require('fs');
fs.readFile('./summoners.json', (err, data) => {
    if (err) { throw err; }
    const summonerIDs = JSON.parse(data.toString());
    console.log('summonerIDs: ', summonerIDs);
});
