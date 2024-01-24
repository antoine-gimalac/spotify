const express = require('express');
const hostname = '0.0.0.0';
const port = 3000;
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://mongo/apinode');

// Remplacez ceci par votre jeton d'accès
const accessToken = 'BQDJgQxw6sMmcixFEDiyjWugPsLK2MIUQSzj_pe-tnjyjtfeJH6BQSVkM3_vTYq20Q4mSFjVGOtKYsGSYmDDIlI0YaDXYMtrYXqt1KEYxLlr70IibAQ';
const trackId = '0Bo5fjMtTfCD8vHGebivqc';

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/track/', async (req, res) => {
    // Crée une page HTML pour afficher l'image
    const htmlResponse = `
                <html>
                    <head>
                        <title>Rentrer l'URL de la piste</title>
                    </head>
                    <body>
                    <h1>Entrez l'URL de la Piste Spotify</h1>
                    <form action="/track-info" method="post">
                        <input type="text" name="spotifyUrl" placeholder="URL Spotify">
                        <button type="submit">Obtenir Infos de la Piste</button>
                    </form>
                    </body>
                </html>
            `;
    res.send(htmlResponse);
    //res.send(images);
    //res.send(response.data);
});

app.post('/track-info', async (req, res) => {
    const spotifyUrl = req.body.spotifyUrl;
    const trackIdMatch = spotifyUrl.match(/track\/([a-zA-Z0-9]+)(?:\?|$)/);
    if (trackIdMatch && trackIdMatch[1]) {
        const trackId = trackIdMatch[1];
        try {
            const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const firstImage = response.data;

            // Crée une page HTML pour afficher l'image
            const htmlResponse = `
            <html>
                <head>
                    <title>Infos de la Piste ${firstImage.name}</title>
                </head>
                <body>
                    <h1>${firstImage.name}</h1>
                    <img src="${firstImage.album.images[0].url}" alt="Image de l'Album" width="125px" height="125px"><br><br>
                    ${firstImage.preview_url ? `<audio controls src="${firstImage.preview_url}"></audio>` : "<p>Extrait audio non disponible.</p>"}<br><br>
                    <a href="${firstImage.external_urls.spotify}" target="_blank"> Écouter la musique en entiers</a><br><br>
                    <button onclick="location.href='/track/'">Retour</button>
                </body>
            </html>
        `;
            res.send(htmlResponse);
            //res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        } catch (error) {
            console.error('Erreur lors de la récupération des infos de la piste :', error);
            res.status(500).send('Erreur lors de la récupération des infos de la piste');
        }
    } else {
        res.status(400).send('URL Spotify non valide');
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});