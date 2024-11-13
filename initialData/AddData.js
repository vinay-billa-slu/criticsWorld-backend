const fs = require("fs");
const { connectToDatabase } = require("../config/db");
const jsonFilePath = "initialData/data.json";

fs.readFile(jsonFilePath, "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
    return;
  }
});