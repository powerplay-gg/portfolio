window.addEventListener("load", function () {
  document.querySelector(".burger").addEventListener("click", function () {
    this.classList.toggle("active");
    console.log(this.classList);
    document.querySelector(".leftbar").classList.toggle("open");
  });
  var lightbox = new SimpleLightbox(".lightbox", {
    close: false, nav: false, showCounter: false
  });
});