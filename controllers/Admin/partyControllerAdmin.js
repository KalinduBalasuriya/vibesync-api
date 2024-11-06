const { Party } = require("../../models/party");

const createParty = async (req, res) => {
  const user = req.user;

  try {
    let party = new Party({
      admin: user.userId,
      partyId: req.body.partyId,
      partyName: req.body.partyName,
    });
    party = await party.save();
    if (!party) {
      return res.status(400).json({
        success: false,
        message: null,
        data: null,
        errorMessage: "Party cannot be created!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Party created successfully",
      data: {
        party: party,
      },
      errorMessage: null,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: null,
      data: null,
      errorMessage: "Unable to create the Party! try unique Name and Id",
    });
  }
};

exports.createParty = createParty;
