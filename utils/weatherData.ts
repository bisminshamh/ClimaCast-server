import axios from "axios";

/**
 * Function to fetch weather data from OpenWeatherMap API based on city names
 * @param {string[]} cities - Array of city names
 * @returns {Promise<object[]>} - Array of weather data objects
 */
export const fetchWeatherDataByCityNames = async (cities) => {
  try {
    const weatherData = [];
    for (const city of cities) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`
      );
      weatherData.push(response.data);
    }
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null
  }
};
