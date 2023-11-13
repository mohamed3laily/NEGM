const db = require("../models");
const USER = db.models.USER;
const NGOM = db.models.NGOM;
USER.hasMany(NGOM, { foreignKey: "userId" });
NGOM.belongsTo(USER, { as: "sender", foreignKey: "senderId" });
NGOM.belongsTo(USER, { as: "receiver", foreignKey: "receiverId" });

// Define associations involving the Mail model if needed.

module.exports = {
  USER,
  NGOM,
};
