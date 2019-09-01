function random(min, max) {
	// min and max included
	return Math.random() * (max - min + 1) + min
}

class Restaurant {
	constructor(name, address) {
		this.name = name
		this.address = address
	}

	mock() {
		const salesByWeekday = [
			...new Array(7)
		].map((_, i) => {
			return random(10000, 20000)
		})
		console.log(salesByWeekday)
	}
}

const r = new Restaurant()
r.mock()
