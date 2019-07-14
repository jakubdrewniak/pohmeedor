function Pohmeedor() {
	this.root = document.documentElement;
	this.BASE_URL = "https://pohmeedor.herokuapp.com/api/timers"
	this.toggleColorMode()
	this.init()
}

Pohmeedor.prototype.init = function () {
	this.timerOptions = document.getElementById('timerOptions')
	this.timerContainer = document.getElementById('timerContainer')
	this.timerCompleteMessage = document.getElementById('completeMessage')
	this.timerDetails = document.getElementById('timerDetails')
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
	this.sendTimer()
	this.toggleDetails("none")
	this.setTimerDetails()
}

Pohmeedor.prototype.sendTimer = function () {
	this.timerName = document.getElementById("timer-name").value || 'No name provided'
	this.timerUUID = this.generateUUID()
	const self = this
	const timerToSend = {
		timer: {
			id: this.timerUUID,
			duration: this.timeInput * 60 * 1000,
			name: this.timerName
		}
	}

	function postTimer() {
		fetch(self.BASE_URL,
			{
				method: "post",
				headers: { "Content-type": "application/json; charset=UTF-8" },
				body: JSON.stringify(timerToSend)
			}).then(res => {
				if (res.status === 500) { // repeat sending post until response status is not 500; remove this workaround when database is fixed
					postTimer()
				}
			})
	}

	postTimer()

}

Pohmeedor.prototype.setTimerDetails = function () {
	document.getElementById('timerName').innerText = this.timerName
	document.getElementById('timerId').innerText = this.timerUUID
	document.getElementById('timerTime').innerText = this.timeInput + " min"
}

Pohmeedor.prototype.findTimerById = function () {
	const timerToFindId = document.getElementById("timer-id").value
	const self = this

	function getTimer() {
		fetch(self.BASE_URL + "/" + timerToFindId)
			.then(res => {
				if (res.status === 500) {
					getTimer()
					return
				}
				return res.json()
			})
			.then(resp => {
				if (resp)
					console.log('respdata', resp.data);
			})
	}

	getTimer()

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

Pohmeedor.prototype.toggleDetails = function (value = null) {
	if (value)
		this.timerDetails.style.display = value
	else {
		if (this.timerDetails.style.display === "none")
			this.timerDetails.style.display = "block"
		else
			this.timerDetails.style.display = "none"
	}
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
	this.toggleDetails("none")
}

Pohmeedor.prototype.reset = function () {
	this.stop()
	this.runTimer()
}

Pohmeedor.prototype.copyId = function () {
	let el = document.createElement('textarea');
	el.value = this.timerUUID
	el.setAttribute('readonly', '');
	el.style = { position: 'absolute', left: '-9999px' };
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
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

Pohmeedor.prototype.generateUUID = function () {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}


