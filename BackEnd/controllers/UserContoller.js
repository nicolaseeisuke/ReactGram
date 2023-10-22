const User = require("../models/User.js");

const bcrypt  = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

// gerar token de uso
const generateToken = (id) => {
  return jwt.sign({id},jwtSecret,{
    expiresIn:"7d"
  })
}

// registrar usuario e logar
const register = async(req, res) => {
  const {name, email,password} = req.body

  // check if user exist
  const user = await User.findOne({email})
  if(user){
    res.status(422).json({errors: ["E-mail já ultiliazado"]})
    return
  }

  // generate password hash
  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password,salt)

  //create User
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  })

  // if user was create succsfully, return token
  if(!newUser){
      res.status(422).json({errors: ["Houve um erro no sistema tente novamnete mais tarde"]})
      return
  }

  res.status(201).json({
    id: newUser._id,
    token: generateToken(newUser._id),
  })
}

const login = async(req,res) => {

  const {email,password} = req.body

  const user = await User.findOne({email})
// check user exists
  if(!user){
    res.status(404).json({errors: ["Usuário não encontrado."]})
    return
  }

// check if password matches 
  if(!(await bcrypt.compare(password, user.password))){
    res.status(422).json({errors: ["Senha inválida "]})
    return
  }
 
  res.status(201).json({
      id: user._id,
      profileImage: user.profileImage, 
      token: generateToken(user._id),
  })

}

// resgatar usuário logado
 const getCurrentUser = async(req,res) => {
  const user = req.user;

  res.status(200).json(user)
 }

 // update an user 
 const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(reqUser._id).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

//get user by id
const getUserById = async(req, res) => {

  const {id} = req.params
  
    const user = await User.findById(id).select("-password") 
    
    //check user exixts

    if(!user){
      res.status(404).json({errors:"[Usuário não encontrado]"})
      return
    }

    res.status(200).json(user)

}

module.exports = {
  register,
  login,
  getCurrentUser,
  getUserById,
  update
}