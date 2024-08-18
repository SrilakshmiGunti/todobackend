const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const dbname = 'todo';
const collectionName = 'tododata';

let todoCollection;

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
    const db = client.db(dbname);
    todoCollection = db.collection(collectionName);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
    process.exit(1);
  }
};

connectToDatabase();

// Add a new task
app.post('/add-task', async (req, res) => {
  try {
    const { task, completed = false } = req.body; // Default completed to false
    if (!task) {
      return res.status(400).send({ error: 'Task is required' });
    }
    const result = await todoCollection.insertOne({ task, completed });
    res.status(201).send({ success: 'Task added successfully', taskId: result.insertedId });
  } catch (err) {
    console.error(`Error adding task: ${err}`);
    res.status(500).send({ error: 'Error adding task' });
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await todoCollection.find().toArray();
    res.status(200).send(tasks);
  } catch (err) {
    console.error(`Error fetching tasks: ${err}`);
    res.status(500).send({ error: 'Error fetching the tasks' });
  }
});

// Update a task
app.put('/update-task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { task, completed } = req.body;
    const result = await todoCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { task, completed } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.status(200).send({ success: 'Task updated successfully' });
  } catch (err) {
    console.error(`Error updating task: ${err}`);
    res.status(500).send({ error: 'Error updating task' });
  }
});

// Delete a task
app.delete('/delete-task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const result = await todoCollection.deleteOne({ _id: new ObjectId(taskId) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.status(200).send({ success: 'Task deleted successfully' });
  } catch (err) {
    console.error(`Error deleting task: ${err}`);
    res.status(500).send({ error: 'Error deleting task' });
  }
});

app.get("/",(res,req) => {
    res.send("Hello World!")
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
