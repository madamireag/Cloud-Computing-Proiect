import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyLoginRouter = express.Router();

spotifyLoginRouter.post('/', async (req, res) => {
    const { code } = req.body;
  
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
  
    try {
      const {
        body: { access_token, refresh_token, expires_in },
      } = await spotifyApi.authorizationCodeGrant(code);
  
      res.json({ access_token, refresh_token, expires_in });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  });

export {spotifyLoginRouter};