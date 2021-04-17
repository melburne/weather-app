export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip code");
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

  if (message.indexOf("Lat:") !== -1 && message.indexOf("Lon:") !== -1) {
    const messageArray = message.split(" ");
    const mapArray = messageArray.map((msg) => {
      return msg.replace(":", ": ");
    });

    const lat = mapArray[0].indexOf("-") === -1 ? mapArray[0].slice(0, 10) : mapArray[0].slice(0, 11);
    const lon = mapArray[1].indexOf("-") === -1 ? mapArray[1].slice(0, 10) : mapArray[1].slice(0, 11);

    h2.textContent = `${lat} • ${lon}`;
  } else {
    h2.textContent = message;
  }
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

  const currentConditionsArray = createCurrentConditionsDivs(weatherJson, location.getUnit());
  displayCurrentConditions(currentConditionsArray);

  displaySixDayForecast(weatherJson);

  setFocusOnSearch();

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
    50: "fog",
  };

  let weatherClass;
  if (weatherLookup[firstTwoChar]) {
    weatherClass = weatherLookup[firstTwoChar];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }

  return weatherClass;
};

const setBackgroundImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  // remove img if it does not match the weather class determined in #getWeatherClass
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, location) => {
  const locationName = location.getName();
  const unit = location.getUnit();
  const tempUnit = unit === "imperial" ? "Fahrenheit" : "Celsius";

  return `${weatherJson.current.weather[0].description} and ${Math.round(
    Number(weatherJson.current.temp)
  )}°${tempUnit} in ${locationName}`;
};

const setFocusOnSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherJson, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";

  const icon = createMainImgDiv(weatherJson.current.weather[0].icon, weatherJson.current.weather[0].description);

  const temp = createElement("div", "temp", `${Math.round(Number(weatherJson.current.temp))}°`, tempUnit);

  const properDescription = toProperCase(weatherJson.current.weather[0].description);
  const description = createElement("div", "desc", properDescription);

  const feelsLIke = createElement("div", "feels", `Feels like ${Math.round(Number(weatherJson.current.feels_like))}°`);

  const maxTemp = createElement("div", "maxtemp", `High ${Math.round(Number(weatherJson.daily[0].temp.max))}°`);

  const minTemp = createElement("div", "mintemp", `Low ${Math.round(Number(weatherJson.daily[0].temp.min))}°`);

  const humidity = createElement("div", "humidity", `Humidity ${weatherJson.current.humidity}%`);

  const wind = createElement("div", "wind", `Wind ${Math.round(Number(weatherJson.current.wind_speed))} ${windUnit}`);

  return [icon, temp, description, feelsLIke, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElement("div", "icon");
  iconDiv.id = "icon";

  const faIcon = translateIconToFontAwesome(icon);
  faIcon.araiHidden = true;
  faIcon.title = altText;

  iconDiv.appendChild(faIcon);

  return iconDiv;
};

const createElement = (elementType, divClassName, divText, unit) => {
  const div = document.createElement(elementType);

  div.className = divClassName;

  if (divText) {
    div.textContent = divText;
  }

  if (divClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }

  return div;
};

const translateIconToFontAwesome = (icon) => {
  const i = document.createElement("i");
  const firstTwoChar = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwoChar) {
    case "01":
      if (lastChar === "d") {
        i.classList.add("far", "fa-sun");
      } else {
        i.classList.add("far", "fa-moon");
      }
      break;
    case "02":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun");
      } else {
        i.classList.add("fas", "fa-cloud-moon");
      }
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;
    case "13":
      i.classList.add("far", "fa-snowflake");
      break;
    case "50":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("far", "fa-question-circle");
  }

  return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
  const currentConditionsContainer = document.getElementById("currentForecast__conditions");
  currentConditionsArray.forEach((cc) => {
    currentConditionsContainer.appendChild(cc);
  });
};

const displaySixDayForecast = (weatherJson) => {
  for (let i = 1; i <= 6; i++) {
    const dailyForecastArray = createDailyForecastDivs(weatherJson.daily[i]);
    displayDailyForecast(dailyForecastArray);
  }
};

const createDailyForecastDivs = (dayWeather) => {
  const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
  const dayAbbreviation = createElement("p", "dayAbbreviation", dayAbbreviationText);

  const dayIcon = createDailyForecastIcon(dayWeather.weather[0].icon, dayWeather.weather[0].description);
  const dayHigh = createElement("p", "dayHigh", `${Math.round(Number(dayWeather.temp.max))}°`);
  const dayLow = createElement("p", "dayLow", `${Math.round(Number(dayWeather.temp.min))}°`);

  return [dayAbbreviation, dayIcon, dayHigh, dayLow];
};

const getDayAbbreviation = (data) => {
  const date = new Date(data * 1000);
  const utcString = date.toUTCString();
  return utcString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
  const img = document.createElement("img");
  if (window.innerWidth < 768 || window.innerHeight < 1025) {
    img.src = `https://openweathermap.org/img/wn/${icon}.png`;
  } else {
    img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
  img.alt = altText;

  return img;
};

const displayDailyForecast = (dailyForecastArray) => {
  const dayDiv = createElement("div", "forecastDay");
  dailyForecastArray.forEach((e) => {
    dayDiv.appendChild(e);
  });

  const dailyForecastContainer = document.getElementById("dailyForecast__contents");
  dailyForecastContainer.appendChild(dayDiv);
};
