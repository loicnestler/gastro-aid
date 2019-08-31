const debug = require('debug')('gastro-aid:api:route:user')

const Router = require('koa-joi-router')
const Joi = Router.Joi

const router = new Router()
router.prefix('/user')

const { error } = require('../lib/responseSchemas')

const User = require('../models/User.model')
const auth = require('../core/auth')

router.route({
	method   : 'post',
	path     : '/signup',
	validate : {
		body   : {
			name     : Joi.string().required(),
			email    : Joi.string().email().required(),
			password : Joi.string().required()
		},
		type   : 'json',
		output : {
			200 : {
				body   : {
					_id   : Joi.string(),
					token : Joi.string()
				},
				header : {
					'Set-Cookie' : Joi.string()
				}
			},
			400 : error
		}
	},
	meta     : {
		swagger : {
			summary : 'User signup',
			tags    : [
				'user'
			]
		}
	},
	handler  : async (ctx) => {
		let user = new User({
			name     : ctx.request.body.name,
			email    : ctx.request.body.email,
			password : ctx.request.body.password
		})

		try {
			user = await user.save()
			const token = await auth.generateToken({ _id: user._id })
			ctx.cookies.set('Authorization', `Bearer ${token}`)
			console.log(typeof user._id)
			ctx.ok({ _id: user._id.toString(), token })
		} catch (err) {
			debug(err)
			ctx.badRequest({ error: 400, message: err.message })
		}
	}
})

router.route({
	method   : 'post',
	path     : '/login',
	validate : {
		body   : {
			email    : Joi.string().email().required(),
			password : Joi.string().required()
		},
		type   : 'json',
		output : {
			200 : {
				body : {
					_id   : Joi.string(),
					token : Joi.string()
				}
			},
			401 : error,
			400 : error
		}
	},
	meta     : {
		swagger : {
			summary : 'User login',
			tags    : [
				'user'
			]
		}
	},
	handler  : async (ctx) => {
		const user = await User.findOne({ email: ctx.request.body.email })
		if (!user) {
			return ctx.badRequest({ error: 400, message: 'user not found' })
		}

		try {
			if (await user.validatePassword(ctx.request.body.password)) {
				const token = await auth.generateToken({ _id: user._id })
				ctx.cookies.set('Authorization', `Bearer ${token}`)
				ctx.ok({ _id: user._id.toString(), token })
			} else {
				ctx.unauthorized({ error: 401, message: 'invalid password' })
			}
		} catch (err) {
			ctx.unauthorized({ error: 401, message: err.message })
		}
	}
})

router.route({
	method   : 'delete',
	path     : '/:id',
	validate : {
		body   : {
			password : Joi.string().required()
		},
		type   : 'json',
		output : {
			200 : {
				body : {
					status : Joi.string()
				}
			},
			400 : error,
			401 : error
		}
	},
	meta     : {
		swagger : {
			summary : 'User deletion',
			tags    : [
				'user'
			]
		}
	},
	handler  : async (ctx) => {
		//TODO:
	}
})

router.get('/', async (ctx) => {
	const users = await User.find()
	ctx.ok(users)
})

module.exports = router
