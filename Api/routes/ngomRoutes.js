const express = require("express");
const router = express.Router();

const ngomController = require("../controllers/ngomController");

router.get("/", ngomController.getAllNgom);
router.get("/:id", ngomController.getNgom);
router.post("/sendnegma", ngomController.createNgom);
//router.patch("/:id", ngomController.updateNgom);
router.delete("/:id", ngomController.deleteNgom);

module.exports = router;
