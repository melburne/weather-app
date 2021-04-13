export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400 ? (input.placeholder = "City, State, Country") : (input.placeholder = "City, State, Country or Zip code");
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMessage, screenReaderMessage) => {
  updateWeatherLocationHeader(headerMessage);
  updateScreenReaderConfirmation(screenReaderMessage);
};

export const displayApiError = (statusCode) => {
  const properMessage = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMessage);
  updateScreenReaderConfirmation(`${properMessage}. Please try again.`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h2 = document.getElementById("currentForecast__location");
  h2.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
};

export const updateDisplay = (weatherJson, location) => {
  // hide weather
  fadeDisplay();

  clearDisplay();

  const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
  setBackgroundImage(weatherClass);

  const screenReaderWeather = buildScreenReaderWeather(weatherJson, location);
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(location.getName());

  // show weather (toggle adds .fade-in back to the elements)
  fadeDisplay();
};

const fadeDisplay = () => {
  const currentConditions = document.getElementById("currentForecast");
  currentConditions.classList.toggle("zero-vis");
  currentConditions.classList.toggle("fade-in");

  const dailyForecast = document.getElementById("dailyForecast");
  dailyForecast.classList.toggle("zero-vis");
  dailyForecast.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentConditions = document.getElementById("currentForecast__conditions");
  deleteContents(currentConditions);

  const dailyForecast = document.getElementById("dailyForecast__contents");
  deleteContents(dailyForecast);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  const firstTwoChar = icon.slice(0, 2);
  const lastChar = icon.slice(2);

  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog"
  };

  let weatherClass;
  if (weatherLookup[firstTwoChar]) {
    weatherClass = weatherLookup[firstTwoChar];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
};

const setBackgroundImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  // remove img if it does not match the weather class determined in #getWeatherClass
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img)
  });
};

const buildScreenReaderWeather = (weatherJson, location) => {
  const locationName = location.getName();
  const unit = location.getUnit();
  const tempUnit = unit === "imperial" ? "Fahrenheit" : "Celsius";

  return `${weatherJson.current.weather[0].description} and ${Math.round(Number(weatherJson.current.temp))}°${tempUnit} in ${locationName}`
}
