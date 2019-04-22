const admin = require('firebase-admin');
const fs = require('fs');
const request = require('request');
const serviceAccount = require('/etc/lol-ranks/lol-ranks-key.json');
const riotAPIToken = process.env.RIOT_API_TOKEN || '';
const soloQueue = 'RANKED_SOLO_5x5';

const summonerURL = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/';

const summonerIDs = [
    'tEladA5OIZvYCHo152YVCMq4bzlo48ligyq3BlHCviHPUm8'
];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const ranks = db.collection('ranks');

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
