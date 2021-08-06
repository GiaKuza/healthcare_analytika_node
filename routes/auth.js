const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const { User, validateUser } = require("../models/user");


//------------------------ POST REQUESTS -------------------------//

// Register a new user *WORKING*
router.post("/register/newUser", async (req, res) => {
    try{
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error);

        let user = await User.findOne ({ email: req.body.email });
        if (user) return res.status(400).send('This e-mail is already in use');
        
        const salt = await bcrypt.genSalt(10);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });
        await user.save();

        const token = user.generateAuthToken();
             return res
             .header('x-auth-token', token)
             .header('access-control-expose-headers', 'x-auth-token')
             .send({ _id: user._id, name: user.name, email: user.email });
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//login a user with valid email and password *WORKING*
router.post("/login", async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password.');
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.')
        const token = user.generateAuthToken();
        return res
             .header('x-auth-token', token)
             .header('access-control-expose-headers', 'x-auth-token')
             .status(200).send({ _id: user._id, name: user.name, email: user.email, isLogged: true });

        } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
        }
});


//----------- additional validation functions ---------- //
function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().min(4).max(30).required(),
        password: Joi.string().min(4).max(70).required(),
    });
return schema.validate(req);
}


module.exports = router;