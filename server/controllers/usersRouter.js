const usersRouter = require('express').Router()
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const path = require('path')

const SECRET = config.JWT_SECRET || 'tavily'


usersRouter.post('/api/signup', (request, response, next) => {
    const body = request.body
    
    const user = new User({
        name: body.name,
        email: body.email,
        password: body.password,
    })
    
    user.save()
        .then(savedUser => {
            const userForToken = {
                email: savedUser.email,
                id: savedUser._id,
            }

            const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' })

            response.cookie('token', token, {
                httpOnly: true,
                secure: true, 
                sameSite: 'Strict',
                maxAge: 3600000, 
              });

            response
              .status(201)
              .send({ message: 'User created successfully', user: savedUser })
        })
        .catch(error => next(error))
})

usersRouter.post('/api/login', async (request, response, next) => {
    const body = request.body;

    try {
        const user = await User.findOne({ email: body.email });
        if (!user) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordIsValid = await user.validPassword(body.password);
        if (!passwordIsValid) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        const userForToken = {
            email: user.email,
            id: user._id,
        };

        const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' });

        response.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'Strict',
            maxAge: 3600000, 
          });

        response.status(200).send({ message: 'Login successful', user: user });
    } catch (error) {
        next(error);
    }
});

usersRouter.get('/api/logout', async (request, response, next) => {
    if (request.cookies) {
        Object.keys(request.cookies).forEach(cookieName => {
            response.clearCookie(cookieName, { path: '/' });
        });
    }
    response.status(200).send({ message: 'Logout successful, all cookies cleared' });
})

usersRouter.get('/api/playlist/:id', async (request, response, next) => {
    const id = request.params.id

    try {
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).send({ error: 'User not found' });
        }

        response.status(200).send({ message: 'Playlist retrieved successfully', playlists: user.playlists, user: user });
        
    } catch (error) {
        next(error);
    }
})

usersRouter.post('/api/playlist/:id', async (request, response, next) => {
    const id = request.params.id
    const playlistToAdd = {
        name: "Playlist 1",
        songs: [
          { name: "Song Name 1", artist: "Artist 1" },
          { name: "Song Name 2", artist: "Artist 2" },
          { name: "Song Name 3", artist: "Artist 3" }
        ]
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            $push: { playlists: playlistToAdd }
        }, { new: true });

        if (!updatedUser) {
            return response.status(404).send({ error: 'User not found' });
            console.log(updatedUser)
        }

        response.status(200).send({ message: 'Playlist added successfully', playlist: updatedUser.playlists[updatedUser.playlists.length - 1] });
    } catch (error) {
        next(error);
    }
})

usersRouter.delete('/api/playlist/:id/:playlistid', async (request, response, next) => {
    const { id, playlistid } = request.params;
    console.log(id, playlistid)

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            $pull: { playlists: { _id: playlistid } }
        }, { new: true });

        if (!updatedUser) {
            return response.status(404).send({ error: 'Failed to delete playlist' });
        }

        response.status(200).send({ message: 'Playlist deleted successfully', playlist: updatedUser.playlists });
    } catch (error) {
        next(error);
    }
})


module.exports = usersRouter