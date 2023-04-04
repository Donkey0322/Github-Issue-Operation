import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import bodyparser from "body-parser";

// sql.connect(function (err) {
//   if (err) throw err;
//   console.log("DB Connected!");
// });

const app = express();
// init middleware
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// define routes
// app.use("/", test);
app.use("/", router);

// define server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
