const debug = require('debug')('gastro-aid:api:model:user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const SALT_WORK_FACTOR = 10

const user = new mongoose.Schema({
	name     : {
		type     : String,
		required : true
	},
	email    : {
		type     : String,
		required : true,
		validate : [
			isEmail,
			'invalid email'
		],
		unique   : true
	},
	password : {
		type     : String,
		required : true
	}
})

user.pre('save', async function save(next) {
	if (!this.isModified('password')) return next()

	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
		this.password = await bcrypt.hash(this.password, salt)
		return next()
	} catch (err) {
		return next(err)
	}
})

user.methods.validatePassword = async function validatePassword(password) {
	return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', user)

module.exports = User
