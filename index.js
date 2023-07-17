const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Parse JSON data from request body

const uri = 'mongodb+srv://taskpro:taskpro@cluster0.nyrjtse.mongodb.net/taskpro?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');

    app.get('/tasks', async (req, res) => {
      try {
        const db = client.db('taskpro');
        const collection = db.collection('tasks');
        const tasks = await collection.find().toArray();
        res.json(tasks);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving tasks' });
      }
    });

    app.get('/users', async (req, res) => {
      try {
        const db = client.db('taskpro');
        const collection = db.collection('users');
        const users = await collection.find().toArray();
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users' });
      }
    });

    app.get('/messages', async (req, res) => {
      try {
        const db = client.db('taskpro');
        const collection = db.collection('messages');
        const messages = await collection.find().toArray();
        res.json(messages);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving messages' });
      }
    });

    app.post('/messages', async (req, res) => {
      try {
        const db = client.db('taskpro');
        const collection = db.collection('messages');
        const { name, email, message } = req.body;
        const newMessage = {
          name,
          email,
          message,
          createdAt: new Date(),
        };
        await collection.insertOne(newMessage);
        res.status(201).json({ message: 'Message sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message' });
      }
    });

    app.delete('/messages/:id', async (req, res) => {
      try {
        const messageId = req.params.id;
        const db = client.db('taskpro');
        const collection = db.collection('messages');
        const result = await collection.deleteOne({ _id: new ObjectId(messageId) });
        
        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Message deleted successfully' });
        } else {
          res.status(404).json({ message: 'Message not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting message' });
      }
    });


// delete user



app.delete('/tasks/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    console.log('Task ID to delete:', taskId);

    const db = client.db('taskpro');
    const collection = db.collection('tasks');
    const result = await collection.deleteOne({ _id: new ObjectId(taskId) });
    console.log('Delete result:', result);

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

app.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('User ID to delete:', userId);

    const db = client.db('taskpro');
    const collection = db.collection('users');
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });
    console.log('Delete result:', result);

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});



app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const db = client.db('taskpro');
    const collection = db.collection('users');
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Error retrieving user' });
  }
});

// post method of task

app.post('/tasks', async (req, res) => {
  try {
    const db = client.db('taskpro');
    const collection = db.collection('tasks');
    const { taskName, creationDate, deadline, comment, status } = req.body;
    const newTask = {
      taskName,
      creationDate,
      deadline,
      comment,
      status,
    };
    await collection.insertOne(newTask);
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task' });
  }
});



    app.post('/users', async (req, res) => {
        try {
          const db = client.db('taskpro');
          const collection = db.collection('users');
          const { displayName, email, password } = req.body;
          const newUser = {
            displayName,
            email,
            password,
            createdAt: new Date(),
          };
          await collection.insertOne(newUser);
          res.status(201).json({ user: newUser, message: 'User created successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error creating user' });
        }
      });

  } finally {
    // Ensures that the client will close when you finish/error
    // client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
