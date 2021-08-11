const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const config = require('config');
const twilio = require('twilio')
//twilio requirements 
const accountSid = config.get("accountSid");
const authToken = config.get("authToken");
const client = new twilio(accountSid, authToken);


router.get("/send-text", auth, async (req, res) =>{
    const {recipient, text} = req.query
    
    try {

        client.messages.create({
            body: text,
            to: recipient,
            from: '+12018028312'
        }).then((message) => console.log(message.body));

       
        return res.status(200).send('text message sent!');
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});

    module.exports = router;