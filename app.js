const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const app = express();
const PORT = process.env.PORT || 3000;
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const userRoute = require("./routes/userRoute");
const categoriesRoute = require("./routes/categoriesRoute");
const chocolateBoxRoute = require("./routes/chocolateBoxRoute");
const trayRoute = require("./routes/trayRoute");
const packageRoute = require("./routes/packagesRoute");
const cakeRoute = require("./routes/cakesRoute");

// middlewares

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// DB connecetion
dbConnection();

// Mount Routes
app.use("/api/v1/categories", categoriesRoute);
app.use("/api/v1/login", userRoute);
app.use("/api/v1/chocolateBox", chocolateBoxRoute);
app.use("/api/v1/trays", trayRoute);
app.use("/api/v1/packages", packageRoute);
app.use("/api/v1/cakes", cakeRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

const server = app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);

// UnhandledRejections event handler (rejection outside express)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("server shutting down...");
    process.exit(1);
  });
});
