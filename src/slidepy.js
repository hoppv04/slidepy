function Slidepy(selector, options = {}) {
  this.container = document.querySelector(selector);
  if (!this.container) {
    console.error(`Slidepy: Container "${selector}" not found!`);
    return;
  }

  const defaultOpt = {
    items: 1,
    speed: 300,
    loop: false,
    nav: true,
    controls: true,
    controlsText: ["<", ">"],
    prevButton: null,
    nextButton: null,
    slideBy: 1,
  };

  this.opt = { ...defaultOpt, ...options };
  this.slides = Array.from(this.container.children);

  this.currentIndex = this.opt.loop ? this.opt.items : 0;

  this._init();
  this._updatePosition();
}

Slidepy.prototype._init = function () {
  this.container.classList.add("slidepy-wrapper");

  this._createContent();
  this._createTrack();

  if (this.opt.controls) {
    this._createControls();
  }

  if (this.opt.nav) {
    this._createNav();
  }
};

Slidepy.prototype._createContent = function () {
  this.content = document.createElement("div");
  this.content.className = "slidepy-content";
  this.container.appendChild(this.content);
};

Slidepy.prototype._createTrack = function () {
  this.track = document.createElement("div");
  this.track.className = "slidepy-track";

  if (this.opt.loop) {
    const cloneHead = this.slides
      .slice(-this.opt.items)
      .map((node) => node.cloneNode(true));
    const cloneTail = this.slides
      .slice(0, this.opt.items)
      .map((node) => node.cloneNode(true));

    this.slides = cloneHead.concat(this.slides.concat(cloneTail));
  }

  this.slides.forEach((slide) => {
    slide.classList.add("slidepy-slide");
    slide.style.flexBasis = `calc(100% / ${this.opt.items})`;
    this.track.appendChild(slide);
  });

  this.content.appendChild(this.track);
};

Slidepy.prototype._createControls = function () {
  this.prevBtn = this.opt.prevButton
    ? document.querySelector(this.opt.prevButton)
    : document.createElement("button");
  this.nextBtn = this.opt.nextButton
    ? document.querySelector(this.opt.nextButton)
    : document.createElement("button");

  if (!this.opt.prevButton) {
    this.prevBtn.textContent = this.opt.controlsText[0];
    this.prevBtn.className = "slidepy-prev";
    this.content.appendChild(this.prevBtn);
  }

  if (!this.opt.nextButton) {
    this.nextBtn.textContent = this.opt.controlsText[1];
    this.nextBtn.className = "slidepy-next";
    this.content.appendChild(this.nextBtn);
  }

  const stepSize =
    this.opt.slideBy === "page" ? this.opt.items : this.opt.slideBy;

  this.prevBtn.onclick = () => this.moveSlide(-stepSize);
  this.nextBtn.onclick = () => this.moveSlide(stepSize);
};

Slidepy.prototype._getSlideCount = function () {
  return this.slides.length - (this.opt.loop ? this.opt.items * 2 : 0);
};

Slidepy.prototype._createNav = function () {
  this.navWrapper = document.createElement("div");
  this.navWrapper.className = "slidepy-nav";

  const slideCount = this._getSlideCount();
  const pageCount = Math.ceil(slideCount / this.opt.items);

  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement("button");
    dot.className = "slidepy-dot";

    if (i === 0) dot.classList.add("active");

    dot.onclick = () => {
      this.currentIndex = this.opt.loop
        ? i * this.opt.items + this.opt.items
        : i * this.opt.items;

      this._updatePosition();
    };

    this.navWrapper.appendChild(dot);
  }

  this.container.appendChild(this.navWrapper);
};

Slidepy.prototype.moveSlide = function (step) {
  if (this._isAnimating) return;
  this._isAnimating = true;

  const maxIndex = this.slides.length - this.opt.items;

  this.currentIndex = Math.min(Math.max(this.currentIndex + step, 0), maxIndex);

  setTimeout(() => {
    if (this.opt.loop) {
      const slideCount = this._getSlideCount();

      if (this.currentIndex <= this.opt.items) {
        this.currentIndex += slideCount;
        this._updatePosition(true);
      } else if (this.currentIndex >= slideCount) {
        this.currentIndex -= slideCount;
        this._updatePosition(true);
      }
    }
    this._isAnimating = false;
  }, this.opt.speed);

  this._updatePosition();
};

Slidepy.prototype._updateNav = function () {
  let realIndex = this.currentIndex;

  if (this.opt.loop) {
    const slideCount = this.slides.length - this.opt.items * 2;
    realIndex = (this.currentIndex - this.opt.items + slideCount) % slideCount;
  }

  const pageIndex = Math.floor(realIndex / this.opt.items);

  const dots = Array.from(this.navWrapper.children);

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === pageIndex);
  });
};

Slidepy.prototype._updatePosition = function (instant = false) {
  this.track.style.transition = instant
    ? "none"
    : `transform ease ${this.opt.speed}ms`;
  this.offset = -(this.currentIndex * (100 / this.opt.items));
  this.track.style.transform = `translateX(${this.offset}%)`;

  if (this.opt.nav && !instant) {
    this._updateNav();
  }
};
