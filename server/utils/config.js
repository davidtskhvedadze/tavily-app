require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_CALLBACK_URL = process.env.SPOTIFY_CALLBACK_URL
const AUTH_URL = process.env.AUTH_URL
const TOKEN_URL = process.env.TOKEN_URL
const API_BASE_URL = process.env.API_BASE_URL

module.exports = {
  MONGO_URI,
  PORT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_CALLBACK_URL,
  AUTH_URL,
  TOKEN_URL,
  API_BASE_URL
}