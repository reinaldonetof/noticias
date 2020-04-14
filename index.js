const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const mongo = process.env.MONGODB || "mongodb://localhost/noticias";

const User = require('./models/user')

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => res.render("index"));
mongoose
  .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => console.log("listening"));
  })
  .catch((e) => console.log(e));

  const createInitialUser = async() => {
    const total = await User.count({ username: 'reinaldo'})
    if(total === 0) {
      const user = new User({
        username: 'reinaldo',
        password: 'abc'
      })
      await user.save(()=> console.log('opa'))
    }
    else {
      console.log('Usuario cadastrado, vai pro login')
    }
  }