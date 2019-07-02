const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.post("/", (req, res) => {
  res.send("TESTE");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
