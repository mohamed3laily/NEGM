module.exports = (sequelize, DataTypes) => {
  const LEAGUE = sequelize.define(
    "LEAGUE",
    {
      // Model attributes are defined here
      leagueId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use Sequelize's UUIDV4 function to generate random UUIDs
        primaryKey: true,
      },
      leagueName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "a league must have a name.",
          },
          len: {
            args: [3, 65],
            msg: "League name must be between 3 and 65 characters.",
          },
        },
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "a league must have a Creator.",
          },
        },
      },
      members: {
        type: DataTypes.TEXT, // Store as text in the database
        allowNull: true,
        get() {
          const value = this.getDataValue("members");
          return value ? JSON.parse(value) : [];
        },
        set(value) {
          if (Array.isArray(value) && value.length <= 100) {
            this.setDataValue("members", JSON.stringify(value));
          } else {
            throw new Error(
              "Array exceeds maximum length of 100 or is not an array"
            );
          }
        }, // Define an array of strings
        allowNull: false,
      },
    },
    {
      // Other model options go here
    }
  );

  return LEAGUE;
};
