const {body} = require("express-validator");

const photoInsertValidation = () => {
  return [
    body("title")
    .not()
    .equals("undefined")
    .withMessage("O título é obrigatório")
    .isString()
    .withMessage("O título é obrigatório")
    .isLength({min:5})
    .withMessage("O título precisa ter pelo menos 5 caracteres"),
    body("image").custom((value, {req}) => {
      if(!req.file){
        throw new Error("A imagem é obrigatória.");
      }
      return true
    })

  ]
}

module.exports = {
  photoInsertValidation
}