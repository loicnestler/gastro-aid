const Router = require('koa-joi-router')

const Joi = Router.Joi
const router = new Router()

const axios = require('axios')
const pluscodes = require('pluscodes')

const OWM_API_KEY = 'dfe72604329b31eb89b2fd7c7bcdb3ac'
const HAMBURG_COORDS = [
	53.5526661,
	10.0023827
]

const googleMapsClient = require('@google/maps').createClient({
	key : 'AIzaSyDbSj6ziFZ4eqAxKfTdNjeuM6A5ddLkUik'
})

const FORECAST_DURATION = 1

router.route({
	method  : 'get',
	path    : '/calculate',
	// validate : {
	// 	query : {
	// 		// restaurant   : Joi.string().required(),
	// 		// meal         : Joi.string().required(),
	// 		// initialValue : Joi.number().required(),
	// 		// warmWeather  : Joi.boolean(),
	// 		// date         : Joi.date(),
	// 		plusCode : Joi.string()
	// 	}
	// 	// output : {
	// 	// 	200 : {}
	// 	// }
	// },
	handler : async (ctx) => {
		const { restaurant, meal, warmWeather, initialValue, date, plusCode } = ctx.query
		console.log(plusCode)

		try {
			const coordinates = pluscodes.decode(
				pluscodes.expand(plusCode, { latitude: HAMBURG_COORDS[0], longitude: HAMBURG_COORDS[1] })
			)

			console.log(coordinates)
			const { latitude, longitude } = coordinates
			// api.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml

			const weatherForecast = (await axios.get(
				`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${OWM_API_KEY}`
				// `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${OWM_API_KEY}`
			)).data

			const forecast = weatherForecast.list[1]
			console.log(forecast)
			// const averageWeather = (await axios.get(
			// 	`http://history.openweathermap.org/data/2.5/history/city?lat=${latitude}lon=${longitude}&APPID=${OWM_API_KEY}`
			// )).data

			ctx.ok({ weatherForecast })
		} catch (err) {
			console.log(err)
		}
	}
})

module.exports = router
