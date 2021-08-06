const mongoose = require('mongoose');
const Joi = require('joi');



const supplySchema = new mongoose.Schema({
    label: {type: String, required: true, minlength: 4, maxlength: 30},
    count: {type: Number,  min: 1, max: 100000, default: 0},
    dateAdded: { type: Date, default: Date.now},
    expiration: {type: Date, min: Date.now, max: '2030-01-01', default: '2025-06-06'},
    
});


const Supply = mongoose.model("Supply", supplySchema)

function validateSupply(supply) {
	const schema = Joi.object({
		label: Joi.string().min(4).max(30).required(),
        count: Joi.number().min(1).max(100000),
        expiration: Joi.date()
	});
	return schema.validate(supply);
}

exports.validateSupply = validateSupply;
exports.Supply = Supply;
exports.supplySchema = supplySchema;