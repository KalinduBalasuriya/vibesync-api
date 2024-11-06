const spotifyApi = require("../../Authentication/spotifyConfig");
const { Song } = require("../../models/song");
// const spotifyAPI = require("../../app");

/////////////////Get all categories from Spotify (For Admin)
const getCategories = async (req, res) => {
  spotifyApi.spotifyApi
    .getCategories({
      limit: 20,
    })
    .then(
      function (data) {
        res.status(200).json({
          success: true,
          message: "Categories fetched",
          data: {
            songs: data.body.categories.items,
          },
          errorMessage: null,
        });
      },
      function (err) {
        res.status(500).json({
          success: false,
          message: "Categories fetching failed",
          data: {
            songs: null,
          },
          errorMessage: err.message,
        });
      }
    );
};

///////////////////////Get all playlists belong to a category//////////////////////////
const getCategoryPlaylists = async (req, res) => {
  const categoryId = req.params.categoryid;
  spotifyApi.spotifyApi
    .getPlaylistsForCategory(categoryId, {
      limit: 20,
      offset: 0,
    })
    .then(
      function (data) {
        res.status(200).json({
          success: true,
          message: "Playlists of the category fetched",
          data: {
            songs: data.body.playlists.items,
            // token: req.headers["authorization"],
          },
          errorMessage: null,
        });
      },
      function (err) {
        res.status(500).json({
          success: false,
          message: "Category playlists fetching failed",
          data: {
            songs: null,
          },
          errorMessage: err.message,
        });
        console.log("Something went wrong!", err);
      }
    );
};

