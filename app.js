function Pohmeedor() {
	this.timeInMin = 0.5
	this.timeInSec = this.timeInMin * 60
	this.root = document.documentElement;
	this.init()
}

Pohmeedor.prototype.init = function () {
	this.timer = 0
	this.runTimer()
	// this.startListeningTimerReset()
}

Pohmeedor.prototype.runTimer = function () {
	const self = this
	this.root.style.setProperty('--first-half-rotate', "0deg");
	this.root.style.setProperty('--second-half-rotate', "0deg");
	let currentFHDegree = 0
	let currentSHDegree = 0
	const degreeForOneSecond = 360 / this.timeInSec
	let secondHalfIntervalToken


	const timerForFirstHalf = setInterval(() => {
		currentFHDegree += degreeForOneSecond
		this.root.style.setProperty('--first-half-rotate', currentFHDegree + "deg")
	}, 1000)

	const stopperForFirstHalf = setTimeout(
		() => { clearInterval(timerForFirstHalf) }, this.timeInSec / 2 * 1000
	)

	const starterForSecondHalf = setTimeout(
		timerForSecondHalf, this.timeInSec / 2 * 1000
	)

	function timerForSecondHalf() {
		secondHalfIntervalToken = setInterval(() => {
			currentSHDegree += degreeForOneSecond
			self.root.style.setProperty('--second-half-rotate', currentSHDegree + "deg")
		}, 1000)
	}

	const stopperForSecondHalf = setTimeout(
		() => {clearInterval(secondHalfIntervalToken)}, this.timeInSec * 1000
	)
}


