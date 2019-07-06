function Pohmeedor() {
	this.root = document.documentElement;
	console.log(this.root.style)
	this.toggleColorMode()
	this.init()
}

Pohmeedor.prototype.init = function () {
	this.timerOptions = document.querySelector('.main-menu')
	this.timerContainer = document.querySelector('.timer-container')
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


Pohmeedor.prototype.apiTest = function() {
	let ob = {
		timer: {
			id: "9d8f128f-e6ec-413d-b4d0-31fa948bab2f",
			duration: 60000,
			name: "my awesome timer"
		}
	}

	fetch("https://pohmeedor.herokuapp.com/api/timers",
		{
			method: "post",
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			},
			body: JSON.stringify(ob)
		}).then(res => res.json())
		.then(res => {
			console.log("post:");
			console.log(res);
		})

	fetch("https://pohmeedor.herokuapp.com/api/timers/9d8f128f-e6ec-413d-b4d0-31fa948bab2f").then(resp => {
		console.log(resp.headers.get("Content-Type"));
		console.log(resp.headers.get("Date"));

		console.log(resp.status);
		console.log(resp.statusText);
		console.log(resp.type);
		console.log(resp.url);
		console.log(resp.body);
	})
}

Pohmeedor.prototype.pieResizer = function () {
	this.paddingForPie = 10
	let self = this

	function setPieSize() {
		let windowHeight = window.innerHeight
		let windowWidth = window.innerWidth
		self.root.style.setProperty('--pie-dimension',
			Math.min(windowHeight - 2 * self.paddingForPie, windowWidth - 2 * self.paddingForPie) / 2 + "px");
	}

	setPieSize()
	window.addEventListener('resize', setPieSize);
}

Pohmeedor.prototype.setOptionsDisplay = function (value) {
	this.timerOptions.style.display = value
}

Pohmeedor.prototype.setTimerContainerDisplay = function (value) {
	this.timerContainer.style.display = value
}

Pohmeedor.prototype.setTimerMessageDisplay = function (value) {
	this.timerCompleteMessage.style.display = value
}

Pohmeedor.prototype.setPieComplete = function () {
	this.root.style.setProperty('--first-half-rotate', "180deg")
	this.root.style.setProperty('--second-half-rotate', "180deg")
	this.root.style.setProperty('--pie-color', 'rgba(244, 96, 54, 1)')
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
	this.setTimerContainerDisplay("none")
}

Pohmeedor.prototype.reset = function () {
	this.stop()
	this.runTimer()
}

Pohmeedor.prototype.runTimer = function () {
	this.setOptionsDisplay("none")
	this.setTimerContainerDisplay("block")
	this.root.style.removeProperty('--pie-color') // if pie was finished and color was changed- reset this property

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
			this.root.style.setProperty('--first-half-rotate', "180deg")
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


