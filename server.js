const express = require("express");
const mongoose = require("mongoose");

// Set up Express.js
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./"));
require("dotenv").config();

port = process.env.PORT || 80;

const { Readable } = require("stream");

MONGO_URL = process.env.MONGO_URL;
// Connect to MongoDB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define the Person schema
const userSchema = new mongoose.Schema({
  profile: {
    name: String,
    study: String,
    school: String,
    gender: String,
    graduationYear: String,
  },
  confirmation: Object,
  status: {
    checkedIn: { type: Boolean, default: false },
  },
  admin: Boolean,
  verified: Boolean,
  email: String,
  password: String,
  code: String,
  meal1: { type: Boolean, default: false },
  meal2: { type: Boolean, default: false },
  meal3: { type: Boolean, default: false },
});

// Create the Person model
const User = mongoose.model("User", userSchema, "users");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Define the routes
app.post("/search", (req, res) => {
  const searchTerm = req.body.searchTerm;
  const regex = new RegExp(searchTerm, "i");
  User.find({
    $and: [
      { $or: [{ "profile.name": regex }, { email: regex }, { code: regex }] },
      { "status.confirmed": true },
    ],
  })
    .then((results) => {
      res.json(results);
    })
    .catch((error) => {
      console.error("Error searching for people:", error);
      res
        .status(500)
        .json({ error: "An error occurred while searching for people." });
    });
});

app.post("/checkin", (req, res) => {
  const personId = req.body.personId;
  User.findByIdAndUpdate(personId, { "status.checkedIn": true })
    .then((person) => {
      res.json({ message: "Checked in successfully.", person });
    })
    .catch((error) => {
      console.error("Error checking in:", error);
      res.status(500).json({ error: "An error occurred while checking in." });
    });
});

app.post("/meal1", (req, res) => {
  const personId = req.body.personId;
  User.findByIdAndUpdate(personId, { meal1: true })
    .then((person) => {
      res.json({ message: "Mealed in successfully.", person });
    })
    .catch((error) => {
      console.error("Error mealing in:", error);
      res.status(500).json({ error: "An error occurred while mealing in." });
    });
});

app.post("/meal2", (req, res) => {
  const personId = req.body.personId;
  User.findByIdAndUpdate(personId, { meal2: true })
    .then((person) => {
      res.json({ message: "Mealed in successfully.", person });
    })
    .catch((error) => {
      console.error("Error mealing in:", error);
      res.status(500).json({ error: "An error occurred while mealing in." });
    });
});

app.post("/meal3", (req, res) => {
  const personId = req.body.personId;
  User.findByIdAndUpdate(personId, { meal3: true })
    .then((person) => {
      res.json({ message: "Mealed in successfully.", person });
    })
    .catch((error) => {
      console.error("Error mealing in:", error);
      res.status(500).json({ error: "An error occurred while mealing in." });
    });
});

app.post("/unmeal1", (req, res) => {
  const personId = req.body.personId;
  User.findByIdAndUpdate(personId, { meal1: false })
    .then((person) => {
      res.json({ message: "Undid meal-in successfully.", person });
    })
    .catch((error) => {
      console.error("Error undoing meal in:", error);
      res
        .status(500)
        .json({ error: "An error occurred while undoing meal in." });
    });
});

app.post("/unmeal2", (req, res) => {
  const personId = req.body.personId;
  User.findByIdAndUpdate(personId, { meal2: false })
    .then((person) => {
      res.json({ message: "Undid meal-in successfully.", person });
    })
    .catch((error) => {
      console.error("Error undoing meal in:", error);
      res
        .status(500)
        .json({ error: "An error occurred while undoing meal in." });
    });
});

app.post("/unmeal3", (req, res) => {
  const personId = req.body.personId;
  User.findByIdAndUpdate(personId, { meal3: false })
    .then((person) => {
      res.json({ message: "Undid meal-in successfully.", person });
    })
    .catch((error) => {
      console.error("Error undoing meal in:", error);
      res
        .status(500)
        .json({ error: "An error occurred while undoing meal in." });
    });
});

app.post("/uncheckin", (req, res) => {
  const personId = req.body.personId;
  User.findByIdAndUpdate(personId, { "status.checkedIn": false })
    .then((person) => {
      res.json({ message: "Undid check-in successfully.", person });
    })
    .catch((error) => {
      console.error("Error undoing checking in:", error);
      res
        .status(500)
        .json({ error: "An error occurred while undoing checking in." });
    });
});

app.get("/download-confirmed", (req, res) => {
  User.find({ "status.confirmed": true })
    .then((documents) => {
      if (documents.length === 0) {
        return res.status(404).send("No confirmed hackers found.");
      }

      // Map the document properties to the CSV fields
      const csvData = documents.map((document) => ({
        name: document.profile.name,
        email: document.email,
        code: document.code,
        gradYear: document.profile.graduationYear,
        study: document.profile.study,
        school: document.profile.school,
        gender: document.profile.gender,
        checkedIn: document.status.checkedIn,
        // Map more fields as needed
      }));
      // Create a writable stream to capture the CSV data
      const writableStream = new Readable({
        read() {
          this.push(
            `Name, Email, Checked In?, Code, Grad Year, Major, School, Gender\n`
          );
          csvData.forEach((data) => {
            this.push(
              `${data.name},${data.email},${data.checkedIn},${data.code},${
                data.gradYear
              },${data.study},${data.school.replace(",", "")},${data.gender}\n`
            );
            // Push more fields as needed
          });
          this.push(null);
        },
      });

      // Set the appropriate headers for file download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=confirmed_data.csv"
      );

      // Pipe the CSV data to the response
      writableStream.pipe(res);
    })
    .catch((error) => {
      console.error("Error fetching confirmed documents:", error);
      res.status(500).send("Internal server error");
    });
});

app.get("/download-checkedin", (req, res) => {
  User.find({ "status.checkedIn": true })
    .then((documents) => {
      if (documents.length === 0) {
        return res.status(404).send("No checked in hackers found.");
      }

      // Map the document properties to the CSV fields
      const csvData = documents.map((document) => ({
        name: document.profile.name,
        email: document.email,
        code: document.code,
        gradYear: document.profile.graduationYear,
        study: document.profile.study,
        school: document.profile.school,
        gender: document.profile.gender,
        // Map more fields as needed
      }));
      // Create a writable stream to capture the CSV data
      const writableStream = new Readable({
        read() {
          this.push(`Name, Email, Code, Grad Year, Major, School, Gender\n`);
          csvData.forEach((data) => {
            this.push(
              `${data.name},${data.email},${data.code},${data.gradYear},${
                data.study
              },${data.school.replace(",", "")},${data.gender}\n`
            );
            // Push more fields as needed
          });
          this.push(null);
        },
      });

      // Set the appropriate headers for file download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=checkedin_data.csv"
      );

      // Pipe the CSV data to the response
      writableStream.pipe(res);
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
      res.status(500).send("Internal server error");
    });
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port 3000");
});
