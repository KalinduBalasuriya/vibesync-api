const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { spotifyAuthorization } = require("./Authentication/spotifyAuth");
// const spotifyWebApi = require("spotify-web-api-node");
// const spotifyApi = require("./Authentication/spotifyConfig");

app.use(cors());
app.options("*", cors());
require("dotenv/config");

app.use(bodyParser.json());
app.use(morgan("tiny"));

const api = process.env.API_URL;

// const { useSpotifyConfig } = require("./controllers/Guest/useSpotifyConfig");
// app.get("/spotifyInit", useSpotifyConfig);
//spotify auth

// let spotifyApi = new spotifyWebApi({
//   clientId: process.env.SPOTIFY_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
// });
// if (spotifyApi) {
//   console.log(`Spotify client initilized: ${spotifyApi._credentials.clientId}`);
// }

app.get("/spotifyAuth", spotifyAuthorization);
app.get("/", (req, res) => {
  res.status(200).send("Server is running..");
});

//Routes
const usersRouter = require("./routers/userRoutes");
const songsRouter = require("./routers/songsRoutes");
const partiesRouter = require("./routers/partyRoutes");

app.use(`${api}/users`, usersRouter);
app.use(`${api}/songs`, songsRouter);
app.use(`${api}/parties`, partiesRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "dj-jeff-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("server is runnning on http://localhost:3000");
});

// exports.spotifyAPI = spotifyApi;
