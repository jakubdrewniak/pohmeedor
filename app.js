function Pohmeedor() {
	this.timeInMin = 0.1
	this.root = document.documentElement;
	this.init()
}

Pohmeedor.prototype.init = function () {
	let startButton = document.querySelector('.start-button')
	startButton.addEventListener("click", this.initializePie.bind(this))
}

Pohmeedor.prototype.initializePie = function () {
	let timeInput = document.getElementById("time-min")
	this.timeInMin = parseInt(timeInput.value)
	this.timeInSec = this.timeInMin * 60

	this.pieResizer()
	this.runTimer()
}

Pohmeedor.prototype.stop = function () {
	this.root.style.setProperty('--first-half-rotate', "0deg");
	this.root.style.setProperty('--second-half-rotate', "0deg");
}

Pohmeedor.prototype.reset = function () {
	this.stop()
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

Pohmeedor.prototype.runTimer = function () {
	const self = this
	let currentFHDegree = 0
	let currentSHDegree = 0
	const degreeForOneSecond = 360 / this.timeInSec
	let secondHalfIntervalToken
	let secondHalfStartPermitted = true

	const starterForFirstHalf = setInterval(() => {
		currentFHDegree += degreeForOneSecond
		this.root.style.setProperty('--first-half-rotate', currentFHDegree + "deg")
	}, 1000)

	const stopperForFirstHalf = setTimeout(
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
		stopAll()
		self.reset()
	}

	function stop() {
		stopAll()
		self.stop()
	}

	function stopAll() {
		secondHalfStartPermitted = false
		clearInterval(starterForFirstHalf)
		clearInterval(secondHalfIntervalToken)

	}

	let resetButton = document.querySelector('.reset-button')
	resetButton.addEventListener("click", reset)

	let stopButton = document.querySelector('.stop-button')
	stopButton.addEventListener("click", stop)
}


