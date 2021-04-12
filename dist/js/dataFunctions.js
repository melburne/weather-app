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
