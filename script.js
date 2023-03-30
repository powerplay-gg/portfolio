window.addEventListener("load", function () {
  document.querySelector(".burger").addEventListener("click", function () {
    this.classList.toggle("active");
    document.querySelector(".headerpart").classList.toggle("open");
  });
});
