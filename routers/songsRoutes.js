const express = require("express");
const {
  getAllSongs,
  getCategoryPlaylists,
  getPlaylist,
  addTracks,
  deleteTracks,
  deleteAllTracks,
} = require("../controllers/Admin/songsControllerAdmin");
const authJwt = require("../Authentication/auth");
const { validateRole } = require("../Authentication/accessController");
const { getCategories } = require("../controllers/Admin/songsControllerAdmin");
const { checkToken } = require("../Authentication/spotifyAuth");
const {
  requestSong,
  myRequests,
  getDjQue,
} = require("../controllers/Guest/songControllerGuest");
const router = express.Router();

//routes for songs
router.get("/allsongs", getAllSongs);
router.get("/allcategories", authJwt(), checkToken, getCategories);
router.get(
  "/categories/:categoryid",
  authJwt(),
  checkToken,
  getCategoryPlaylists
);
router.get(
  "/categoryplaylists/:playlistid",
  authJwt(),

  checkToken,
  getPlaylist
);
router.post(
  "/addtracks",
  authJwt(),

  checkToken,
  addTracks
);
router.delete(
  "/deletetracks",
  authJwt(),
  validateRole(["Admin"]),
  checkToken,
  deleteTracks
);
router.delete("/deletealltracks", deleteAllTracks);

//routes for users
router.put("/guestuser/requestsong/:spotifyid", authJwt(), requestSong);
router.get("/guestuser/myrequests/", authJwt(), myRequests);
router.get("/getbpmque", getDjQue);

// router.post("/addsong", authJwt(), validateRole(["Admin"]), addSong);

module.exports = router;
