const WEATHER_API_KEY = "";

export const setLocationObject = (location, coordinates) => {
  const { lat, lon, name, unit } = coordinates;
  location.setLat(lat);
  location.setLon(lon);
  location.setName(name);
  if (unit) {
    location.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (location) => {
  const lat = location.getLat();
  const lon = location.getLon();
  const unit = location.getUnit();
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${unit}&appid=${WEATHER_API_KEY}`;
  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (error) {
    console.error(error);
  }
};

export const getCoordsFromApi = async (entryText, units) => {
  const numberRegex = /^\d+$/g;
  const flag = numberRegex.test(entryText) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encodedUrl = encodeURI(url);

  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error(error.stack);
  }
};

export const cleanText = (text) => {
  const removeMiddleSpacesRegex = / {2,}/g;
  // replace two or more spaces in the middle with one space
  const cleanText = text.replaceAll(removeMiddleSpacesRegex, " ").trim();
  return cleanText;
};
