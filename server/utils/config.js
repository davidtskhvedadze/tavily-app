require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const TAVILY_API_KEY = process.env.TAVILY_API_KEY
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_CALLBACK_URL = process.env.SPOTIFY_CALLBACK_URL
const AUTH_URL = process.env.AUTH_URL
const TOKEN_URL = process.env.TOKEN_URL
const API_BASE_URL = process.env.API_BASE_URL
const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  MONGO_URI,
  PORT,
  OPENAI_API_KEY,
  TAVILY_API_KEY,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_CALLBACK_URL,
  AUTH_URL,
  TOKEN_URL,
  API_BASE_URL,
  NODE_ENV
}