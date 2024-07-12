const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: { type: String, required: true},
  artist: { type: String, required: true },
});

const PlaylistSchema = new Schema({
  name: { type: String, required: true },
  songs: {
    type: [SongSchema],
    default: [],
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'User email required'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: props => `${props.value} is not a valid email address!`
    },
    index: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'Password must be at least 8 characters long'],
  },
  playlists: {
    type: [PlaylistSchema],
    default: [],
  },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      const saltRounds = process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  }
});

module.exports = mongoose.model('User', userSchema);