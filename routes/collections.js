const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');

const { User, validateUser } = require("../models/user");
const { Patient, validatePatient } = require("../models/patient");
const { Supply, validateSupply} = require("../models/supply")

//------------------------ GET REQUESTS -------------------------//

//------patients collection-------//

//Get request to return all patients health records *Working
router.get("/patients/allRecords", auth, async (req, res) =>{
    try{
        const allPatients = await Patient.find();
        return res.send(allPatients);

    }catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
    
})

//------------------------ POST REQUESTS -------------------------//

//--------patients collection --------// 

// add a patient's record
router.post("/patients/newRecord", auth, async (req, res) => {
    try {
       // let user = await User.findById(req.user._id);
        //if (!user) return res.status(400).send('You are not logged in.');

        const {error} = validatePatient(req.body);
        if (error) return res.status(400).send(error);

        const patient = new Patient({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            gender: req.body.gender,
            ssn: req.body.ssn,
        });

        if(req.body.essentialWorker){ patient.essentialWorker = req.body.essentialWorker}
        if(req.body.vaccine){
            if(req.body.vaccine.covid) { patient.vaccine.covid = req.body.vaccine.covid}
            if(req.body.vaccine.flu) { patient.vaccine.flu = req.body.vaccine.flu}
            if(req.body.vaccine.tetanus) { patient.vaccine.tetanus = req.body.vaccine.tetanus}
            if(req.body.vaccine.varicella) { patient.vaccine.varicella = req.body.vaccine.varicella}
        }

        await patient.save();
        return res.status(200).send(patient);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});

//--------Supplies-----------//

router.post("/supplies/newEntry", auth, async (req, res) => {
    try {

        const {error} = validateSupply(req.body);
        if (error) return res.status(400).send(error);

        const supply = new Supply({
            label: req.body.label

        });

        if(req.body.count){ supply.count = req.body.count}
        if(req.body.expiration) {supply.expiration = req.body.expiration}
        

        await supply.save();
        return res.status(200).send(supply);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});

//------------------------ PUT REQUESTS -------------------------//
//------ users collection //---------

// edit logged in user profile *WORKING*
router.put("/user/edit", auth,  async (req, res) =>{
    try {
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send('Cannot find currently logged in user\'s record.');

        if(req.body.address) {user.address = req.body.address;}
        if(req.body.phone){user.phone = req.body.phone;}
        if(req.body.photo) {user.photo = req.body.photo;}
        if(req.body.isAdmin) {user.isAdmin = req.body.isAdmin;}

        await user.save();
        return res.send(user)
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});

//------------- patients colletion -------------//


//edit/update patient record
router.put("/patients/editRecord", auth,  async (req, res) =>{
    try {
        let record = await Patient.findById(req.body.patientId);
        if (!record) return res.status(400).send('Invalid or Missing patient Id');

        if(req.body.firstName) {record.firstName = req.body.firstName;}
        if(req.body.lastName){record.lastName = req.body.lastName;}
        if(req.body.age) {record.age = req.body.age;}
        if(req.body.gender) {record.gender = req.body.gender;}
        if(req.body.ssn) {record.ssn = req.body.ssn;}
        if(req.body.essentialWorker) {record.essentialWorker = req.body.essentialWorker;}
        if(req.body.disable) {record.disable = req.body.disable;}
        if(req.body.vaccine.covid) {record.vaccine.covid = req.body.vaccine.covid;}
        if(req.body.vaccine.flu) {record.vaccine.flu = req.body.vaccine.flu;}
        if(req.body.vaccine.tetanus) {record.vaccine.tetanus = req.body.vaccine.tetanus;}
        if(req.body.vaccine.varicella) {record.vaccine.varicella = req.body.vaccine.varicella;}

        await record.save();
        return res.send(record)
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});


router.put("/patients/editRecord", auth,  async (req, res) =>{
    try {
        let record = await Patient.findById(req.body.patientId);
        if (!record) return res.status(400).send('Invalid or Missing patient Id');

        if(req.body.firstName) {record.firstName = req.body.firstName;}
        if(req.body.lastName){record.lastName = req.body.lastName;}
        if(req.body.age) {record.age = req.body.age;}
        if(req.body.gender) {record.gender = req.body.gender;}
        if(req.body.ssn) {record.ssn = req.body.ssn;}
        if(req.body.essentialWorker) {record.essentialWorker = req.body.essentialWorker;}
        if(req.body.disable) {record.disable = req.body.disable;}
        if(req.body.vaccine.covid) {record.vaccine.covid = req.body.vaccine.covid;}
        if(req.body.vaccine.flu) {record.vaccine.flu = req.body.vaccine.flu;}
        if(req.body.vaccine.tetanus) {record.vaccine.tetanus = req.body.vaccine.tetanus;}
        if(req.body.vaccine.varicella) {record.vaccine.varicella = req.body.vaccine.varicella;}

        await record.save();
        return res.send(record)
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});
//--------Supplies-----------//

router.put("/supplies/editEntry", auth, async (req, res) => {
    try {

        let supply = await Supply.findById(req.body.supplyId);
        if (!supply) return res.status(400).send('Invalid or Missing supply Id');

        if(req.body.label) {supply.label = req.body.label;}
        if(req.body.count){ supply.count = req.body.count}
        if(req.body.expiration) {supply.expiration = req.body.expiration}
        

        await supply.save();
        return res.status(200).send(supply);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});

//------------------------ DELETE REQUESTS -------------------------//

//------------- patients collection -------------//

//delete patient record
router.delete('/patients/deleteRecord', auth, async (req, res) => {    
    try {
        let record = await Patient.findByIdAndRemove(req.body.patientId);
        if (!record) return res.status(400).send('Invalid or Missing patient Id');
        return res.status(200).send(`The following record has been removed from the database: \n ${record}`);
        
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
    });

module.exports = router;