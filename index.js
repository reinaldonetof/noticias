const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const session = require("express-session");

mongoose.Promise = global.Promise;

const mongo = process.env.MONGODB || "mongodb://localhost/noticias";

const User = require("./models/user");
const noticias = require("./routes/noticias");
const restrito = require("./routes/restrito");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "fullstack-master" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use((req, res, next) => {
  if ("user" in req.session) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use("/restrito", (req, res, next) => {
  if ("user" in req.session) {
    return next();
  }
  res.redirect("/login");
});

app.use("/restrito", restrito);
app.use("/noticias", noticias);
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const isValid = await user.checkPassword(req.body.password);

  if (isValid) {
    req.session.user = user;
    res.redirect("/restrito/noticias");
  } else {
    res.redirect("/login");
  }
  res.send({
    user,
    isValid,
  });
});

app.get("/", (req, res) => res.render("index"));
mongoose
  .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    createInitialUser();
    app.listen(port, () => console.log("listening"));
  })
  .catch((e) => console.log(e));

const createInitialUser = async () => {
  const total = await User.countDocuments({ username: "reinaldo" });
  if (total === 0) {
    const user = new User({
      username: "reinaldo",
      password: "abc",
    });
    await user.save(() => console.log("opa"));
  } else {
    console.log("Usuario cadastrado, vai pro login");
  }
};
