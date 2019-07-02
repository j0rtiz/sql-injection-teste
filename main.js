const { Pool } = require("pg");
const pg = new Pool({
  user: "viecjvygkuylqf",
  host: "ec2-23-21-109-177.compute-1.amazonaws.com",
  database: "d3afd7kopiv0r2",
  password: "b4889d889f5452493f01f6173c376a36ad7e0c731197181c4a7d2aaff3a60859",
  port: 5432,
  ssl: true
});
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.show = name => {
    res.sendFile(`/${name}`, { root: __dirname });
  };
  next();
});

app.get("/", (req, res) => {
  res.show("login.html");
});

app.post("/login", (req, res) => {
  const login = req.body.login;
  const senha = req.body.senha;
  const sql = `SELECT * FROM usuarios WHERE login = '${login}' AND senha = '${senha}'`;

  if (login && senha) {
    pg.query(sql)
      .then(result => {
        if (result.rowCount > 0) {
          req.session.logged = true;
          req.session.login = login;
          res.redirect("/home");
        } else {
          res.send("Dados inválidos!");
        }
        res.end();
      })
      .catch(error => {
        throw error;
      });
  } else {
    res.send("Entre com Login e Senha!");
    res.end();
  }
});

app.get("/home", (req, res) => {
  if (req.session.logged) {
    res.send(`Bem vindo, ${req.session.login}!`);
  } else {
    res.send("Você precisa efetuar login para visualizar esta página!");
  }
  res.end();
});

app.listen(3000, () => {
  console.clear();
  console.log("App listening on port 3000!");
});
