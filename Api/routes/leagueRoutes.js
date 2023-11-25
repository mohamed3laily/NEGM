const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const leagueController = require("../controllers/leagueController");

router.get("/", leagueController.getAllLeagues);
router.get("/:id", leagueController.getLeague);
router.post(
  "/createLeague",
  authController.protect,
  userController.getMe,
  leagueController.createLeague
);
router.post(
  "/joinLeague/:leagueId",
  authController.protect,
  userController.getMe,
  leagueController.joinLeague
);
//router.patch("/:id", ngomController.updateNgom);
router.delete("/:id", leagueController.deleteLeague);

module.exports = router;
