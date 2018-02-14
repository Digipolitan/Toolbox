let shared;
let instances = {};


class BenchmarkItem {

    constructor() {
        this._last = -1;
        this._times = [];
    }

    start() {
        let length = -1;
        if (this._last > -1) {
            length = this.stop();
        }
        this._last = Date.now();
        return length;
    }

    stop() {
        if (this._last == -1) {
            return -1;
        }

        let time = Date.now() - this._last;
        this._times.push(time);

        this._last = -1;
        return time;
    }

    toString() {
        let averageTime = 0;
        let totalTime = 0;
        let maxTime = 0;
        let minTime = Number.MAX_VALUE;
        if (this._times.length) {
            this._times.forEach(time => {
                totalTime += time;
                if (time > maxTime)
                    maxTime = time;
                if (time < minTime)
                    minTime = time;
            });

            averageTime = totalTime / this._times.length;
            return "Count : " + this._times.length + " time" + (this._times.length > 1 ? "s" : "") + " | Average time : " + averageTime + "ms | Min time : " + minTime + "ms | Max time : " + maxTime + "ms | Total time : " + totalTime + "ms";
        }
        return "No data recorded";
    }
}


class Benchmark {

    constructor() {
        /**
         * if the manager should log times directly when stop() is called
         */
        this.logTimesDuringRecord = false;
        this._items = {};
    }

    static getSharedInstance() {
        return Benchmark.getInstance();
    }

    static getInstance(id) {
        if (!id) {
            if (!shared)
                shared = new Benchmark();
            return shared;
        }

        let instance = instances[id];
        if (!instance) {
            instance = new Benchmark();
            instances[id] = instance;
        }
        return instance;
    }

    /**
     * starts the timer for the given key, if timer is already started for given key, stop the current and starts a new one
     *
     * @param key
     */
    start(key) {
        let item = this._items[key];
        if (!item) {
            item = new BenchmarkItem();
            this._items[key] = item;
        }

        let value = item.start();
        if (value > -1 && this.logTimesDuringRecord) {
            console.log(key + " took " + (value / 1000) + "ms");
        }
    }

    /**
     * Stops the timer for the given key, if timer is not started, print a message and does nothing
     *
     * @param key
     */
    stop(key) {
        let item = this._items[key];
        if (!item) {
            console.log("trying to stop a timer you didn't start for key :" + key);
            return;
        }
        let value = item.stop();
        if (value === -1) {
            console.log("trying to stop a timer you didn't start for key :" + key);
            return;
        }
        if (this.logTimesDuringRecord) {
            console.log(key + " took " + (value / 1000) + "ms");
        }
    }

    /**
     * resets all the recorded data
     */
    reset() {
        this._items = {};
    }

    /**
     * Log all recorded data at this time.
     */
    logData() {
        Object.keys(this._items).forEach(key => {
            console.log(key + " : " + this._items[key].toString());
        });
    }
}

module.exports = Benchmark;






