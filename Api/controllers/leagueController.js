const factory = require("./factory");
const db = require("../models");
const LEAGUE = db.models.LEAGUE;
exports.createLeague = async (req, res) => {
  try {
    const creator = req.user.userId;
    const newLeague = await LEAGUE.create({
      leagueName: req.body.leagueName,
      creatorId: creator,
      members: [creator],
    });
    res.status(201).json({
      status: "success",
      data: { newLeague },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getAllLeagues = factory.getAll(LEAGUE);
module.exports.getLeague = factory.getOne(LEAGUE);
//module.exports.updateLeague = factory.updateOne(LEAGUE);
module.exports.deleteLeague = factory.deleteOne(LEAGUE);

exports.joinLeague = async (req, res) => {
  const leagueId = req.params.leagueId;
  const userId = req.user.userId; // Assuming you receive the user ID from the request body

  try {
    // Find the league by ID
    const league = await LEAGUE.findByPk(leagueId);

    if (!league) {
      return res.status(404).json({ message: "League not found" });
    }

    // Check if the league is already full (100 members)
    const currentMembers = league.members;
    if (currentMembers && currentMembers.length >= 100) {
      return res.status(400).json({ message: "League is already full" });
    }
    // check if there exist id
    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the user is already a member of the league
    if (currentMembers && currentMembers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a member of the league" });
    }

    // Add the user ID to the members array
    league.members = [...(currentMembers || []), userId];

    // Save the changes to the database
    await league.save();

    return res
      .status(200)
      .json({ message: "User joined the league successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
