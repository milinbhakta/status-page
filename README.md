# Status Page

This Status Page application is a Node.js project that uses Express.js as the web server and Handlebars as the templating engine. It's designed to monitor the status of various websites and Docker containers.

## Project Structure

The project is structured as follows:

- `src/`: This directory contains the source code of the application.
  - `app.ts`: This is the main file that sets up the Express server and routes.
  - `routes/`: This directory contains the route handlers for the application.
    - `containers.ts`: This file handles requests related to Docker containers.
    - `websites.ts`: This file handles requests related to websites.
  - `middlewares/`: This directory contains middleware functions for the application.
    - `helmet.ts`: This file sets up the Helmet middleware for setting HTTP headers.
    - `cors.ts`: This file sets up the CORS middleware for handling Cross-Origin Resource Sharing.
  - `helpers/`: This directory contains helper functions for the application.
    - `handlebars.ts`: This file registers helper functions for Handlebars.
  - `utils/`: This directory contains utility functions for the application.
    - `docker.ts`: This file contains functions for interacting with Docker.
    - `utils.ts`: This file contains general utility functions.

## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file in the root directory and set the `WEBSITES` environment variable to a comma-separated list of websites to monitor.
4. Run `npm start` to start the server.

## Usage

- Visit `http://localhost:5500/containers` to see the status of your Docker containers.
- Visit `http://localhost:5500/websites` to see the status of the websites specified in the `WEBSITES` environment variable.

## Contributing

Please submit a pull request with your changes. Make sure to include tests and update the documentation as necessary.