class SSWheel {
  constructor({ wrapper, distance = 100, speed = 1 / 40 } = {}) {
    this.wrapper = wrapper;
    this.distance = distance;
    this.speed = speed;
    this.maxPoint = this.wrapper.scrollHeight - this.wrapper.clientHeight;

    this.init = this.init.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.cancelAnimation = this.cancelAnimation.bind(this);
  }

  currentPoint = 0;
  initialPoint = 0;
  finalPoint = 0;
  direction = String;
  scrolling = false;
  animationId = null;

  #smoothScroll = (distance = this.distance) => {
    if (distance === 0) return;

    const isGoingDown = this.direction === "down";
    const isGoingUp = this.direction === "up";

    const newCurrentPoint = () => {
      if (isGoingDown) return this.currentPoint + distance * this.speed;
      if (isGoingUp) return this.currentPoint + distance * this.speed * -1;
    };

    const newFinalPoint = () => {
      if (isGoingDown)
        return Math.min(this.initialPoint + distance, this.maxPoint);
      if (isGoingUp) return Math.max(this.initialPoint - distance, 0);
    };

    const getStopCondition = () => {
      if (isGoingDown)
        return (
          this.currentPoint < this.initialPoint ||
          this.currentPoint > this.finalPoint
        );
      if (isGoingUp)
        return (
          this.currentPoint > this.initialPoint ||
          this.currentPoint < this.finalPoint
        );
    };

    if (!this.scrolling) {
      this.initialPoint = this.wrapper.scrollTop;
      this.currentPoint = this.initialPoint;
      this.finalPoint = newFinalPoint();
    }

    this.currentPoint = newCurrentPoint();

    if (getStopCondition()) return (this.scrolling = false);

    this.scrolling = true;
    this.wrapper.scrollTo(0, this.currentPoint);

    this.animationId = requestAnimationFrame(() =>
      this.#smoothScroll(distance)
    );
  };

  init() {
    const initSmoothScroll = (direction) => {
      this.direction = direction;
      this.animationId = requestAnimationFrame(() => this.#smoothScroll());
    };

    const shouldScroll = (target) => {
      if (target === this.wrapper) return true;

      let targetUp = target;

      while (targetUp !== this.wrapper) {
        if (targetUp.scrollHeight === targetUp.clientHeight) {
          targetUp = targetUp.parentElement;
        } else {
          return false;
        }
      }

      return true;
    };

    this.wrapper.addEventListener(
      "wheel",
      (e) => {
        if (!shouldScroll(e.target)) return;

        e.preventDefault();
        const direction = e.deltaY > 0 ? "down" : "up";
        initSmoothScroll(direction);
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      this.cancelAnimation();
      this.maxPoint = this.wrapper.scrollHeight - this.wrapper.clientHeight;
    });
  }

  scrollTo(value, { type = "pixels" } = {}) {
    const allowedTypes = ["pixels", "percentage", "element"];
    if (!allowedTypes.includes(type)) return;

    let distance;

    if (type === "percentage") {
      value = (this.maxPoint * value) / 100;
    }

    if (type === "element") {
      let parent = value;
      let compatibleParent = false;
      let top = 0;

      while (!compatibleParent) {
        if (parent.parentElement === this.wrapper) {
          compatibleParent = true;
        }

        parentElement.style.setProperty("position", "relative");
        top += parent.offsetTop;
        parentElement.style.removeProperty("position");
        parent = parent.parentElement;
      }

      value = top;
    }

    distance = value - this.wrapper.scrollTop;
    this.direction = distance > 0 ? "down" : "up";

    this.#smoothScroll(Math.abs(distance));
  }

  cancelAnimation() {
    cancelAnimationFrame(this.animationId);
  }
}

export default SSWheel;
