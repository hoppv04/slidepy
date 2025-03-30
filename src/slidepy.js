function Slidepy(selector, options = {}) {
  this.container = document.querySelector(selector);
  if (!this.container) {
    console.error(`Slidepy: Container "${selector}" not found!`);
    return;
  }

  this._defaultOpt = {
    items: 1,
    loop: false,
  };

  this.opt = { ...this._defaultOpt, ...options };
  this.slides = Array.from(this.container.children);

  this.currentIndex = 0;

  this._init();
}

Slidepy.prototype._init = function () {
  this.container.classList.add("slidepy-wrapper");

  this._createTrack();

  this._createNavigation();
};

Slidepy.prototype._createTrack = function () {
  this.track = document.createElement("div");
  this.track.className = "slidepy-track";

  this.slides.forEach((slide) => {
    slide.classList.add("slidepy-slide");
    slide.style.flexBasis = `calc(100% / ${this.opt.items})`;
    this.track.appendChild(slide);
  });

  this.container.appendChild(this.track);
};

Slidepy.prototype._createNavigation = function () {
  this.prevBtn = document.createElement("button");
  this.nextBtn = document.createElement("button");

  this.prevBtn.textContent = "<";
  this.nextBtn.textContent = ">";

  this.prevBtn.className = "slidepy-prev";
  this.nextBtn.className = "slidepy-next";

  this.container.append(this.prevBtn, this.nextBtn);

  this.prevBtn.onclick = () => this.moveSlide(-1);
  this.nextBtn.onclick = () => this.moveSlide(1);
};

Slidepy.prototype.moveSlide = function (step) {
  if (this.opt.loop) {
    this.currentIndex =
      (this.currentIndex + step + this.slides.length) % this.slides.length;
  } else {
    this.currentIndex = Math.min(
      Math.max(this.currentIndex + step, 0),
      this.slides.length - this.opt.items
    );
  }
  this.offset = -(this.currentIndex * (100 / this.opt.items));
  this.track.style.transform = `translateX(${this.offset}%)`;
};
