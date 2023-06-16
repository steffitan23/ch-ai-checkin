const mongoose = require("mongoose");
require("dotenv").config();
// Assuming you have already connected to the MongoDB database and have defined the appropriate model
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

const userSchema = new mongoose.Schema({
  profile: {
    name: String,
    study: String,
    school: String,
    gender: String,
    graduationYear: String,
  },
  confirmation: Object,
  status: Object,
  admin: Boolean,
  verified: Boolean,
  email: String,
  password: String,
  code: String,
  checkedIn: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema, "users");

User.find({ "status.confirmed": true }).then((documents) => {
  documents.forEach((document) => {
    var newCode = genCode();
    while (codes.includes(newCode)) {
      newCode = genCode();
    }
    codes.push(newCode);
    User.findByIdAndUpdate(document._id, { code: newCode })
      .then((person) => {
        console.log("success");
      })
      .catch((error) => {
        console.error("Error checking in:", error);
      });
  });
});

codes = [];

function genCode() {
  var result = "";
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < 3; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return result;
}
