function Pohmeedor() {
	this.root = document.documentElement;
	this.toggleColorMode()
	this.init()
}

Pohmeedor.prototype.init = function () {
	this.timerOptions = document.querySelector('.main-menu')
	this.timerButtons = document.querySelector('.timer-buttons')
	this.timerCompleteMessage = document.querySelector('.timer-complete-message')
}

Pohmeedor.prototype.predefinedStart = function (predefinedTime) {
	this.timeInput = predefinedTime
	this.initializePie()
}

Pohmeedor.prototype.customStart = function () {
	this.timeInput = parseFloat(document.getElementById("time-min").value)
	if (this.timeInput > 0)
		this.initializePie()
	else
		alert('Number should be an integer greater than 0')
}

Pohmeedor.prototype.initializePie = function () {
	this.timeInSec = this.timeInput * 60
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

Pohmeedor.prototype.setOptionsDisplay = function (value) {
	this.timerOptions.style.display = value
}

Pohmeedor.prototype.setTimerButtonsDisplay = function (value) {
	this.timerButtons.style.display = value
}

Pohmeedor.prototype.setTimerMessageDisplay = function (value) {
	this.timerCompleteMessage.style.display = value
}

Pohmeedor.prototype.setPieComplete = function () {
	this.root.style.setProperty('--first-half-rotate', "180deg")
	this.root.style.setProperty('--second-half-rotate', "180deg")
	this.setTimerMessageDisplay('inline-block')
}

Pohmeedor.prototype.stop = function () {
	clearInterval(this.starterForFirstHalf)
	clearTimeout(this.stopperForFirstHalf)
	clearInterval(this.secondHalfIntervalToken)
	clearTimeout(this.stopperForSecondHalf)

	this.root.style.setProperty('--first-half-rotate', "0deg");
	this.root.style.setProperty('--second-half-rotate', "0deg");
	this.setTimerMessageDisplay('none')

	this.setOptionsDisplay("block")
	this.setTimerButtonsDisplay("none")
}

Pohmeedor.prototype.reset = function () {
	this.stop()
	this.runTimer()
}

Pohmeedor.prototype.runTimer = function () {
	this.setOptionsDisplay("none")
	this.setTimerButtonsDisplay("block")

	const self = this
	const degreeForOneSecond = 360 / this.timeInSec
	let currentFHDegree = 0
	let currentSHDegree = 0

	this.starterForFirstHalf // starting timer from 0
	this.stopperForFirstHalf // stops first half after halftime
	this.secondHalfIntervalToken // start timer from halftime
	this.stopperForSecondHalf // stops timer after full time

	this.stopperForSecondHalf = setTimeout(
		() => {
			clearInterval(self.secondHalfIntervalToken)
			self.setPieComplete()
		}, this.timeInSec * 1000
	)

	this.starterForFirstHalf = setInterval(() => {
		currentFHDegree += degreeForOneSecond
		this.root.style.setProperty('--first-half-rotate', currentFHDegree + "deg")
	}, 1000)

	this.stopperForFirstHalf = setTimeout( // stop changing first half of pie after halftime 
		() => {
			clearInterval(self.starterForFirstHalf)
			timerForSecondHalf()
		}, this.timeInSec / 2 * 1000
	)

	function timerForSecondHalf() {
		self.secondHalfIntervalToken = setInterval(() => {
			currentSHDegree += degreeForOneSecond
			self.root.style.setProperty('--second-half-rotate', currentSHDegree + "deg")
		}, 1000)
	}

}

Pohmeedor.prototype.toggleColorMode = function () {
	document.getElementById('theme-switch').addEventListener('change', function (event) {
		(event.target.checked) ?
			document.body.setAttribute('data-theme', 'dark') :
			document.body.removeAttribute('data-theme')
	})
}


