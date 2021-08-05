const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');

const { User, validateUser } = require("../models/user");
const { Patient, validatePatient } = require("../models/patient");

//------------------------ GET REQUESTS -------------------------//

//Get request to return all patients health records *Working
router.get("/patients/allRecords", async (req, res) =>{
    try{
        const allPatients = await Patient.find();
        return res.send(allPatients);

    }catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
    
})

//------------------------ POST REQUESTS -------------------------//

//------------------------ PUT REQUESTS -------------------------//

// request to edit user profile *WORKING*
router.put("/user/edit", auth,  async (req, res) =>{
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send('User does not exist.');

        if(req.body.address) {user.address = req.body.address;}
        if(req.body.phone){user.phone = req.body.phone;}
        if(req.body.photo) {user.photo = req.body.photo;}
        if(req.body.isAdmin) {user.isAdmin = req.body.isAdmin;}

        await user.save();
        return res.send(user)
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});

//------------------------ DELETE REQUESTS -------------------------//


module.exports = router;