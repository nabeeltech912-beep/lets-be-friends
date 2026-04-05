const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Chat = require('../models/Chat');
const mongoose = require('mongoose');
require('dotenv').config();

// DEFINITIVE Gemini API PATH (Pro 1.5 Beta)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

// Auth Routes (Minimal for stability)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, age, interests, mood } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: 'Registered successfully (Mock DB)', user: { _id: 'mock_123', email, name, age, interests, mood, avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random` } });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    user = new User({ email, password, name, age, interests, mood, avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=random` });
    await user.save();
    res.json({ message: 'Registered successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (require('mongoose').connection.readyState !== 1) {
      return res.json({ message: 'Login successful (Mock DB)', user: { _id: 'mock_123', email, name: 'Alex Rivera', avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=f472b6&color=fff' } });
    }
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users Routes
router.get('/users/search', async (req, res) => {
  try {
    const { q, currentUserId } = req.query;
    if (!q) return res.json([]);
    if (mongoose.connection.readyState !== 1) {
        return res.json([
            { _id: 'mock_456', name: 'Sarah Mock', interests: ['Design', 'Art'], avatar: 'https://ui-avatars.com/api/?name=Sarah+Mock&background=fbcfe8&color=ec4899', mood: 'Vibing' },
            { _id: 'mock_789', name: 'Michael Test', interests: ['Code', 'Gaming'], avatar: 'https://ui-avatars.com/api/?name=Michael+Test&background=bfdbfe&color=3b82f6', mood: 'Vibing' }
        ]);
    }
    const regex = new RegExp(q, 'i');
    let matchQuery = { $or: [{ name: regex }, { interests: regex }] };
    if (currentUserId) matchQuery._id = { $ne: currentUserId };
    const users = await User.find(matchQuery);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/random', async (req, res) => {
  try {
    const { currentUserId } = req.query;
    if (mongoose.connection.readyState !== 1) {
        return res.json({ _id: 'mock_random', name: 'Emma Watson', role: 'Travel Blogger', interests: ['Travel', 'Music'], avatar: 'https://ui-avatars.com/api/?name=Emma+Watson&background=e9d5ff&color=9333ea', mood: 'Chill' });
    }
    const match = currentUserId ? { _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } } : {};
    const count = await User.countDocuments(match);
    if (count === 0) return res.status(404).json({ message: 'No users found' });
    const random = Math.floor(Math.random() * count);
    const user = await User.findOne(match).skip(random);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Chat Routes (FIXED: Using gemini-1.5-pro for final stability)
router.get('/chat/history/:userId', async (req, res) => {
  try {
     if (mongoose.connection.readyState !== 1) {
        return res.json({ messages: [], personality: 'Thanglish' });
     }
    const chat = await Chat.findOne({ userId: req.params.userId });
    res.json(chat || { messages: [], personality: 'Thanglish' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/chat/ai', async (req, res) => {
  try {
    const { userId, message, userName } = req.body;
    let aiResponse = "";
    
    // Natural Conversation Prompt
    const systemInstruction = {
      parts: [
        {
          text: `You are an intelligent, helpful, and friendly AI assistant.
You must speak STRICTLY in natural, casual Thanglish (Tamil + English mixture).
Respond intelligently exactly like Gemini AI would, but translated into WhatsApp-style Thanglish.
Do NOT say "Hi ${userName || 'Friend'}" or greet the user in every single message.
Answer the user's questions correctly and logically, giving detailed and proper answers when asked.
Be natural, direct, and conversational. Do not overdo emojis or act fake. Just be a smart Thanglish speaking friend.`
        }
      ]
    };

    if (API_KEY && API_KEY !== 'dummy_key') {
        let historyParts = [];
        
        // Fetch history if DB is active
        if (mongoose.connection.readyState === 1) {
            const chatDoc = await Chat.findOne({ userId });
            if (chatDoc && chatDoc.messages && chatDoc.messages.length > 0) {
                 historyParts = chatDoc.messages.slice(-10).map(m => ({ 
                    role: m.role === 'assistant' ? 'model' : 'user', 
                    parts: [{ text: m.content }] 
                }));
            }
        }

        // Add the current user message
        historyParts.push({
            role: "user",
            parts: [{ text: message }]
        });

        try {
          // POST to Gemini
          const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, 
            { 
              systemInstruction: systemInstruction,
              contents: historyParts,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            }, 
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (response.data && response.data.candidates && response.data.candidates[0].content) {
            aiResponse = response.data.candidates[0].content.parts[0].text.trim();
            console.log(`[Gemini Pro Final Success]: ${aiResponse}`);
          } else {
            console.error("Unknown Response Format:", response.data);
            aiResponse = `Ayyio.. chinna issue (Gemini Pro Error). Epdi iruka? 😊`;
          }

        } catch (apiErr) {
          console.error("Gemini Final Connection Failed:", apiErr.response?.data || apiErr.message);
          aiResponse = `Ayyio.. chinna connection issue (Gemini Pro Error). Epdi iruka? 😊`;
        }
    } else {
        aiResponse = `Heyy! Key setting miss akidichi. Epdi iruka? 😅`;
    }

    if (mongoose.connection.readyState === 1) {
        let chat = await Chat.findOne({ userId });
        if (!chat) chat = new Chat({ userId, personality: 'Thanglish', messages: [] });
        chat.messages.push({ role: 'user', content: message });
        chat.messages.push({ role: 'assistant', content: aiResponse });
        await chat.save();
        res.json({ response: aiResponse, chat: chat.messages });
    } else {
        res.json({ response: aiResponse, chat: [{ role: 'user', content: message }, { role: 'assistant', content: aiResponse }] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
