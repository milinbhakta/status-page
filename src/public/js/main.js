document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  if (!appElement) {
    console.error("Element with id 'app' not found");
    return;
  }

  appElement.addEventListener("htmx:afterSwap", () => {
    const createdElements = document.querySelectorAll("#created");

    createdElements.forEach((element) => {
      const timestamp = element.getAttribute("data-date");
      if (!timestamp) {
        console.error("No 'data-date' attribute found");
        return;
      }

      const date = new Date(Number(timestamp) * 1000);
      if (isNaN(date.getTime())) {
        console.error("Invalid timestamp");
        return;
      }

      element.textContent = "CreatedOn: " + date.toLocaleString();
    });

    const updatedOnElement = document.getElementById("updatedOn");
    if (!updatedOnElement) {
      console.error("Element with id 'updatedOn' not found");
      return;
    }

    updatedOnElement.textContent = "UpdatedOn: " + new Date().toLocaleString();
  });
});
