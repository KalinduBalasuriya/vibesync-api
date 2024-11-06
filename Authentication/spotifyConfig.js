const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: "1c13d4930df04e0692518e5fe2b4d4c9",
  clientSecret: "a3c3470478f24a948dcf87dc614c2f3f",
});

exports.spotifyApi = spotifyApi;
