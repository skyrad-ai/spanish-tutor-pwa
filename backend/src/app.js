import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
const envPath = path.join(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Verify API key is loaded
console.log('API key present:', !!process.env.ANTHROPIC_API_KEY);
console.log('API key length:', process.env.ANTHROPIC_API_KEY?.length || 0);

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY not found in environment variables!');
  console.error('Make sure backend/.env file exists or ANTHROPIC_API_KEY is set in environment');
}

console.log('✓ API key loaded successfully');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const upload = multer({ storage: multer.memoryStorage() });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const DATA_DIR = path.join(__dirname, '../data');
const MISTAKES_FILE = path.join(DATA_DIR, 'mistakes.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// Initialize data files
async function initializeDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(MISTAKES_FILE);
    } catch {
      await fs.writeFile(MISTAKES_FILE, JSON.stringify([]));
    }

    try {
      await fs.access(SESSIONS_FILE);
    } catch {
      await fs.writeFile(SESSIONS_FILE, JSON.stringify([]));
    }

    try {
      await fs.access(STATS_FILE);
    } catch {
      await fs.writeFile(STATS_FILE, JSON.stringify({
        streak: 0,
        lastStudyDate: null,
        totalSessions: 0
      }));
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Tutoring system prompt
const TUTOR_SYSTEM_PROMPT = `You are a Spanish tutor. The user has photographed a page from their Spanish textbook. Parse the lesson on the page, identify the core grammar concept or vocabulary being taught, and guide the user through targeted exercises. Ask one question at a time. When the user answers incorrectly, correct them clearly and explain why. When they answer correctly, affirm and move to the next exercise.

IMPORTANT: When the user makes a mistake, you MUST include a JSON block at the end of your response in the following format:
<MISTAKE_LOG>
{
  "word": "the Spanish word or phrase being tested",
  "userAnswer": "what the user said",
  "correctAnswer": "the correct answer",
  "category": "conjugation|gender agreement|vocabulary|word order|other",
  "timestamp": "ISO timestamp"
}
</MISTAKE_LOG>

Keep your responses conversational and encouraging. Focus on one concept at a time.`;

// Analyze textbook page
app.post('/api/analyze-page', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const mediaType = req.file.mimetype;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: TUTOR_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64
            }
          },
          {
            type: 'text',
            text: 'I just photographed this page from my Spanish textbook. Please analyze it and start tutoring me on the lesson.'
          }
        ]
      }]
    });

    const responseText = message.content[0].text;

    // Create new session
    const sessions = JSON.parse(await fs.readFile(SESSIONS_FILE, 'utf-8'));
    const newSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      messages: [
        { role: 'user', content: 'Analyzed textbook page' },
        { role: 'assistant', content: responseText }
      ]
    };
    sessions.unshift(newSession);
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions));

    // Update stats
    const stats = JSON.parse(await fs.readFile(STATS_FILE, 'utf-8'));
    const today = new Date().toISOString().split('T')[0];
    const lastStudyDate = stats.lastStudyDate?.split('T')[0];

    if (lastStudyDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
      stats.streak++;
    } else if (lastStudyDate !== today) {
      stats.streak = 1;
    }

    stats.lastStudyDate = new Date().toISOString();
    stats.totalSessions++;
    await fs.writeFile(STATS_FILE, JSON.stringify(stats));

    res.json({
      message: responseText,
      sessionId: newSession.id
    });
  } catch (error) {
    console.error('Error analyzing page:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to analyze page',
      details: error.message
    });
  }
});

// Continue conversation
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, conversationHistory } = req.body;

    const messages = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    messages.push({
      role: 'user',
      content: message
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: TUTOR_SYSTEM_PROMPT,
      messages
    });

    const responseText = response.content[0].text;

    // Check for mistake logs
    const mistakeMatch = responseText.match(/<MISTAKE_LOG>([\s\S]*?)<\/MISTAKE_LOG>/);
    if (mistakeMatch) {
      try {
        const mistakeData = JSON.parse(mistakeMatch[1].trim());
        mistakeData.timestamp = new Date().toISOString();
        mistakeData.id = Date.now().toString();
        mistakeData.repetitionScore = 0;
        mistakeData.nextReview = new Date().toISOString();
        mistakeData.interval = 1;
        mistakeData.easeFactor = 2.5;

        const mistakes = JSON.parse(await fs.readFile(MISTAKES_FILE, 'utf-8'));
        mistakes.push(mistakeData);
        await fs.writeFile(MISTAKES_FILE, JSON.stringify(mistakes));
      } catch (error) {
        console.error('Error parsing mistake log:', error);
      }
    }

    // Remove mistake log from user-facing response
    const cleanResponse = responseText.replace(/<MISTAKE_LOG>[\s\S]*?<\/MISTAKE_LOG>/g, '').trim();

    // Update session
    if (sessionId) {
      const sessions = JSON.parse(await fs.readFile(SESSIONS_FILE, 'utf-8'));
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        session.messages.push(
          { role: 'user', content: message },
          { role: 'assistant', content: cleanResponse }
        );
        await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions));
      }
    }

    res.json({ message: cleanResponse });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get flashcards due for review
app.get('/api/flashcards/due', async (req, res) => {
  try {
    const mistakes = JSON.parse(await fs.readFile(MISTAKES_FILE, 'utf-8'));
    const now = new Date();
    const dueCards = mistakes.filter(m => new Date(m.nextReview) <= now);
    res.json(dueCards);
  } catch (error) {
    console.error('Error fetching due cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// Update flashcard after review
app.post('/api/flashcards/review', async (req, res) => {
  try {
    const { cardId, correct } = req.body;
    const mistakes = JSON.parse(await fs.readFile(MISTAKES_FILE, 'utf-8'));
    const card = mistakes.find(m => m.id === cardId);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // SM-2 algorithm
    if (correct) {
      if (card.repetitionScore === 0) {
        card.interval = 1;
      } else if (card.repetitionScore === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetitionScore++;
      card.easeFactor = Math.max(1.3, card.easeFactor + 0.1);
    } else {
      card.repetitionScore = 0;
      card.interval = 1;
      card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + card.interval);
    card.nextReview = nextReview.toISOString();
    card.lastReviewed = new Date().toISOString();

    await fs.writeFile(MISTAKES_FILE, JSON.stringify(mistakes));
    res.json({ success: true, card });
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Get dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = JSON.parse(await fs.readFile(STATS_FILE, 'utf-8'));
    const mistakes = JSON.parse(await fs.readFile(MISTAKES_FILE, 'utf-8'));
    const sessions = JSON.parse(await fs.readFile(SESSIONS_FILE, 'utf-8'));

    const now = new Date();
    const cardsDue = mistakes.filter(m => new Date(m.nextReview) <= now).length;
    const recentSessions = sessions.slice(0, 5);

    res.json({
      streak: stats.streak,
      cardsDue,
      totalCards: mistakes.length,
      totalSessions: stats.totalSessions,
      recentSessions
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Initialize data files on startup
await initializeDataFiles();

export default app;
