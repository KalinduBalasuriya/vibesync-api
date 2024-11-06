// const spotifyAPI = require("../app");
const spotifyApi = require("./spotifyConfig");

let spotifyAccessToken = null;
let spotifyTokenExpiresIn = null;
let tokenIssuedAt = null;

const spotifyAuthorization = async (req, res) => {
  try {
    const tokenData = await spotifyApi.spotifyApi.clientCredentialsGrant();
    spotifyApi.spotifyApi.setAccessToken(tokenData.body["access_token"]);

    spotifyAccessToken = tokenData.body["access_token"];
    spotifyTokenExpiresIn = tokenData.body["expires_in"];
    tokenIssuedAt = Math.floor(Date.now() / 1000);
    console.log("SPOTIFY OK!");
    res.status(200).json({
      token: tokenData.body["access_token"],
      tokenExpiresIn:
        Math.floor(Date.now() / 1000) + tokenData.body["expires_in"],
      currentTime: Math.floor(Date.now() / 1000),
    });
  } catch (err) {
    console.log(err);
  }
};

const refreshToken = async (req, res) => {
  try {
    const newTokenData = await spotifyApi.spotifyApi.clientCredentialsGrant();
    spotifyApi.spotifyApi.setAccessToken(newTokenData.body["access_token"]);

    spotifyAccessToken = newTokenData.body["access_token"];
    spotifyTokenExpiresIn = newTokenData.body["expires_in"];
    tokenIssuedAt = Math.floor(Date.now() / 1000);

    console.log("Spotify access token refreshed!");
  } catch (err) {
    console.log(err);
  }
};

const checkToken = async (req, res, next) => {
  if (spotifyAccessToken) {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expirationTime = tokenIssuedAt + 3000;
    const is = expirationTime <= currentTime;
    console.log(`current tim: ${currentTime}`);
    console.log(`expiration tim: ${expirationTime}`);
    console.log(is);
    if (is) {
      await refreshToken(req, res);
    } else if (!is) {
      console.log("----------------VALID SPOTIFY TOKEN-------------");
    }
  }
  if (!spotifyAccessToken) {
    await refreshToken(req, res);
  }
  next();
};
// exports.spotifyAPI = spotifyAPI;
exports.checkToken = checkToken;
exports.spotifyAuthorization = spotifyAuthorization;
