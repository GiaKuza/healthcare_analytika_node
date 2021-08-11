const connectDB = require('./startup/db');
const express = require("express");
const app = express();
const cors = require('cors');
const collections = require('./routes/collections');
const auth = require('./routes/auth');
const twilioroute = require('./routes/twilio')

const config = require('config');
const twilio = require('twilio')
//twilio requirements 
const accountSid = config.get("accountSid");
const authToken = config.get("authToken");
const client = new twilio(accountSid, authToken);

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/collections', collections);
app.use('/api/auth', auth);
app.use('/api/twilio', twilioroute)

app.listen(5000, function () {
    console.log("Server started. Listening on port 5000.");
    connectDB();
})