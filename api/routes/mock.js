const Router = require('koa-joi-router')
const Joi = Router.Joi

const router = new Router()

router.route({
	method   : 'get',
	path     : '/mock',
	validate : {
		query  : {
			min    : Joi.number(),
			max    : Joi.number(),
			count  : Joi.number().integer(),
			spread : Joi.array()
		},
		output : {
			body : {
				200 : {
					data : Joi.array()
				}
			}
		}
	},
	handler  : async (ctx) => {}
})

module.exports = router
