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

//------------------------ DELETE REQUESTS -------------------------//


module.exports = router;