# Virtual Event Management

A Node.js application to create, register, follow, and manage virtual events.

## Tech Stack

- Node.js
- Express.js
- JWT Auth
- Nodemailer
- In-Memory Data Store
- Postman for Testing

## Features

- User Signup/Login
- JWT-based Authentication
- Create & Manage Events
- Register for Events
- Follow/Unfollow Events
- Email Notifications via Nodemailer

## Installation

In your terminal git clone the repo using-
git clone https://github.com/yourusername/virtual-event-management.git
cd virtual-event-management
npm install

create a .env file and add the following
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-secret-key

## Usage

node app.js or npm start
App runs on: http://localhost:3000

## API Endpoints

POST /signup Register a new user
POST /login Login and get token
POST /events Create event (Auth required)
GET /events Get all events (Auth required)
PUT /events/:id Update event (Auth required)
DELETE /events/:id Delete event (Auth required)
POST /events/:id/register Register for event (Auth required)
