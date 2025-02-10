const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD
}).catch((err) => {
    console.error("error: ", err)
});


// Define Todo Schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
});

const Todo = mongoose.model('Todo', todoSchema);


app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'))
})

// Routes
app.post('/todo', async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/live', (req, res) => {
    res.status(200).json({ status: 'live' });
});

app.get('/ready', (req, res) => {
    res.status(200).json({ status: 'ready' });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

module.exports = { app, Todo };
