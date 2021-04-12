export const setLocationObject = (location, coordinates) => {
  const {lat, lon, name, unit} = coordinates;
  location.setLat(lat);
  location.setLon(lon);
  location.setName(name);
  if (unit) {
    location.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
}

export const cleanText = (text) => {
  const removeMiddleSpacesRegex = / {2,}/g;
  // replace two or more spaces in the middle with one space
  const cleanText = text.replaceAll(removeMiddleSpacesRegex, " ").trim();
  return cleanText;
}
