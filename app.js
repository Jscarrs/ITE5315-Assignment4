require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const config = require("./config/database");

const app = express();

// Handlebars setup
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
  })
);

app.set("view engine", ".hbs");
app.set("views", __dirname + "/views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// MongoDB
mongoose
  .connect(config.url)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// Routes
app.use("/listings", require("./routes/listingViews"));
app.get("/", (req, res) => res.redirect("/listings"));

// Server
app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
);
