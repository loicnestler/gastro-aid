const { Joi } = require('koa-joi-router')

module.exports = {
	error : {
		body : {
			error   : Joi.number().integer(),
			message : Joi.string()
		}
	}
}
