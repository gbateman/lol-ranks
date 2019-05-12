const admin = require('firebase-admin');
const fs = require('fs');
const request = require('request');
const serviceAccount = require('/etc/lol-ranks/lol-ranks-key.json');
const riotAPIToken = process.env.RIOT_API_TOKEN || '';
const soloQueue = 'RANKED_SOLO_5x5';

const summonerURL = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/';

const summonerIDs = [
    'k6d1cS-uU0sNaFCb71LTH2BYP4ZgJqkme0JGDdQL7JM4Juw', // mtfuji
    '-2vCMh1EbLSnHvSPk0O5EUaIZC-KbSbZy9dhmgL6D2k2l9s', // somsom
    'xM5qQt0tPybc-rmrNC9M6evhlvf55-4WdkqTNJh0qQ', // 7dk
    'VYO5FNU7FiD_C8uWToeJEBgw_-pgZy5qc4-jTBHROSGqbsM', // das negros
    'btBahOavIzKqx_iyHemOsnmRCnZDnGbpEWtLAgWbRFdeYkw', // shyvayne
    'qb4FN1B6yvCTmMPzs-ACbeVOd4DTWMqg8maH3kTzGRr8XKg', // swagmaster7
    'nOW2tRZJP8dlt9Yw7gli7FHxSBpC1-0d716mDmCY1__8sZg', // simmerdownson
    'UlHEn5RoJfx7Gc-TVBc-uQCpfMw7vruP5UeJ0T6PSdlrvHU' // icomesoft
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
        if (rank) {
            rank.timestamp = Math.floor(new Date() / 1000);
            console.log('rank:', rank);

            ranks.add(rank);
        }
    });
});
