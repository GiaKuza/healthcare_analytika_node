const mongoose = require('mongoose');
const Joi = require('joi');

const patientSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minlength: 4, maxlength: 30},
    lastName: {type: String, required: true, minlength: 4, maxlength: 30},
    age: {type: Number, required: true, min: 1, max: 99},
    ssn: {type: String, required: true, minlength: 11, maxlength:11},
    gender: {type: String, required: true, minlength: 4, maxlength: 6},
    essentialWorker: {type: Boolean, default: false},
    disable: {type: Boolean, default: false},
    vaccine:{
        covid:{type: Boolean, default: false},
        flu: {type: Boolean, default: false},
        tetanus: {type: Boolean, default: false},
        varicella: {type: Boolean, default: false}
    },
});

const Patient = mongoose.model("Patient", patientSchema)

function validatePatient(patient) {
	const schema = Joi.object({
		firstName: Joi.string().required().min(4).max(30),
        lastName: Joi.string().required().min(4).max(30),
        age: Joi.number().required().min(1).max(99),
        ssn: Joi.string().required().min(11).max(11), 
        gender: Joi.string().required().min(4).max(6), 
	});
	return schema.validate(patient);
}


exports.validatePatient = validatePatient;
exports.Patient = Patient;
exports.patientSchema = patientSchema;