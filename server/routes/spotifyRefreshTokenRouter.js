import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyRefreshTokenRouter = express.Router();

spotifyRefreshTokenRouter.post('/', async (req, res) => {
    const { refreshToken } = req.body;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken,
    });
  
    try {
      const {
        body: { access_token, expires_in },
      } = await spotifyApi.refreshAccessToken();
      res.json({ access_token, expires_in });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  });

export {spotifyRefreshTokenRouter};