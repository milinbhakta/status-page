document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app").addEventListener("htmx:afterSwap", (event) => {
    const updatedOn = new Date().toLocaleString();
    document.getElementById("updatedOn").textContent =
      "UpdatedOn: " + updatedOn;
  });
});

