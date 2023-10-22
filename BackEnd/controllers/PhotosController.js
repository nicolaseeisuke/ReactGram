const Photo = require("../models/Photo");
const User = require("../models/User.js");

const mongoose = require("mongoose");

// inserir a foto com o usuario relacionado a ela
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  //create photo

  const newPhoto = await Photo.create({
    image: image,
    title: title,
    userId: user._id,
    userName: user.name,
  });

  // check if photo was create succesfully, return data
  if (!newPhoto) {
    res.status(422).json({
      errors: ["Houve um erro por favor tente novamente mais tarde."],
    });
    return;
  }
  res.status(200).json(newPhoto);

}

const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

  //check if photo exits
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada."] });
    return;
  }

  // check if photo belongs to user
  if (!photo.userId.equals(reqUser._id)) {
    res
      .status(422)
      .json({ errors: ["Houve um erro tente novamente mais tarde."] });
    return;
  }

  await Photo.findByIdAndDelete(photo._id);

  res.status(200).json({ id: photo._id, message: "Foto exluída com sucesso" });
};

// get all photos
const getAllPhotos = async(req, res) => {

  const photos = await Photo.find({}).sort([["createdAt", -1]]).exec()

  res.status(200).json(photos)
}

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos
};
