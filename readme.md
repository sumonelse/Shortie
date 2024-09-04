# URL Shortener

A simple URL shortener application built with React for the frontend and Node.js with Express and MongoDB for the backend. This application allows users to shorten long URLs, retrieve the original URLs via the shortened links, and manage the URLs through a future dashboard.

## Features

-   Shorten long URLs with a unique short code.
-   Redirect users to the original URL when accessing a short link.
-   Validate URLs to ensure they are reachable.
-   Basic error handling for invalid URLs or missing short codes.
-   Future integration for user dashboards to manage URLs.

## Technologies Used

-   **Frontend:** React, Tailwind CSS, React Router
-   **Backend:** Node.js, Express.js, MongoDB, Mongoose
-   **Other:** nanoid for generating unique short codes, fetch API for making HTTP requests

## Prerequisites

Before you begin, ensure you have the following installed:

-   Node.js (v14.x or later)
-   MongoDB
-   npm or yarn
