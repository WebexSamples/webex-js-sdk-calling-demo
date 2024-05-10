class Timer {
    constructor(callTime) {
        this.minutes = 0;
        this.seconds = 0;
        this.interval = null;
        this.elementToUpdate = callTime;
    }

    _updateDisplay() {
        this.elementToUpdate.innerHTML = `${this.minutes < 10 ? '0' + this.minutes : this.minutes}:${this.seconds < 10 ? '0' + this.seconds : this.seconds}`;
    }

    start() {
        if (this.interval) {
            clearInterval(this.interval); // To ensure no multiple intervals are created if start is called multiple times.
        }
        this.interval = setInterval(() => {
            this.seconds++;
            if(this.seconds === 60){
                this.seconds = 0;
                this.minutes++;
            }
            this._updateDisplay();
        }, 1000);
    }

    pause() {
        clearInterval(this.interval);
    }

    continue() {
        this.start();
    }

    stop() {
        clearInterval(this.interval);
        this.minutes = 0;
        this.seconds = 0;
        this._updateDisplay();
    }
}
