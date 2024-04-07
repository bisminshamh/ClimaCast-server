// controller/weather.ts
import schedule from "node-schedule";
import { User } from "../models/User";
import nodemailer from "nodemailer";
import { fetchWeatherDataByCityNames } from "../utils/weatherData";


/**
 * Function to send weather update emails to users based on their follow locations
 */
const sendWeatherUpdateEmails = async () => {
  try {
    // Get all users from the database
    const users = await User.find();

    // Loop through each user
    for (const user of users) {
      // Check if today is Sunday (day 0)
      const today = new Date();
      if (today.getDay() !== 0) {
        // Fetch weather data for user's follow locations
        const weatherData = await fetchWeatherDataByCityNames(user.follow);

        // Format weather email body using the template
        const emailBody = formatWeatherEmailBody(weatherData);
        // Send email with weather update to user's email list
        // Implement your email sending logic here
        sendEmail(user.emails, user.subject, emailBody);
      }
    }
  } catch (error) {
    console.error("Error sending weather update emails:", error);
  }
};

/**
 * Function to schedule job to send weather update emails at 10:00 AM every day except Sundays
 */
export const scheduleWeatherUpdateEmails = () => {
  // Get the scheduled time from environment variables
  const scheduledTime = process.env.EMAIL_TIME; 
  // Schedule job to send weather update emails at the specified time
  const job = schedule.scheduleJob(scheduledTime, sendWeatherUpdateEmails);
};

/**
 * Function to send email using nodemailer
 * @param {string[]} to - Array of recipient email addresses
 * @param {string} subject - Email subject
 * @param {string} emailBody - Email body content
 */
const sendEmail = async (to, subject, emailBody) => {
  // Create transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to.join(","),
    subject: subject,
    text: emailBody,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

/**
 * Function to format weather email body based on weather data
 * @param {object[]} weatherData - Array of weather data objects
 * @returns {string} - Formatted email body
 */
const formatWeatherEmailBody = (weatherData) => {
  let emailBody = "";

  // Loop through each weather data object
  weatherData.forEach((data) => {
    const {
      name,
      main: { temp, feels_like, humidity },
      wind: { speed },
      clouds: { all },
    } = data;

    // Append weather information for each location to the email body
    emailBody += `
          Weather Update for ${name}:
          Temperature: ${temp}°C (Feels like: ${feels_like}°C)
          Humidity: ${humidity}%
          Wind Speed: ${speed} m/s
          Cloudiness: ${all}%
          ---------------------------------------------
        `;
  });

  return emailBody.trim(); // Remove leading/trailing whitespace
};
