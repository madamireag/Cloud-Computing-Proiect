import express from 'express';
import spotifyApi from 'spotify-web-api-node';

const getUserPlaylistRouter = express.Router();

getUserPlaylistRouter.get('/playlists', async (req,res) => {
    try {
      var result = await spotifyApi.getUserPlaylists();
      console.log(result.body);
      res.status(200).send(result.body);
    } catch (err) {
      res.status(400).send(err)
    }
  
  });

  export {getUserPlaylistRouter};