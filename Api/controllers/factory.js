const associations = require("../models/associations");
const { USER, NGOM } = associations;

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const itemToDelete = await Model.findByPk(req.params.id);
    if (!itemToDelete) {
      return next(res.status(404).json({ message: "Item not found" }));
    }
    await itemToDelete.destroy();

    res.status(201).json({
      status: "success",
      data: {
        message: "Item deleted successfully",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.updateOne = (Model) => async (req, res, next) => {
//   try {
//     const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedItem) {
//       return next(res.status(404).json({ message: "Item not found" }));
//     }
//     res.status(200).json({
//       status: "success",
//       data: {
//         updatedItem,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
// create one item
exports.createOne = (Model) => async (req, res) => {
  try {
    const newItem = await Model.create(req.body);
    // Load the "receiver" association
    await newItem.reload({ include: "receiver" });

    // Access the receiver using the getReceiver() method
    const receiver = newItem.getReceiver();

    if (receiver) {
      console.log(await receiver, "Receiver found.");

      // Continue with your logic here
    } else {
      console.log("Receiver not found.");
    }

    res.status(201).json({
      status: "success",
      data: { newItem },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//////////// get one item
exports.getOne = (Model, popOptions) => async (req, res) => {
  try {
    let query = Model.findByPk(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const item = await query;
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/////// get all items
exports.getAll = (Model) => async (req, res) => {
  try {
    const items = await Model.findAll();

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
