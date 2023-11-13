const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const USER = sequelize.define(
    "User",
    {
      // Model attributes are defined here
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use Sequelize's UUIDV4 function to generate random UUIDs
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Enforce unique usernames
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password cannot be empty.",
          },
          len: {
            args: [6, 255],
            msg: "Password must be between 6 and 255 characters.",
          },
        },
      },
      passwordConfirm: {
        type: DataTypes.VIRTUAL, // Define as a virtual attribute
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password confirmation cannot be empty.",
          },
          matchesPassword: function (value) {
            // Custom validation to ensure password and passwordConfirm match
            if (value !== this.password) {
              throw new Error(
                "Password confirmation does not match the password."
              );
            }
          },
        },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Enforce unique emails
        validate: {
          isEmail: true, // Validate email format
        },
      },
      fullName: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.STRING,
        validate: {
          isUrl: {
            args: true,
            msg: "Avatar must be a valid URL.",
          },
        },
      },
      numberOfRatings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      // Other model options go here
    }
  );

  USER.beforeCreate(async (user, options) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  USER.beforeUpdate(async (user, options) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });
  //////// Exclude passwordConfirm from JSON output
  USER.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.passwordConfirm; // Exclude passwordConfirm from JSON output
    return values;
  };

  ////// Compare password
  USER.prototype.comparePassword = async function (candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw new Error(error);
    }
  };

  USER.prototype.incrementReceivedMessagesCount = async function () {
    this.numberOfRatings += 1;
    await this.save();
  };

  return USER;
};
