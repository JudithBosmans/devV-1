const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(express.json());

const mongoURI =
  "mongodb+srv://admin:admin@cluster0.s584cyu.mongodb.net/Session1(devV)?retryWrites=true&w=majority";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
  } else {
    console.log("Connected to MongoDB");
  }
});

// app.get("/", (request, response) => {
//   response.send({ message: "Peepeepoopoo" });
// });

app.listen(3000, (err) => {
  if (!err) {
    console.log("Running on port" + 3000);
  } else {
    console.error(err);
  }
});

app.get("/get-data", async (request, response) => {
  try {
    const db = client.db();
    const collection = db.collection("Test");

    const data = await collection.find({}).toArray();
    response.json(data);
  } catch (err) {
    console.error("Error met fecthen data van Mongodb", err);
    response.status(500).json({ error: "Internal server error" });
  }
});

app.post("/post-data", async (request, response) => {
  try {
    const collection = client.db("Session1(devV)").collection("Test");
    const hobby = {
      name: request.body.name,
      hobby: request.body.hobby,
    };

    await collection.insertOne(hobby);

    response.status(201).send({
      status: "OK requestuest",
      message: "Hobby saved to database",
    });
  } catch (err) {
    console.error("Error met data in MongoDB te inserten", err);
    response.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/delete-data", async (request, response) => {
  try {
    const collection = client.db("Session1(devV)").collection("Test");
    const hobby = {
      name: request.body.name,
      hobby: request.body.hobby,
    };

    await collection.deleteOne(hobby);

    response.status(201).send({
      status: "OK requestuest",
      message: "Data deleted",
    });
  } catch (err) {
    console.error("Error met data in MongoDB te inserten", err);
    response.status(500).json({ error: "Internal server error" });
  }
});

process.on("SIGINT", () => {
  client.close();
  console.log("Mongodb connectie gesloten");
  process.exit();
});
