# 🧘 Japa Counter App – Electron + React + MongoDB

The **Japa Counter App** is a cross-platform desktop application designed for individuals practicing mantra meditation (Japa). Built using **Electron** and **React**, this app allows users to count repetitions of mantra rounds (typically 108 counts = 1 round), track time spent, and store daily progress securely.

## 🔧 Tech Stack

- ⚡ **Electron** – Cross-platform desktop application framework
- ⚛️ **React.js** – Frontend interface
- 🧩 **Express & Node.js** – Backend API server
- 🍃 **MongoDB** – Database for storing user data and round history
- 🔐 **JWT Authentication** – Secure user login and role-based access
- 💾 **LocalStorage Sync** – Offline round tracking and sync when online

## 💡 Features

- ✅ Simple Japa counting with **increment**, **decrement**, and **reset**
- ⏱️ **Track time** taken to complete each round
- 🔁 Automatically registers a **round after 108 counts**
- 🙋 **User Dashboard** – Track daily personal Japa stats
- 🧑‍💼 **Admin Dashboard** – View all users’ data with filters by day/week/month
- 🌗 **Dark/Light Mode** toggle
- 🔒 **Role-Based Access** – Separate views for users and admins
- 📴 **Offline Mode** – Count without internet and sync later
- 📤 **Export Japa history** to Excel with time and count
- ✅ **Download confirmation** after saving file via system prompt
- 🔔 **Reminder system** to prompt user to **submit past 7 days’ data** if missed
- 📦 Fully packaged as a **desktop app** (.exe/.app)

## 📁 Installation

```bash
# Clone the repo
git clone https://github.com/joydip62/japa-counter-app-client.git

# Install dependencies
cd japa-counter-app-client
npm install

# Build frontend
cd app
npm install
npm run build

# Start the Electron app
npm start
```

## 🛠 Build for Production

```bash
npm run dist
```
