const { populate } = require("dotenv");
const { Request } = require("../../models/request");
const { Song } = require("../../models/song");
const { User } = require("../../models/user");

/////////////////////////////////////Request a track to the DJ/////////////////////////////////////////////////
const requestSong = async (req, res) => {
  try {
    const userId = req.user.userId;
    const songId = req.params.spotifyid;

    const user = await User.findById(userId);
    const song = await Song.findOne({
      spotifyId: songId,
    });

    if (!user || !song) {
      return res.status(500).json({
        success: false,
        message: "Request cannot be completed",
        data: null,
        errorMessage: !user ? "User not found" : "Requested track not found",
      });
    }

    const existingRequest =
      song.requestData.requestedUser === userId || song.requestData.isRequested;

    if (existingRequest) {
      return res.status(200).json({
        success: false,
        message: "This track already requested by someone",
        data: null,
        errorMessage: "This track already requested by someone",
      });
    }

    await Song.findOneAndUpdate(
      { spotifyId: songId },
      {
        "requestData.isRequested": true,
        "requestData.requestedUser": userId,
        "requestData.requestedTrack": songId,
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({
      success: true,
      message: "Track successfully added to the DJ's que",
      data: null,
      errorMessage: null,
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

///////////////////////////////////////////////////// Get My reuests songs list//////////////////////////////////////////////////////
const myRequests = async (req, res) => {
  const userId = req.user.userId;
  try {
    const myRequests = await Song.find({
      "requestData.requestedUser": userId,
    }).select("-requestData");
    if (!myRequests) {
      return res.status(200).json({
        success: false,
        message: "There is no any requested tracks by you",
        data: null,
        errorMessage: "There is no any requested tracks by you",
      });
    }
    res.status(200).json({
      success: true,
      message: "Requested tracks fetched successfully",
      data: myRequests,
      errorMessage: "Requested tracks fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
      errorMessage: err.message,
    });
  }
};
//////////////////Get DJ Que sorted according to BPM/////////////////
const getDjQue = async (req, res) => {
  try {
    const bpmQue = await Song.find({ "requestData.isRequested": true }).sort({
      "songFeatures.bpm": 1,
    });
    // .sort({ "songFeatures.bpm": 1 });
    console.log(bpmQue);
    res.status(200).send(bpmQue);
  } catch (err) {
    res.send(err.message);
  }
};

exports.getDjQue = getDjQue;
exports.requestSong = requestSong;
exports.myRequests = myRequests;
