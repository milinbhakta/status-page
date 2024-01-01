import Handlebars from "hbs";

export default function registerHandlebarsHelpers() {
  Handlebars.registerHelper("statusClass", function (status) {
    if (status === "healthy") {
      return "healthy";
    } else if (status.includes("unhealthy")) {
      return "unhealthy";
    } else if (status.includes("starting")) {
      return "starting";
    } else {
      return "unknown";
    }
  });

  Handlebars.registerHelper("statusTxtClass", function (status) {
    if (status === "healthy") {
      return "healthyTxt";
    } else if (status.includes("unhealthy")) {
      return "unhealthyTxt";
    } else if (status.includes("starting")) {
      return "startingTxt";
    } else {
      return "unknownTxt";
    }
  });
}
