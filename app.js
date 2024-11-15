const express = require("express");
const cors = require("cors");
const session = require("express-session");

const config = require("./config/index");

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"));
app.use("*", express.static(__dirname + "/public"));

const UserRoutes = require("./routes/User");
const MovieRoutes = require("./routes/Movie");
const ReviewRoutes = require("./routes/Review");
const AuthRoutes = require("./routes/Auth");

const { ErrorMiddleWare } = require("./middleware/ErrorMiddleWare");
const { Upload } = require("./middleware/UploadMulter");
const { verifyTokenAndAdmin } = require("./middleware/Auth");

app.use("/api/user", UserRoutes);
app.use("/api/movie", MovieRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/auth", AuthRoutes);

app.use("/upload", Upload.single("file"), (request, response, next) => {
  try {
    response.json({
      success: true,
      filename: "/images/" + request.file.filename,
    });
  } catch (error) {
    next(error);
  }
});

app.use("/ping", (request, response) => {
  response.json({ message: "I am working...." });
});

app.use(ErrorMiddleWare);

app.listen(config.PORT, () => {
  console.log("Listening on PORT : ", config.PORT);
});
