import {
  addSpinner
} from "./domFunctions.js";
import CurrentLocation from "./CurrentLocation.js";
const currentLocation = new CurrentLocation();

const initApp = () => {
  // add listeners
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);
};

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
  if (event) {
    if (event.type === "click") {
      const mapIcon = document.querySelector(".fa-map-marker-alt");
      addSpinner(mapIcon);
    }
  }

  // if (!navigator.geolocation) return geoError();
  // navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};
