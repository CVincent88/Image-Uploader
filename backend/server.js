import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import fs from "fs";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// File upload endpoint using formidable to parse incoming form data
app.post("/api/upload", (req, res) => {
  const form = formidable();

  // Parse the incoming request containing the form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).send("Form parse error");
    }

    // Get uploaded files from the form data
    let uploadedFiles = files["file"];
    if (!uploadedFiles) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Ensure uploadedFiles is always an array
    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    const results = [];

    // Iterate over each uploaded file and upload to S3
    try {
      for (const file of uploadedFiles) {
        if (!file.filepath || !file.originalFilename || !file.mimetype) {
          return res.status(400).json({ error: "Invalid file data", file });
        }

        const fileStream = fs.createReadStream(file.filepath);
        const fileName = `${Date.now()}-${file.originalFilename}`;

        const uploadParams = {
          Bucket: process.env.S3_BUCKET,
          Key: fileName,
          Body: fileStream,
          ContentType: file.mimetype,
        };

        const uploadResponse = await s3.send(new PutObjectCommand(uploadParams));
        results.push({ fileName, uploadResponse });
      }

      res.status(200).json({ uploaded: results, success: true });

    } catch (e) {
      console.error("Upload failed:", e);
      res.status(500).json({ error: e.message, success: false });
    }

  });
});

// Create S3 client for AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Start the HTTP server
http.createServer(app).listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
