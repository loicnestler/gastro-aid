const jwt = require('jsonwebtoken')

module.exports = {
	generateToken : async function generateToken(data) {
		return await jwt.sign(data, process.env.JWT_SECRET)
	},
	verifyToken   : async function verifyToken(token) {
		return await jwt.verify(token, process.env.JWT_SECRET)
	}
}
