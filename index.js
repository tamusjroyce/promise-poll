if (typeof Promise === "undefined") {
    var Promise = require('native-promise-only');
}

// https://github.com/allain/promise-poll/blob/master/index.js - allain (Sept 18, 2015), 1/18/2018
function poll(predicate, timeout, interval) {
    if (typeof predicate !== 'function') return Promise.reject(new Error('predicate must be a function'));
    if (timeout && typeof timeout !== 'number') return Promise.reject(new Error('timeout must be given as a number'));

    return new Promise(function (resolve, reject) {
        let intervalId;
        let timeoutId;

        function check() {
            let result = predicate();
            if (result) {
                if (intervalId) clearInterval(intervalId);
                if (timeoutId) clearInterval(timeoutId);

                return resolve(result);
            }

            if (intervalId) clearInterval(intervalId);
            intervalId = setTimeout(check, interval || 10);
        }
        check();

        if (timeout) {
            timeoutId = setTimeout(function () {
                clearInterval(intervalId);
                reject(new Error('timeout'));
            }, timeout);
        }
    });
};

if (typeof module == "undefined") {
    window.module = {};
}

module.exports = function () {
    getXMLHttpRequest = getxmlhttprequest;

    let exports = new Object();
    exports.poll = poll;

    return exports;
}
