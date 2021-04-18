// ensure 'node-fetch' dependency is installed
const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { text, units } = params;

  const numberRegex = /^\d+$/g;
  const flag = numberRegex.test(text) ? "zip" : "q";

  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${text}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encodedUrl = encodeURI(url);

  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();

    return {
      statusCode: 200,
      body: JSON.stringify(jsonData),
    };
  } catch (error) {
    return {
      statusCode: 422,
      body: error.stack,
    };
  }
};
