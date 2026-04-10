(() => {
  const body = document.body;
  const toggleButton = document.querySelector("[data-sidebar-toggle]");
  const closeElements = document.querySelectorAll("[data-sidebar-close]");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("sidebar-open");
    });
  }

  closeElements.forEach((element) => {
    element.addEventListener("click", () => {
      body.classList.remove("sidebar-open");
    });
  });

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".faq-item")?.classList.toggle("open");
    });
  });
})();
