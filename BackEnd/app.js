require("dotenv").config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT

const app = express()

// config JSON e form dados resposta
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// resolver cors
app.use(cors({credentials:true, origin:"http://localhost:3000"}))

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

// DB concection (conexão com o banco de dados)
require("./config/db.js")

//Rotas
const router = require("./routes/Router.js");
app.use(router);

app.listen(PORT, () => {
  console.log("app rodando na porta " + PORT);
})