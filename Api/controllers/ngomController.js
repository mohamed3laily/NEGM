const ngom = require("../models");
const factory = require("./factory");

const { NGOM } = ngom.models;

exports.getAllNgom = factory.getAll(NGOM);
exports.getNgom = factory.getOne(NGOM);
exports.createNgom = factory.createOne(NGOM);
exports.deleteNgom = factory.deleteOne(NGOM);
