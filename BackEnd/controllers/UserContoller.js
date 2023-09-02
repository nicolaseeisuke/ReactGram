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

module.exports = {
  register,
}