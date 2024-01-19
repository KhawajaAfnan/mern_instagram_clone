const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { getLoggedInUsername } = require('../src/user');



const port = 3001;



// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Item model
const itemSchema = new mongoose.Schema({
  user: String,        
  userimg: String,   
  postImage: String, 
  likes: Number,
  timestamp: String,
});

const Item = mongoose.model('Item', itemSchema);

//USer schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  img: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));


// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Send response
function sendResponse(res, data, status = 200) {
  res.status(status).json({ data });
}

// Get all items
app.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    sendResponse(res, items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/suggestions', async (req, res) => {
  try {
    const suggestedUsers = await User.find();
    sendResponse(res, suggestedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/:id', async (req, res) => {
  try {
    const items = await Item.findOne({id: parseInt(req.params.id)});
res.status(200).json({data: items});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});

// Post a new item
app.post('/', async (req, res) => {
  try {
    const newItem = req.body;
    newItem.likes = 0; // Set initial likes to 0
    newItem.timestamp = new Date().toISOString(); // Set timestamp to current time

    const savedItem = await Item.create(newItem);
    sendResponse(res, savedItem, 201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update an item (PUT)
app.put('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = req.body;
    const result = await Item.findByIdAndUpdate(itemId, updatedItem, { new: true });
    sendResponse(res, result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Partially update an item (PATCH)
app.patch('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const partialUpdate = req.body;
    const result = await Item.findByIdAndUpdate(itemId, partialUpdate, { new: true });
    sendResponse(res, result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an item
app.delete('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const result = await Item.findByIdAndDelete(itemId);
    sendResponse(res, result);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// User registration
app.post('/register', async (req, res) => {
  try {
    const newUser = req.body;
    // Create the user and store the username in the session
    req.session.username = newUser.username;
   
    const savedUser = await User.create(newUser);
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login
// User login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Validate the user's credentials
    const user = await User.findOne({ username, password });
    if (user) {
      // Store the username and image URL in the session
      req.session.username = user.username;
      req.session.img = user.img; // Set the user image here
      res.status(200).json({ message: 'Login successful', img: user.img }); // Include the user image in the response
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

