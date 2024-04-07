# ClimaCast-server

ClimaCast-server is a Node.js server application for the ClimaCast weather app.

## Setup Instructions

Follow these steps to run the application:

### 1. Configure MongoDB

Make sure you have MongoDB installed and running on your system.
refer [Mongo in ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

### 2. Set Values in `config/config.env`

Ensure the necessary environment variables are set in the `config/config.env` file.
#### Set Email of user
#### Set Email Password

Configure the email settings by providing your email address and generating an app password for Gmail.

To generate an app password for Gmail, follow these steps:
1. Go to your Google Account settings.
2. Select "Security" in the left navigation menu.
3. Under "Signing in to Google," select "App passwords."
4. Sign in if prompted.
5. Select "Mail" and your device.
6. Select "Generate."

For more details, refer to the [Google support documentation](https://support.google.com/accounts/answer/185833?hl=en).
#### Set Email From
#### Set Email Time in Cron Format

Set the email sending time in cron format in the `EMAIL_TIME` environment variable in the `config/config.env` file. 

>By default, emails are scheduled to be sent every day at 10:00 AM, except Sundays.
#### Set API KEY for Open weather
### 2. Install Dependencies

Install the required dependencies by running:

```bash
npm install

```

### 3. Clone the frontend from `https://github.com/bisminshamh/ClimaCast-ui.git`
### 2. Start the Server

Start the server by running:

```bash
npm run build
npm start

```
The server should now be running, and you can access the ClimaCast app through the provided endpoints.

## File structure
```
.
├── config
│   ├── config.env
│   └── db.ts
├── controllers
│   ├── auth.ts
│   └── weather.ts
├── LICENSE
├── models
│   └── User.ts
├── package.json
├── package-lock.json
├── README.md
├── resolvers
│   └── index.ts
├── schema
│   └── index.ts
├── server.ts
├── tsconfig.json
└── utils
    └── weatherData.ts
```