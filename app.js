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
	this.timerReceived = document.getElementById('timerReceived')
	this.customTimeInput = document.getElementById("time-min")

	this.customTimeInput.addEventListener("keyup", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			this.customStart();
		}
	}.bind(this))
}

Pohmeedor.prototype.predefinedStart = function (predefinedTime) {
	this.timeInput = predefinedTime
	this.initializePie()
}

Pohmeedor.prototype.customStart = function () {
	this.timeInput = parseFloat(this.customTimeInput.value)
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
	const timerToSend = {
		timer: {
			id: this.timerUUID,
			duration: this.timeInput * 60 * 1000,
			name: this.timerName
		}
	}

	const postTimer = function () {
		fetch(this.BASE_URL,
			{
				method: "post",
				headers: { "Content-type": "application/json; charset=UTF-8" },
				body: JSON.stringify(timerToSend)
			})
			.then(res => {
				if (res.status === 500) { // repeat sending post until response status is not 500; remove this workaround when database is fixed
					postTimer()
				}
			})
	}.bind(this)

	postTimer()

}

Pohmeedor.prototype.setTimerDetails = function () {
	document.getElementById('timerName').innerText = this.timerName
	document.getElementById('timerId').innerText = this.timerUUID
	document.getElementById('timerTime').innerText = this.timeInput + " min"
}

Pohmeedor.prototype.findTimerById = function () {
	const timerToFindId = document.getElementById("timer-id").value

	const getTimer = function () {
		fetch(this.BASE_URL + "/" + timerToFindId)
			.then(res => {
				if (res.status === 500) {
					getTimer()
					return
				}
				return res.json()
			})
			.then(resp => {
				if (resp) {
					this.setOptionsDisplay("none")
					this.setReceivedTimerDetails(resp.data)
				}
			})
	}.bind(this)

	getTimer()

}

Pohmeedor.prototype.setReceivedTimerDetails = function (receivedTimer) {
	document.getElementById('receivedTimerName').innerText = receivedTimer.name
	document.getElementById('receivedTimerDuration').innerText = receivedTimer.duration / 60000 + " min"
	document.getElementById('receivedTimerStart').innerText = (new Date(receivedTimer.start_time)).toLocaleString()
	document.getElementById('receivedTimerId').innerText = receivedTimer.id
	this.setReceivedTimerDisplay('block')
	this.receivedTimerCountdown(receivedTimer)
}

Pohmeedor.prototype.receivedTimerCountdown = function (receivedTimer) {
	const timer = function () {
		const now = new Date().getTime();
		const end = new Date(receivedTimer.start_time).getTime() + receivedTimer.duration
		const distance = end - now

		const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
		const seconds = Math.floor((distance % (1000 * 60)) / 1000)

		document.getElementById('remainingTime').innerText = hours + "h "
			+ minutes + "m " + seconds + "s ";

		if (distance < 0) {
			clearInterval(timer);
			document.getElementById("remainingTime").innerHTML = 'Expired'
		}
	}

	timer()
	setInterval(timer, 1000)
}

Pohmeedor.prototype.pieResizer = function () {
	this.paddingForPie = 10

	const setPieSize = function () {
		let windowHeight = window.innerHeight
		let windowWidth = window.innerWidth
		this.root.style.setProperty('--pie-dimension',
			Math.min(windowHeight - 2 * this.paddingForPie, windowWidth - 2 * this.paddingForPie) / 2 + "px");
	}.bind(this)

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

Pohmeedor.prototype.setReceivedTimerDisplay = function (value) {
	this.timerReceived.style.display = value
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

Pohmeedor.prototype.backToOptions = function () {
	this.setReceivedTimerDisplay('none')
	this.setOptionsDisplay('block')
}

Pohmeedor.prototype.runTimer = function () {
	this.setOptionsDisplay("none")
	this.setTimerContainerDisplay("block")
	this.root.style.removeProperty('--pie-color') // if pie was finished and color was changed- reset this property

	const degreeForOneSecond = 360 / this.timeInSec
	let currentFHDegree = 0
	let currentSHDegree = 0

	this.starterForFirstHalf // starting timer from 0
	this.stopperForFirstHalf // stops first half after halftime
	this.secondHalfIntervalToken // start timer from halftime
	this.stopperForSecondHalf // stops timer after full time

	this.stopperForSecondHalf = setTimeout(
		() => {
			clearInterval(this.secondHalfIntervalToken)
			this.setPieComplete()
		}, this.timeInSec * 1000
	)

	this.starterForFirstHalf = setInterval(() => {
		currentFHDegree += degreeForOneSecond
		this.root.style.setProperty('--first-half-rotate', currentFHDegree + "deg")
	}, 1000)

	this.stopperForFirstHalf = setTimeout( // stop changing first half of pie after halftime 
		() => {
			this.root.style.setProperty('--first-half-rotate', "180deg")
			clearInterval(this.starterForFirstHalf)
			this.timerForSecondHalf()
		}, this.timeInSec / 2 * 1000
	)

	this.timerForSecondHalf = function() {
		this.secondHalfIntervalToken = setInterval(() => {
			currentSHDegree += degreeForOneSecond
			this.root.style.setProperty('--second-half-rotate', currentSHDegree + "deg")
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


