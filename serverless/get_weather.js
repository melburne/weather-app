// ensure 'node-fetch' dependency is installed
const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  console.log(params);

  const { lat, lon, units } = params;
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
  console.log(url);

  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    console.log(weatherJson);
    
    return {
      statusCode: 200,
      body: JSON.stringify(weatherJson),
    };
  } catch (error) {
    return {
      statusCode: 422,
      body: error.stack,
    };
  }
};
