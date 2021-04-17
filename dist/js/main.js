import {
  setLocationObject,
  getHomeLocation,
  cleanText,
  getCoordsFromApi,
  getWeatherFromCoords,
} from "./dataFunctions.js";
import {
  setPlaceholderText,
  addSpinner,
  displayError,
  updateScreenReaderConfirmation,
  displayApiError,
  updateDisplay,
} from "./domFunctions.js";
import CurrentLocation from "./CurrentLocation.js";
const currentLocation = new CurrentLocation();

const initApp = () => {
  // add listeners
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);

  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);

  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", saveLocation);

  const unitButton = document.getElementById("unit");
  unitButton.addEventListener("click", setUnitPreference);

  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshWeather);

  const locationEntry = document.getElementById("searchBar__form");
  locationEntry.addEventListener("submit", submitNewLocation);

  // set up
  setPlaceholderText();

  // load weather
  loadWeather();
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
  // TODO: Check if unit can be added here
  const coordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Lon:${position.coords.longitude}`,
  };

  setLocationObject(currentLocation, coordinates);
  // console.log(currentLocation);
  updateDataAndDisplay(currentLocation);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event.type === "click") {
    displayError("No home location saved", "Sorry, please save your home location first");
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector(".fa-home");
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home);
    const coordinates = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObject(currentLocation, coordinates);
    updateDataAndDisplay(currentLocation);
  }
};

const saveLocation = () => {
  if (currentLocation.getLat() && currentLocation.getLon()) {
    const saveIcon = document.querySelector(".fa-save");
    addSpinner(saveIcon);
    const location = {
      lat: currentLocation.getLat(),
      lon: currentLocation.getLon(),
      name: currentLocation.getName(),
      unit: currentLocation.getUnit(),
    };
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
    updateScreenReaderConfirmation(`Saved ${currentLocation.getName()} as home location.`);
  }
};

const setUnitPreference = () => {
  const unitIcon = document.querySelector(".fa-chart-bar");
  addSpinner(unitIcon);
  currentLocation.toggleUnit();
  updateDataAndDisplay(currentLocation);
};

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-sync-alt");
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLocation);
};

const submitNewLocation = async (event) => {
  // prevent the page from reloading
  event.preventDefault();

  const text = document.getElementById("searchBar__text").value;
  const entryText = cleanText(text);
  if (!entryText.length) {
    return;
  }

  const locationIcon = document.querySelector(".fa-search");
  addSpinner(locationIcon);
  const coordinatesData = await getCoordsFromApi(entryText, currentLocation.getUnit());
  if (coordinatesData) {
    if (coordinatesData.cod === 200) {
      const coordinates = {
        lat: coordinatesData.coord.lat,
        lon: coordinatesData.coord.lon,
        name: coordinatesData.sys.country
          ? `${coordinatesData.name}, ${coordinatesData.sys.country}`
          : coordinatesData.name,
      };
      setLocationObject(currentLocation, coordinates);
      updateDataAndDisplay(currentLocation);
    } else {
      displayApiError(coordinatesData);
    }
  } else {
    displayError("Connection error", "Connection error");
  }
};

const updateDataAndDisplay = async (location) => {
  const weatherJson = await getWeatherFromCoords(location);
  console.log(weatherJson);
  if (weatherJson) {
    updateDisplay(weatherJson, location);
  }
};