//////////////////////////// Search for a song by typing////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////Add tracks to to the DB//////////////////////
const addTracks = async (req, res) => {
  const trackIds = req.body;
  const user = req.user;
  console.log(user);

  try {
    //Fetching audio tracks
    const songTracks = await spotifyApi.spotifyApi.getTracks(trackIds);
    if (!songTracks) {
      return res.status(500).json({
        success: false,
        message: "No tracks found from Spotify",
        data: {
          songs: null,
          // token: req.headers["authorization"],
        },
        errorMessage: "Fetch tracks from Spotify failed",
      });
    }
    //Fetching audio features of tracks
    const audioFeatures =
      await spotifyApi.spotifyApi.getAudioFeaturesForTracks(trackIds);

    // Filter null values of tracks
    let tracks = songTracks.body.tracks;
    tracks = tracks.filter((track) => track !== null);

    // Filter null values of audio features
    let features = audioFeatures.body.audio_features;
    features = features.filter((feature) => feature !== null);

    //Filter ids of tracks didn't fetched from spotiify
    const nullTracks = trackIds.filter(
      (trackId) => !tracks.some((track) => track.id === trackId)
    );

    //Filter ids of audio features didn't fetched from spotiify
    const nullFeatures = trackIds.filter(
      (trackId) => !features.some((feature) => feature.id === trackId)
    );
    /////Here checking is all the fetched songs already in the playlist(Database)

    trackIdsFoundOnSpotify = trackIds.filter(
      (track) => !nullTracks.includes(track)
    );
    console.log(`fetched track IDs:${trackIdsFoundOnSpotify}`);

    const tracksOnDb = await Song.find().select("spotifyId -_id");
    // console.log(`number of existing tracks ${existing.length}`);
    const notInDb = trackIdsFoundOnSpotify.filter(
      (id) => !tracksOnDb.some((item) => item.spotifyId === id)
    );
    console.log(`Is DB empty? :${tracksOnDb.length === 0}`);
    console.log(notInDb);
    console.log(tracksOnDb);

    if (
      notInDb.length === 0 &&
      tracksOnDb.length !== 0 &&
      tracksOnDb.length !== null
    ) {
      return res.status(200).json({
        success: true,
        message: "Track(s) already in the playlist",
        data: {
          missingSongIdsOnSpotify: nullTracks,
          missingAudioFeatureOnSpotify: nullFeatures,
          addedSongsIds: notInDb,
        },
        errorMessage: "Track(s) already in the playlist",
      });
    }

    //saving audio track in Database
    for (const element of tracks) {
      const existingSong = await Song.findOne({ spotifyId: element.id });
      if (!existingSong) {
        let song = new Song({
          spotifyId: element.id,
          songName: element.name,
          artistName: element.artists[0].name,
          imageUrl: element.album.images[2].url,
          isPlayed: false,
          userRequestCount: 0,
          requestData: {
            isRequested: true,
            requestedUser: user.userId,
          },
        });
        song = await song.save();
      }
    }

    //saving audio track features in Database
    for (element of features) {
      const existingFeature = await Song.findOne({
        spotifyId: element.id,
      });
      if (existingFeature && existingFeature.SongFeature !== null) {
        await Song.findOneAndUpdate(
          { spotifyId: element.id },
          {
            "songFeatures.spotifyId": element.id,
            "songFeatures.bpm": element.tempo,
            "songFeatures.danceability": element.danceability,
            "songFeatures.loudness": element.loudness,
          },
          { new: true, useFindAndModify: false }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Songs added to the Database successfully",
      data: {
        missingSongIds: nullTracks,
        missingAudioFeatureIds: nullFeatures,
        addedSongsIds: notInDb,
      },
      errorMessage: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "playlist fetching failed",
      data: {
        songs: null,
        // token: req.headers["authorization"],
      },
      errorMessage: err.message,
    });
  }
};

///////////////////////////////Get a playlist of a category using a category ID//////////////////////////
const getPlaylist = async (req, res) => {
  const playListId = req.params.playlistid;
  spotifyApi.spotifyApi.getPlaylist(playListId).then(
    function (data) {
      res.status(200).json({
        success: true,
        message: "Playlist fetched successfuly",
        data: {
          songs: data.body.tracks.items,
          // token: req.headers["authorization"],
        },
        errorMessage: null,
      });
    },
    function (err) {
      res.status(500).json({
        success: false,
        message: "playlist fetching failed",
        data: {
          songs: null,
          // token: req.headers["authorization"],
        },
        errorMessage: err.message,
      });
      console.log("Something went wrong!", err);
    }
  );
  ////////////////////////////////////////////////////
};

///////////////////////////////Get all the songs in our Database/////////////////////////
const getAllSongs = async (req, res) => {
  try {
    const songList = await Song.find();
    if (!songList) {
      return res(200).json({
        success: false,
        message: "No songs found!",
        data: {
          songs: null,
          // token: req.headers["authorization"],
        },
        errorMessage: "Songs not found",
      });
    }
    const dataCount = songList.length;
    return res.status(200).json({
      success: true,
      message: "Songs fetched successfuly",
      data: {
        songs: songList,
        count: dataCount,
        // token: req.headers["authorization"],
      },
      errorMessage: "Songs fetched successfuly",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
      errorMessage: err.message,
    });
  }
};

////////////////////////////////Delete tracks /////////////////////////////////////////////////////////
const deleteTracks = async (req, res) => {
  const tracksToBeDeleted = req.body;
  console.log(tracksToBeDeleted);

  try {
    Song.find;
    const result = await Song.deleteMany({
      spotifyId: { $in: tracksToBeDeleted },
    });
    if (result.deletedCount < tracksToBeDeleted.length) {
      return res.status(200).json({
        success: false,
        message:
          result.deletedCount === 0
            ? "Cannot delete tracks"
            : "Some tracks cannot be deleted",
        data: null,
        errorMessage:
          result.deletedCount === 0
            ? "Cannot delete tracks"
            : "Some tracks cannot be deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Songs deleted successfuly",
      data: {
        deletedTrackIds: tracksToBeDeleted,
        tracksNotFound: null,
      },
      errorMessage: null,
    });
  } catch (err) {
    res.status(200).json({
      success: false,
      message: err.message,
      data: null,
      errorMessage: err.message,
    });
  }
};

const deleteAllTracks = async (req, res) => {
  try {
    const deleteAll = await Song.deleteMany();
    res.status(200).send("songs deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteTracks = deleteTracks;
exports.deleteAllTracks = deleteAllTracks;
exports.addTracks = addTracks;
exports.getCategoryPlaylists = getCategoryPlaylists;
exports.getPlaylist = getPlaylist;
exports.getCategories = getCategories;
exports.getAllSongs = getAllSongs;
