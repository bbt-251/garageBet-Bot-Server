# 🏎️ GarageBet Telegram Bot Server

A robust Node.js and TypeScript-based Telegram bot server designed to streamline user authentication and provides seamless access to the **GarageBet** platform.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 🚀 Overview

The GarageBet Telegram Bot serves as the bridge between Telegram and the GarageBet web application. It handles user identity verification via phone numbers and links Telegram identities to Firebase-backed user accounts, enabling a secure and frictionless entry point into the app.

## ✨ Features

- **🛡️ Secure Phone Verification**: Uses Telegram's native contact sharing to securely verify user phone numbers.
- **🔗 Cross-Environment Account Linking**: Automatically searches for and links accounts across multiple Firebase project environments (Dev, Int, Prod, etc.).
- **📱 Integrated Web App Access**: Provides a direct, one-tap button to launch the GarageBet Web App within Telegram's integrated browser.
- **🔄 Fault-Tolerant Operations**: Built-in retry logic with exponential backoff for database operations to ensure reliability.
- **🏥 Health Monitoring**: Dedicated health check endpoint for monitoring system status and Firebase connectivity.

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Bot Framework**: `node-telegram-bot-api`
- **Database**: Firebase Firestore (via Firebase Admin SDK)
- **Networking**: Express (for health checks and optional webhooks)

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- A Telegram Bot Token (obtained from [@BotFather](https://t.me/BotFather))
- Firebase Service Account credentials for your environments.

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Firebase Configurations (JSON stringified Service Account)
NEXT_PUBLIC_FIREBASE_ADMIN_GARAGEBET='{"type":"service_account", "project_id":"...", ...}'

# Server Configuration
PORT=3001
```

> [!NOTE]
> The server automatically scans for environment variables prefixed with `NEXT_PUBLIC_FIREBASE_ADMIN_` to initialize multiple Firebase database instances.

## 📦 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm run start
   ```

## 📂 Project Structure

```text
src/
├── bot.ts               # Core bot logic and command handlers
├── server.ts            # Express server for health checks
├── firebase-config.ts   # Multi-project Firebase initialization
├── models/              # TypeScript interfaces for data
│   └── user.ts          # User data model
├── services/            # Business logic layer
│   └── user-service.ts  # Database operations for user records
└── types/               # Telegram-specific type definitions
```

## 🔄 User Flow

1. **Greeting**: User sends `/start` to the bot.
2. **Identification**: Bot prompts the user to share their phone number via a "Share Contact" button.
3. **Verification**: Bot cleans and normalizes the phone number, then searches for a matching user across the configured Firebase projects.
4. **Linking**: If a match is found, the user's Telegram Chat ID is saved to their profile.
5. **Access**: The bot provides a "Open GarageBet App" button that launches the web app.

---

## 🛡️ Security

- **Restricted Access**: Users must share their own contact information; manual phone number input is not accepted to prevent spoofing.
- **Data Privacy**: Only the necessary fields (UID, Phone, Chat ID) are utilized for verification.

## 🤝 Support

For technical assistance or inquiries, please contact the **Black Bridge Technologies** development team.

---
© 2026 Black Bridge Technologies. All rights reserved.