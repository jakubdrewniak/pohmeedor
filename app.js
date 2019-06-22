function Pohmeedor() {
	this.timeInMin
	this.root = document.documentElement;
	this.init()
}

Pohmeedor.prototype.init = function () {
	// this.startButton = document.querySelector('.button--start-button')
	// this.startButton.addEventListener("click", this.initializePie.bind(this))
	this.timerOptions = document.querySelector('.timer-options')
}

Pohmeedor.prototype.predefinedStart = function (predefinedTime) {
	this.timeInput = predefinedTime
	this.initializePie()
}

Pohmeedor.prototype.customStart = function () {
	this.timeInput = document.getElementById("time-min").value
	this.initializePie()
}

Pohmeedor.prototype.initializePie = function () {
	this.timeInMin = parseInt(this.timeInput)
	console.log('time in min', this.timeInMin);
	this.timeInSec = this.timeInMin * 60

	this.pieResizer()
	this.runTimer()
}

Pohmeedor.prototype.pieResizer = function () {
	let self = this

	function setPieSize() {
		let windowHeight = window.innerHeight
		let windowWidth = window.innerWidth
		self.root.style.setProperty('--pie-dimension', Math.min(windowHeight, windowWidth) / 2 + "px");
	}

	setPieSize()
	window.addEventListener('resize', setPieSize);
}

Pohmeedor.prototype.setStartButtonDisplay = function (value) {
	this.timerOptions.style.display = value /// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

Pohmeedor.prototype.stop = function () {
	this.root.style.setProperty('--first-half-rotate', "0deg");
	this.root.style.setProperty('--second-half-rotate', "0deg");

	this.setStartButtonDisplay("inline-block")
}

Pohmeedor.prototype.reset = function () {
	this.stop()
	this.runTimer()
}

Pohmeedor.prototype.runTimer = function () {
	this.setStartButtonDisplay("none")

	const self = this
	let currentFHDegree = 0
	let currentSHDegree = 0
	const degreeForOneSecond = 360 / this.timeInSec
	let secondHalfIntervalToken
	let secondHalfStartPermitted = true

	const starterForFirstHalf = setInterval(() => { // change first half fillment degree every second
		currentFHDegree += degreeForOneSecond
		this.root.style.setProperty('--first-half-rotate', currentFHDegree + "deg")
	}, 1000)

	const stopperForFirstHalf = setTimeout( // stop changing first half of pie after half of time 
		() => {
			clearInterval(starterForFirstHalf)
			timerForSecondHalf()
		}, this.timeInSec / 2 * 1000
	)

	function timerForSecondHalf() {
		if (secondHalfStartPermitted)
			secondHalfIntervalToken = setInterval(() => {
				currentSHDegree += degreeForOneSecond
				self.root.style.setProperty('--second-half-rotate', currentSHDegree + "deg")
			}, 1000)
	}

	const stopperForSecondHalf = setTimeout(
		() => { clearInterval(secondHalfIntervalToken) }, this.timeInSec * 1000
	)

	function reset() {
		stopAllTimers()
		self.reset()
	}

	function stop() {
		stopAllTimers()
		self.stop()
	}

	function stopAllTimers() {
		secondHalfStartPermitted = false
		clearInterval(starterForFirstHalf)
		clearInterval(secondHalfIntervalToken)

	}

	let resetButton = document.querySelector('.button--reset-button')
	resetButton.addEventListener("click", reset)

	let stopButton = document.querySelector('.button--stop-button')
	stopButton.addEventListener("click", stop)
}


