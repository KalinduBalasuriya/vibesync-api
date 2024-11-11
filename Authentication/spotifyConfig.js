const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: "77eef48d83c34a44bfff1274958e12cd",
  clientSecret: "510a54ca8a1a4db99f062fa2f0ac32c7",
});

exports.spotifyApi = spotifyApi;
