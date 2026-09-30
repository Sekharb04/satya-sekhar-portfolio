# Satya Sekhar | Portfolio

A personal portfolio presenting my work in artificial intelligence, machine learning, data analytics and web development. It includes project links, experience, profile information, a downloadable resume, and a contact form.

## Featured Projects

- [Student Complaint Management System](https://github.com/Sekharb04/scms-project)
- [Text Summarizer](https://github.com/Sekharb04/Text-Summarizer)
- [IMDb Sentiment Analysis](https://github.com/Sekharb04/IMDB_Sentiment_Analysis)
- [DeepFake Detection](https://github.com/Sekharb04/DeepFake_Detection)
- [Homely hub Project](https://github.com/Sekharb04/WSA_Internship_Project)

## Built With

- HTML, CSS, and JavaScript for the portfolio interface
- Node.js and Express for local hosting and the contact API
- Nodemailer for sending contact form messages through SMTP

## Run Locally

Install dependencies and start the Express server:

```sh
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000). You can also open `index.html` directly for a visual preview, but sending contact form messages requires the server and SMTP configuration below.

## Configure Contact Form Email

Create a `.env` file in the project root with your SMTP settings:

```env
SMTP_USER=your-sending-email@example.com
SMTP_PASS=your-smtp-password
SMTP_TO=your-inbox@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

`SMTP_USER`, `SMTP_PASS`, and `SMTP_TO` are required. The host and port default to Gmail SMTP on port 587. For Gmail, use an app password where required. Keep `.env` private; it is excluded from Git.

The contact form currently sends to `http://127.0.0.1:3000/api/contact`. Update the frontend endpoint and the server's allowed CORS origins before deploying the form to a different host.

## Project Structure

- `index.html` — page structure and portfolio content
- `styles.css` — layout, components, and responsive styles
- `theme.css` — dark theme styles, loaded by the client script
- `script.js` — interactions, including reveal effects, card tilt, theme switching, and contact submission
- `server.js` — Express static server and `/api/contact` endpoint
- `assets/` — resume and certificate assets
