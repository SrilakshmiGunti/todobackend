const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri); // Removed deprecated options

const dbname = 'todo'; // Updated database name
const collectionName = 'tododata'; // Updated collection name

let usersCollection;
let assessmentsCollection;

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
    const db = client.db(dbname);
    usersCollection = db.collection(collectionName);
    assessmentsCollection = db.collection(collectionName);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
    process.exit(1);
  }
};

connectToDatabase();

app.get('/', (req, res) => {
  res.send({ success: 'Hello World' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
