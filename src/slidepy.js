function Slidepy(selector, options = {}) {
  this.container = document.querySelector(selector);
  if (!this.container) {
    console.error(`Slidepy: Container "${selector}" not found!`);
    return;
  }

  this.opt = { ...options };
  this.slides = Array.from(this.container.children);

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
  console.log(step);
};
