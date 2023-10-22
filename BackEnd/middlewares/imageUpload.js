const multer = require("multer");
const path = require("path");

//Destination to store image

const imageSotorage  = multer.diskStorage({
  destination: function(req,file,cb){
    let folder = ""

    if(req.baseUrl.includes("users")){
      folder = "users"
    }else if(req.baseUrl.includes("photos")){
      folder = "photos"
    }
    
    cb(null,`uploads/${folder}/`)
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const imageUpload = multer({
  storage:imageSotorage,
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(png|jpg)$/)){
      return cb(new Error("Por favor envie apenas pgn ou jpg!"))
    }
    cb(undefined, true)
  }
})

module.exports = {
  imageUpload
}