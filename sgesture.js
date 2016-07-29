const emptyFunc = () => {};
class Gesture {
  constructor(target, option = {}) {
    this.last = null;
    this.now = null;
    this.x1 = null;
    this.y1 = null;
    this.x2 = null;
    this.y2 = null;
    this.startPos = null;
    this.pinchStartLen = null;
    this.rotateStartAngle = null;
    this.lastTapPos = null;
    this.touchStart = option.touchStart || emptyFunc;
    this.touchMove = option.touchMove || emptyFunc;
    this.touchEnd = option.touchEnd || emptyFunc;
    this.touchCancel = option.touchCancel || emptyFunc;
    this.pinch = option.pinch || emptyFunc;
    this.rotate = option.rotate || emptyFunc;
    this.pressMove = option.pressMove || emptyFunc;
    this.tap = option.tap || emptyFunc;
    this.longTap = option.longTap || emptyFunc;
    this.doubleTap = option.doubleTap || emptyFunc;

    target.addEventListener('touchstart', this.start.bind(this), false);
    target.addEventListener('touchmove', this.move.bind(this), false);
    target.addEventListener('touchend', this.end.bind(this), false);
    target.addEventListener('touchcancel', this.cancel.bind(this), false);
  }

  getLen($1, $2) {
    return Math.sqrt(Math.pow(($1.pageX - $2.pageX), 2) + Math.pow(($1.pageY - $2.pageY), 2));
  }

  getAngle($1, $2) {
    return Math.atan(($1.pageY - $2.pageY) / ($1.pageX - $2.pageY)) / Math.PI * 180;
  }

  getDirection(startPos, $1) {
    const x = $1.pageX - startPos.x;
    const y = $1.pageY - startPos.y;
    if (Math.abs(x) < 30 && Math.abs(y) < 30) return false;
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) return 'right';
      return 'left';
    }
    if (y > 0) return 'down';
    return 'up';
  }

  start(e) {
    const touches = e.changedTouches;
    if (!touches) return;
    this.last = Date.now();
    this.startPos = {
      x: e.pageX,
      y: e.pageY,
    };
    if (touches.length > 1) {
      const $1 = touches[0];
      const $2 = touches[1];
      this.pinchStartLen = this.getLen($1, $2);
      this.rotateStartAngle = this.getAngle($1, $2);
      return;
    }
    this.longTapTimeout = setTimeout(() => {
      this.longTap(e);
    }, 1200);
  }

  move(e) {
    const touches = e.touches;
    if (!touches) return;
    clearTimeout(this.longTapTimeout);
    if (touches > 1) {
      const $1 = touches[0];
      const $2 = touches[1];
      const pinchNowLen = this.getLen($1, $2);
      const scale = pinchNowLen / this.pinchStartLen;
      this.pinchStartLen = pinchNowLen;
      const rotateNowAngle = this.getAngle($1, $2);
      const rotation = rotateNowAngle - this.rotateStartAngle;
      this.rotateStartAngle = this.rotateNowAngle;
      const pinchEvt = Object.assign(e, { scale });
      const rotateEvt = Object.assign(e, { rotation });
      this.pinch(pinchEvt);
      this.rotate(rotateEvt);
      this.pressMove(e);
      return;
    }
  }

  end(e) {
    const touches = e.changedTouches;
    if (!touches) return;
    clearTimeout(this.longTapTimeout);
    this.now = Date.now();
    const $1 = touches[0];
    const direction = this.getDirection(this.startPos, $1);
    if (direction) {
      this.swipe(e, { direction });
      return;
    }
    if (!this.lastTapPos && this.now - this.last < 300) {
      if (Math.abs($1.pageX - this.lastTapPos.x) < 30
      && Math.abs($1.pageY - this.lastTapPos.Y) < 30
      ) {
        this.doubleTap(e);
        this.lastTapPos = null;
        return;
      }
    }
    this.tap(e);
    this.lastTapPos = {
      x: $1.pageX,
      y: $1.pageY,
    };
  }

  cancel(e) {
    clearTimeout(this.longTapTimeout);
    this.touchCancel(e);
  }

  on(name, func) {
    this.name = func;
  }
}

const sgesture = (ele, option) => new Gesture(ele, option);

export default sgesture;
