"use strict";
/**
 * jsSwipeDetection
 * Detection of swipe direction
 */
class JsSwipeDetect {
    /**
     * konstruktor
     * @param {object} options nastaveni 
     */
    constructor(options) {
        console.log('creat construct');
        this._options = Object.assign({}, {
            element: '',
            //nastaveni gesta
            threshold: 150, //minimalni vzdalenost
            restraint: 100, //omezeni
            allowedTime: 800, // maximalni cas
            //callback
            handleTouch: (e, direction, phase, type, distance) => {}
        }, options || {})

        //pocatecni souradnice
        this._start = {
            x: 0,
            y: 0
        }

        //cilove souradnice
        this._end = {
            x: 0,
            y: 0
        }

        //cas
        this._time = {
            start: 0, //pocatecni cas gesta
            end: 0, //koncovy cas gesta
            elapsed: 0 //delka trvani
        }

        this._swipeType = 'none';

        this.init();
    }

    /**
     * init
     */
    init() {
        this.element = typeof this._options.element == 'object' ? this._options.element : document.querySelector(this._options.element);
        this.addEventTouch();
    }

    /**
     * pridani eventu pro touch
     */
    addEventTouch() {
        let _this = this;
        this.element.addEventListener('touchstart', (e) => {
            this.eventTouchStart.call(this, e);
        }, false);
        this.element.addEventListener('touchmove', (e) => {
            this.eventTouchMove.call(this, e);
        }, false);
        this.element.addEventListener('touchend', (e) => {
            this.eventTouchEnd.call(this, e);
        }, false);
    }

    /**
     * touch start
     * @param {object} e event
     */
    eventTouchStart(e) {
        console.log('start');

        //predam zmenu udalosti
        let touchObj = e.changedTouches[0];

        //reset swipeType
        this._swipeType = 'none';

        //nastavim pocatecni souradnice
        this._start.x = touchObj.pageX;
        this._start.y = touchObj.pageY;

        //zacatek udalosti
        this._time.start = new Date().getTime(); //nastavim pocatecni cas

        console.log('start coordinates x:' + this._start.x + ', y:' + this._start.y);

        //zavolam callback
        this._options.handleTouch.call(this, e, 'none', 'start', this._swipeType, 0);

        e.preventDefault()
    }

    /**
     * touch move
     * @param {object} e event
     */
    eventTouchMove(e) {
        console.log('move');

        //predam zmenu udalosti
        let touchObj = e.changedTouches[0];

        //vypocteme posun od pocatecniho bodu
        this._end.x = touchObj.pageX - this._start.x;
        this._end.y = touchObj.pageY - this._start.y;

        console.log('move coordinates x:' + this._end.x + ', y:' + this._end.y);
        console.log('direction:' + this.getDirection());
        console.log('distance:' + this._end[this.getAxis()]);

        this._options.handleTouch.call(this, e, this.getDirection(), 'move', this._swipeType, this._end[this.getAxis()]);
    }

    /**
     * touch end
     * @param {object} e event
     */
    eventTouchEnd(e) {
        console.log('end');
        
        //predam zmenu udalosti
        let touchObj = e.changedTouches[0];

        //vypoctu delku eventu
        this._time.end = new Date().getTime();
        this._time.elapsed = this._time.end - this._time.start;

        if (
                this._time.elapsed === false || this._time.elapsed <= this._options.allowedTime //1) podminka pro detekci pohybu. Testuji zdali je delka gesta kratsinez nastaveny case nebo false a podminka se 
                && (
                    Math.abs(this._end.x) >= this._options.threshold && Math.abs(this._end.y) <= this._options.restraint //2a) podminka pro horizontalní pretahovani
                    || Math.abs(this._end.y) >= this._options.threshold && Math.abs(this._end.x) <= this._options.restraint //2b) podminka pro vertikalní pretahovani
                )
            ) {
                this._swipeType = this.getDirection();
            }

        console.log('end coordinates x:' + this._end.x + ', y:' + this._end.y);
        console.log('direction:' + this.getDirection());
        console.log('swipe:' + this._swipeType);
        console.log('distance:' + this._end[this.getAxis()]);

        this._options.handleTouch.call(this, e, this.getDirection(), 'end', this._swipeType, this._end[this.getAxis()]);
        e.preventDefault()
    }

    /**
     * vrati TRUE pokud je posun po horizontalni ose X a FALSE pokud je posun po vertiklani ose Y
     * @returns {bool} true: osa X, false: osa Y
     */
    isAxisX() {
        //pokud je horizontalni vzdalenost vetsi nez vertikalni. Jedna se o hovrizontalni posun v ose X
        return Math.abs(this._end.x) > Math.abs(this._end.y);
    }

    /**
     * vrati nazev osy (x, y)
     * @returns {string} x,y
     */
    getAxis() {
        return this.isAxisX() ? 'x' : 'y';
    }

    /**
     * vrati smer posunu (left, right, up, down)
     * @returns {string}
     */
    getDirection() {
        if(this.isAxisX()) {
            return (this._end.x < 0) ? 'left' : 'right';
        } else {
            return (this._end.y < 0) ? 'up' : 'down';
        }
    }
}