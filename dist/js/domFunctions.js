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
}

const updateWeatherLocationHeader = (message) => {
  const h2 = document.getElementById("currentForecast__location");
  h2.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
}
