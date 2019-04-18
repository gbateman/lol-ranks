const admin = require('firebase-admin');
const fs = require('fs');
const request = require('request');
const serviceAccount = require('/etc/lol-ranks/lol-ranks.json');
const riotAPIToken = process.env.RIOT_API_TOKEN || '';
const soloQueue = 'RANKED_SOLO_5x5';

const summonerURL = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const ranks = db.collection('ranks');

fs.readFile('./summoners.json', (err, data) => {
    if (err) { throw err; }
    const summonerIDs = JSON.parse(data.toString());
    console.log('summonerIDs:', summonerIDs);

    summonerIDs.forEach(id => {
        const url = summonerURL + id;
        console.log('request url:', url);

        const options = {
            url: url,
            headers: {
                'X-Riot-Token': riotAPIToken
            }
        };

        request(options, (err, res, body) => {
            if (err) { throw err; }
            const b = JSON.parse(body);
            console.log('body:', b);

            const rank = b.find(rank => rank.queueType == soloQueue);
            rank.timestamp = Math.floor(new Date() / 1000);
            console.log('rank:', rank);

            ranks.add(rank);
        });
    });
});
