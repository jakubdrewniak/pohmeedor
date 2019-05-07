function Pohmeedor() {
    this.timeInMin = 25
    this.timeInMillis = 25*60*1000
    this.root = document.documentElement;
    this.init()
}

Pohmeedor.prototype.init = function() {
    this.timer = 0    
    this.runTimer()
    // this.startListeningTimerReset()
}

Pohmeedor.prototype.runTimer = function() {

    this.root.style.setProperty('--first-half-rotate', "10deg");
    this.root.style.setProperty('--second-half-rotate', "11deg");

}
