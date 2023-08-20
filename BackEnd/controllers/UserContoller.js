const User = require("../models/User.js");

const bcrypt  = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// gerar token de uso

const generateToken = (id) => {
  return jwt.sign({id},jwtSecret,{
    expiresIn:"7d"
  })
}

// registrar usuario e logar
const register = async(req, res) => {
  res.send("Registrou")
}

module.exports = {
  register,
}