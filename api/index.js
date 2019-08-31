require('dotenv').config()
const debug = require('debug')('gastro-aid:api')

const mongoose = require('mongoose')

const Koa = require('koa')

const Router = require('koa-joi-router')
const router = new Router()

const { SwaggerAPI } = require('koa-joi-router-docs')
const generator = new SwaggerAPI()

const app = new Koa()

const user = require('./routes/user')

app.use(require('@koa/cors')())
app.use(require('koa-respond')())
app.use(require('koa-logger')())
app.use(require('koa-helmet')())

// app.use(async (ctx, next) => {
// 	if (ctx.method === 'OPTIONS') {
// 		ctx.set('Access-Control-Allow-Origin', '*')
// 		ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
// 		ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
// 		ctx.ok()
// 	}
// })

app.use(user.middleware())
generator.addJoiRouter(user)

const spec = generator.generateSpec({
	info     : {
		title       : 'GastroAid API',
		description : 'Official GastroAid API documentation',
		version     : '1.1'
	},
	basePath : '/',
	tags     : [
		{
			name        : 'user',
			description : 'Basic user operations'
		}
	]
})

router.get('/_api.json', async (ctx) => {
	ctx.body = JSON.stringify(spec, null, '  ')
})
router.get('/apiDocs', async (ctx) => {
	ctx.body = `
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>Example API</title>
   </head>
   <body>
     <redoc spec-url='/_api.json' lazy-rendering></redoc>
     <script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"></script>
   </body>
   </html>
   `
})

app.use(router.middleware())

mongoose
	.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`, {
		useNewUrlParser : true,
		useCreateIndex  : true
	})
	.then(() => {
		app.listen(process.env.PORT, () => {
			debug(`Listening on :${process.env.PORT}...`)
		})
	})
