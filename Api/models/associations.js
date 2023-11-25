const db = require("../models");
const USER = db.models.USER;
const NGOM = db.models.NGOM;
const LEAGUE = db.models.LEAGUE;

USER.hasMany(NGOM, { foreignKey: "userId" });
NGOM.belongsTo(USER, { as: "sender", foreignKey: "senderId" });
NGOM.belongsTo(USER, { as: "receiver", foreignKey: "receiverId" });

USER.hasMany(LEAGUE, { foreignKey: "creatorId" });
LEAGUE.belongsTo(USER, { as: "creator", foreignKey: "creatorId" });

// Define associations involving the Mail model if needed.

module.exports = {
  USER,
  NGOM,
};
