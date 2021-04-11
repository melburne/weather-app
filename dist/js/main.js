import {
  setLocationObject
} from "./dataFunctions.js";
import {
  addSpinner,
  displayError
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

  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errorObject) => {
  const errorMessage = errorObject ? errorObject.message : "Geolocation not supported";
  displayError(errorMessage, errorMessage);
};

const geoSuccess = (position) => {
  const coordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Lon:${position.coords.longitude}`
  };

  setLocationObject(currentLocation, coordinates);
  // console.log(currentLocation);
  updateDataAndDisplay(currentLocation);
}

const updateDataAndDisplay = async (location) => {
  // const weatherJson = await getWeatherFromCoordinates(location);
  // if (weatherJson) {
  //   updateDisplay(weatherJson, location);
  // }
};
