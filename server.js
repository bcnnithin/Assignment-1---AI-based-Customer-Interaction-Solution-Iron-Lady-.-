const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/chat", (req, res) => {

  const msg = (req.body.message || "").toLowerCase();
  let reply = "";

  if (msg.includes("contact") || msg.includes("phone") || msg.includes("number")) {
    reply = "You can contact Iron Lady at +91 9876543210.";
  }
  else if (msg.includes("email")) {
    reply = "You can email Iron Lady at support@ironlady.com.";
  }
  else if (msg.includes("full stack")) {
    reply = "Full Stack covers HTML, CSS, React, Node and MongoDB.";
  }
  else if (msg.includes("ai")) {
    reply = "AI program includes Python, Machine Learning and real projects.";
  }
  else if (msg.includes("course")) {
    reply = "Iron Lady offers Full Stack, AI & ML, and Career programs.";
  }
  else if (msg.includes("fee")) {
    reply = "Fees depend on the program. Please contact support.";
  }
  else if (msg.includes("enroll")) {
    reply = "Enroll through online registration on the website.";
  }
  else {
    reply = "Hi! Ask me about courses, fees, enrollment, or contact details 😊";
  }

  res.json({ reply });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
