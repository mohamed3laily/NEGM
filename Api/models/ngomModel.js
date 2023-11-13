const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const NEGMA = sequelize.define(
    "NEGMA",
    {
      // Model attributes are defined here
      NegmaId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use Sequelize's UUIDV4 function to generate random UUIDs
        primaryKey: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "rating cannot be empty.",
          },
          len: {
            args: [1, 10],
            msg: "rating must be between 1 and 10",
          },
        },
      },
      ratingContent: {
        type: DataTypes.STRING,
      },
      senderId: {
        type: DataTypes.UUID,
        // allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      tableName: "NGOM",
    }
  );

  return NEGMA;
};
