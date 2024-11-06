const spotifyApi = require("../../Authentication/spotifyConfig");

const useSpotifyConfig = (req, res) => {
  res.send(spotifyApi);
};
if (spotifyApi) {
  console.log(spotifyApi);
}

exports.useSpotifyConfig = useSpotifyConfig;
