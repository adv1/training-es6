$(document).ready(function() {
	class Timer {
		constructor(requiredDisplay) {
			this._timerRunning = false,
			this._timerCurrentTime = 0;
			this._timerElement = requiredDisplay.timerElement;
			this._interval = requiredDisplay.timerInterval;
		}
		start() {
			this._timerRunning = true;
		}
		stop() {
			this._timerRunning = false;
		}
		reset() {
			this._timerCurrentTime = 0;
		}
		clearTime(timerDisplayedTime) {
			clearInterval(timerDisplayedTime)
		}
		prepareDisplayedTime(time) {
			let milliSeconds = time % 1000,
	        seconds = Math.floor((time / 1000) % 60) ,
	        minutes = Math.floor((time / 1000 / 60) % 60);

	        (minutes < 10) ? minutes = `0${minutes}`: minutes;
	        (seconds >= 60) ? seconds = seconds % 60 : seconds;
	        (seconds < 10) ? seconds = `0${seconds}` : seconds;
	        (milliSeconds < 10) ? milliSeconds = `0${milliSeconds}` : milliSeconds;
	        (milliSeconds > 99) ? milliSeconds = milliSeconds / 10 : milliSeconds;
	    return `${minutes}:${seconds},${milliSeconds}`; 
		}
		getDisplayedTime() {
			return setInterval(() => {
				this._timerCurrentTime += this._interval;
				this._timerElement.innerHTML = this.prepareDisplayedTime(this._timerCurrentTime);
			}, this._interval)
		}
	}

	class TimerSecond extends Timer {}
	
	let $displayTimeGeneral = $('#time-general')[0];
	let $displayTimeLap = $('#time-lap')[0];


	let timer = new Timer({
		timerElement: $displayTimeGeneral,
		timerInterval: 10
	});
	let timerLap = new TimerSecond({
		timerElement: $displayTimeLap,
		timerInterval: 10
	});
	let currentLapNumber = 0,
		timeGeneral = 0,
		timeSecondary = 0;

	let startTimer = () => {
		timer.start();
		timerLap.start();
		timeGeneral = timer.getDisplayedTime();
		timeSecondary = timerLap.getDisplayedTime();
		$('#start-btn').text('Стоп').css('color', 'red');
		$('#reset-btn').text('Круг');
	}
	let stopTimer = () => {
		timer.stop();
		timerLap.stop();
		timer.clearTime(timeGeneral);
		timerLap.clearTime(timeSecondary);
		$('#start-btn').text('Старт').css('color', 'green');
		$('#reset-btn').text('Сброс');
	}
	let reset = () => {
		$('.lap-results').empty();
		$('#reset-btn').text('Круг');
		currentLapNumber = 0;
		$displayTimeGeneral.innerHTML = '00:00,00';
		$displayTimeLap.innerHTML = '00:00,00';
		timer.reset();
		timerLap.reset();
	}
	let saveLap = () => {
		currentLapNumber++;
		$('.lap-results').append(`<div class="resultLine">
								  <span class="currentLap"> Круг ${currentLapNumber} </span>
								  <span class="currentTime"> ${$displayTimeLap.textContent} </span>
								</div>`);
		
		timerLap.reset();
	}
	

	$('#start-btn').on('click', function() {
		!(timer._timerRunning) ? startTimer() : stopTimer();
	})
	$('#reset-btn').on('click', function() {
		(timer._timerRunning) ? saveLap() : reset();
	})
});
