import 'dotenv/config';

export default {
  expo: {
    name: "Weeks",
    slug: "weeks",
    
    extra: {
        spotifyApi: process.env.SPOTIFY_API
    }
  }
};