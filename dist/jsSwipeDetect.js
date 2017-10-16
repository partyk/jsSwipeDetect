"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsSwipeDetect = function () {
    function JsSwipeDetect(options) {
        _classCallCheck(this, JsSwipeDetect);

        this._options = _extends({}, {
            element: '',

            threshold: 150,
            restraint: 100,
            allowedTime: 800,
            handleTouch: function handleTouch(e, direction, phase, type, distance) {}
        }, options || {});

        this._start = {
            x: 0,
            y: 0
        };

        this._end = {
            x: 0,
            y: 0
        };

        this._time = {
            start: 0,
            end: 0,
            elapsed: 0 };

        this._swipeType = 'none';

        this.init();
    }

    _createClass(JsSwipeDetect, [{
        key: 'init',
        value: function init() {
            this.element = _typeof(this._options.element) == 'object' ? this._options.element : document.querySelector(this._options.element);
            this.addEventTouch();
        }
    }, {
        key: 'addEventTouch',
        value: function addEventTouch() {
            var _this2 = this;

            var _this = this;
            this.element.addEventListener('touchstart', function (e) {
                _this2.eventTouchStart.call(_this2, e);
            }, false);
            this.element.addEventListener('touchmove', function (e) {
                _this2.eventTouchMove.call(_this2, e);
            }, false);
            this.element.addEventListener('touchend', function (e) {
                _this2.eventTouchEnd.call(_this2, e);
            }, false);
        }
    }, {
        key: 'eventTouchStart',
        value: function eventTouchStart(e) {
            var touchObj = e.changedTouches[0];

            this._swipeType = 'none';

            this._start.x = touchObj.pageX;
            this._start.y = touchObj.pageY;

            this._time.start = new Date().getTime();
            this._options.handleTouch.call(this, e, 'none', 'start', this._swipeType, 0);

            e.preventDefault();
        }
    }, {
        key: 'eventTouchMove',
        value: function eventTouchMove(e) {
            var touchObj = e.changedTouches[0];

            this._end.x = touchObj.pageX - this._start.x;
            this._end.y = touchObj.pageY - this._start.y;

            this._options.handleTouch.call(this, e, this.getDirection(), 'move', this._swipeType, this._end[this.getAxis()]);
        }
    }, {
        key: 'eventTouchEnd',
        value: function eventTouchEnd(e) {
            var touchObj = e.changedTouches[0];

            this._time.end = new Date().getTime();
            this._time.elapsed = this._time.end - this._time.start;

            if (this._time.elapsed === false || this._time.elapsed <= this._options.allowedTime && (Math.abs(this._end.x) >= this._options.threshold && Math.abs(this._end.y) <= this._options.restraint || Math.abs(this._end.y) >= this._options.threshold && Math.abs(this._end.x) <= this._options.restraint)) {
                this._swipeType = this.getDirection();
            }

            this._options.handleTouch.call(this, e, this.getDirection(), 'end', this._swipeType, this._end[this.getAxis()]);
            e.preventDefault();
        }
    }, {
        key: 'isAxisX',
        value: function isAxisX() {
            return Math.abs(this._end.x) > Math.abs(this._end.y);
        }
    }, {
        key: 'getAxis',
        value: function getAxis() {
            return this.isAxisX() ? 'x' : 'y';
        }
    }, {
        key: 'getDirection',
        value: function getDirection() {
            if (this.isAxisX()) {
                return this._end.x < 0 ? 'left' : 'right';
            } else {
                return this._end.y < 0 ? 'up' : 'down';
            }
        }
    }]);

    return JsSwipeDetect;
}();
//# sourceMappingURL=jsSwipeDetect.js.map
