document.addEventListener("DOMContentLoaded", () => {
  const containersElement = document.getElementById("containers");
  if (!containersElement) {
    console.error("Element with id 'containers' not found");
    return;
  }

  containersElement.addEventListener("htmx:afterSwap", () => {
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

      element.textContent = `CreatedOn: ${date.toLocaleString()}`;
    });
  });

  document.addEventListener("htmx:afterSwap", function (event) {
    const updatedOnElement = document.getElementById("updatedOn");
    const totalContainersElement = document.getElementById("totalContainers");

    if (!updatedOnElement) {
      console.error("Element with id 'updatedOn' not found");
      return;
    }

    if (!totalContainersElement) {
      console.error("Element with id 'totalContainers' not found");
      return;
    }

    updatedOnElement.textContent = `UpdatedOn: ${new Date().toLocaleString()}`;

    // get details elements
    const detailsElements = document.querySelectorAll("details");
    if (!detailsElements) {
      console.error("No details elements found");
      return;
    }

    totalContainersElement.textContent = `Total Containers: ${detailsElements.length}`;
  });
});
