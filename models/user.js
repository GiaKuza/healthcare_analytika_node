const mongoose = require('mongoose');
const Joi = require('joi');
const config = require("config");
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 4, maxlength: 30},
    email: {type: String, required: true, minlength: 4, maxlength: 30},
    password: {type: String, required: true, minlength: 4, maxlength: 70},
    photo: {type: String, default: 'no photo'},
    address: {type: String, minlength: 10, maxlength: 500, default: 'Update emergency contact info here...'},
    phone: {type: String, required: true, minlength: 12, maxlength: 12, default: '000-000-0000'},
    isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, name: this.name, isAdmin: this.isAdmin  }, config.get('jwtSecret'));
};

const User = mongoose.model("User", userSchema)

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(4).max(30).required(),
		email: Joi.string().min(4).max(30).required(),
        password: Joi.string().min(4).max(70).required(),
	});
	return schema.validate(user);
}

exports.validateUser = validateUser;
exports.User = User;
exports.userSchema = userSchema;