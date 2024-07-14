const express = require('express');
const app = express();
const cors = require('cors');
const usersRouter = require('./controllers/usersRouter')
const authRouter = require('./controllers/authRouter');
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose');
const SpotifyWebAPI = require('spotify-web-api-node');
const path = require('path');


mongoose.set('strictQuery',false)

const url = config.MONGO_URI

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

const spotifyApi = new SpotifyWebAPI({
  clientId: config.SPOTIFY_CLIENT_ID,
  clientSecret: config.SPOTIFY_CLIENT_SECRET,
  redirectUri: config.SPOTIFY_CALLBACK_URL
});

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.get('/login', (req, res) => { 
  const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'playlist-read-collaborative', 'user-top-read'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
})

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code  = req.query.code;

  if (error) {
    console.error(`Callback Error: ${error}`);
    res.redirect(`/error?message=${encodeURIComponent(error)}`);
    return;
  }

  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      res.cookie('accessToken', access_token, { httpOnly: true, secure: false });
      res.redirect(`http://localhost:3000/authusers/${access_token}`);


      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];
        spotifyApi.setAccessToken(access_token);
        res.cookie('accessToken', access_token, { httpOnly: true, secure: false });
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error(`Callback Error: ${error}`);
      res.redirect(`/error?message=${encodeURIComponent(error)}`); // Redirect to an error page
    });
});

app.use('/', usersRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});