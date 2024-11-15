const fs = require("fs");
const { connectToDatabase } = require("../config/db");
const jsonFilePath = "initialData/data.json";

fs.readFile(jsonFilePath, "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    console.log(jsonData);

    for (let i = 0; i < jsonData.length; i++) {
      const e = jsonData[i];

      const q =
        "INSERT INTO Movie (Title, ReleaseYear, PosterImage, Actors, Director) VALUES (?);";

      const values = [
        e.title,
        e.date,
        e.image,
        "Leonardo DiCaprio, Tom Cruise, Johnny Depp, Chris Hemsworth",
        "James Cameron",
      ];

      const connection = await connectToDatabase();
      await connection.query(q, [values]);
      console.log(i);
    }
  } catch (jsonError) {
    console.error("Error parsing JSON:", jsonError);
  }
});
