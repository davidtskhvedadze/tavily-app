const usersRouter = require('express').Router()
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const SECRET = config.JWT_SECRET

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

            response
              .status(201)
              .send({ token, email: savedUser.email, name: savedUser.name })
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

        response.status(200).send({ token, email: user.email, name: user.name });
    } catch (error) {
        next(error);
    }
});


module.exports = usersRouter