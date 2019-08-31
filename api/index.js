require('dotenv').config()
const debug = require('debug')('gastro-aid:api')

const Koa = require('koa')

const Router = require('koa-joi-router')
const Joi = Router.Joi
const router = new Router()

const app = new Koa()

app.use(router.middleware())

app.listen(process.env.PORT, () => {
	debug(`Listening on :${process.env.PORT}...`)
})
