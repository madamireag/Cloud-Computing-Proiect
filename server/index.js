import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { spotifyLoginRouter } from "./routes/spotifyLoginRouter.js";
import { spotifyRefreshTokenRouter } from './routes/spotifyRefreshTokenRouter.js';
import { getUserPlaylistRouter } from './routes/getUserPlaylists.js';
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.use('/login',spotifyLoginRouter);
app.use('/refresh',spotifyRefreshTokenRouter);
app.use('/playlists',getUserPlaylistRouter);


app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log('listening on port', PORT);
});
