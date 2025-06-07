# Image Uploader

A full-stack image uploader application built with React Native (Expo) for the frontend and Node.js/Express for the backend. Images selected on the mobile app are uploaded to an AWS S3 bucket via a REST API.

---

## Features

- 📱 **React Native (Expo) Frontend**
  - Select multiple images from the device gallery
  - Preview selected images in a responsive grid
  - Upload images to the backend server

- 🖥️ **Node.js/Express Backend**
  - Receives image uploads via a REST API
  - Handles multipart form data using `formidable`
  - Uploads images to AWS S3

---

## Project Structure
Image-Uploader/ 
  ├── ImageUploaderExpo/ # React Native (Expo) frontend 
  │ ├── app/ 
  │ │ └── (tabs)/index.tsx # Main screen with image grid and upload 
  │ ├── components/ 
  │ │ ├── Button.tsx 
  │ │ └── ImageViewer.tsx # Single image display component 
  │ └── assets/ 
  │   └── images/ 
  │     └── background-image.png 
  ├── backend/ # Node.js/Express backend 
  │ └── server.js # API server for uploads 
  ├── .gitignore 
  └── README.md # (You are here)


---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- AWS S3 bucket (or compatible storage, e.g., LocalStack for testing)

### 1. Backend Setup

1. **Install dependencies:**
  ```sh
  cd backend
  npm install


2. **Configure environment variables:**
Create a .env file in the backend/ directory:

AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
S3_BUCKET=your-bucket-name
PORT=3000

3. **Start the backend server:**
  npm start


### 1. Frontend Setup

1. **Install dependencies:**
  cd ImageUploaderExpo
  npm install

2. **Replace IP Address:**
  In ImageUploaderExpo/app/(tabs)/index.tsx -> add your ip address as Expo wil not work with localhost

3. **Start the Expo app:**
  expo start


