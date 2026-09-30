require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const normalizeSmtpValue = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, "").trim() : value;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://localhost:8000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:8000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const validateRequired = (value, field) => {
  if (!value || !String(value).trim()) {
    throw new Error(`${field} is required.`);
  }
};

app.post("/api/contact", async (req, res) => {
  try {
    const { name, occupation, message } = req.body || {};

    validateRequired(name, "Name");
    validateRequired(occupation, "Occupation");
    validateRequired(message, "Message");

    const smtpUser = normalizeSmtpValue(process.env.SMTP_USER);
    const smtpPass = normalizeSmtpValue(process.env.SMTP_PASS);
    const smtpTo = normalizeSmtpValue(process.env.SMTP_TO);

    validateRequired(smtpUser, "SMTP_USER");
    validateRequired(smtpPass, "SMTP_PASS");
    validateRequired(smtpTo, "SMTP_TO");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      requireTLS: true,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpUser,
      to: smtpTo,
      replyTo: smtpUser,
      subject: `Portfolio inquiry from ${name}`,
      text: `Name: ${name}\nOccupation: ${occupation}\n\nMessage:\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Occupation:</strong> ${occupation}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("SMTP send failed:", error);

    res.status(500).json({
      success: false,
      message:
        "Message delivery failed. Check SMTP credentials and configuration.",
      error: error.message,
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio contact server running at http://localhost:${PORT}`);
});
