const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const nodemailer = require("nodemailer");

const express = require("express");
const cors = require("cors");

const app = express();

// Whitelist localhost:3001
const whitelist = [
  "http://localhost:3000",
  "http://localhost:3000/",
  "http://localhost:3001",
  "localhost:3000",
];
// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log(origin);
//     if (whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// //setting up connection to firebase
// const serviceAccount = require("./csci5410-assignment2-serviceAccountKey.json");

// initializeApp({
//   credential: cert(serviceAccount),
// });

// const db = getFirestore();

// Enable CORS with the configured options

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
console.log(
  "🚀 ~ file: app.js:48 ~ process.env.OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY
);

app.get("/generate_team_name", async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Suggest a team name",
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});

const serviceAccount = require("./csci5410-project-serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.post("/create_team", async (req, res) => {
  try {
    const { userId, username } = req.body;
    const teamsRef = db.collection("teams");
    const teamMembersRef = db.collection("team_members");

    let teamname;
    const generateTeamNameResult = await fetch(
      "https://us-central1-csci-5410-assignment2-391801.cloudfunctions.net/team-management",
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    teamname = await generateTeamNameResult.json();

    // Remove leading and trailing whitespace using regex
    const trimmedTeamname = teamname?.result?.replace(/^\s+|\s+$/g, "");
    console.log("teamname", trimmedTeamname);

    await teamsRef.doc().set({
      teamname: trimmedTeamname,
      teamMembers: [userId],
    });

    await teamMembersRef.doc().set({
      teamname: trimmedTeamname,
      userId,
      username,
      role: "admin",
    });

    res.status(201).json({
      message: `Team successfully created! Your teamname is ${trimmedTeamname} and you are an admin.`,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to create team ", e });
  }
});

app.get("/get_user_team", async (req, res) => {
  const teamsRef = db.collection("teams");
  const userId = parseInt(req.query.id);

  try {
    const querySnapshot = await teamsRef
      .where("teamMembers", "array-contains", userId)
      .get();

    const teamsWithUser = querySnapshot.docs.map((doc) => doc.data());
    console.log("teamsWithUser", teamsWithUser);
    // Check if the query returned any documents
    if (querySnapshot.empty) {
      res.status(404).json({ message: "User is not a part of any team!" });
      return;
    }

    const teamDocument = querySnapshot.docs[0].data();

    res.status(200).json({
      message: `User team successfully retrieved`,
      team: teamDocument,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to get users team ", e });
  }
});

app.post("/remove_from_team", async (req, res) => {
  const teamsRef = db.collection("teams");
  const teamMembersRef = db.collection("team_members");

  const { userId } = req.body;

  try {
    const teamSnapshot = await teamsRef
      .where("teamMembers", "array-contains", userId)
      .get();

    //we need remove the record from team_members as well
    const teamMembersSnapshot = await teamMembersRef
      .where("userId", "==", userId)
      .get();

    teamMembersDocument = teamMembersSnapshot.docs[0];

    await teamMembersRef.doc(teamMembersDocument.id).delete();

    const teamsWithUser = teamSnapshot.docs.map((doc) => doc.data());
    console.log("teamsWithUser", teamsWithUser);
    // Check if the query returned any documents
    if (teamSnapshot.empty) {
      res.status(404).json({ message: "User is not a part of any team!" });
      return;
    }
    const teamDocument = teamSnapshot.docs[0];

    const teamData = teamDocument.data();

    console.log("teamData.teamMembers", teamData.teamMembers);

    currentTeamMembers = teamData?.teamMembers;

    if (currentTeamMembers?.length === 1) {
      await teamsRef.doc(teamDocument.id).delete();
      return res.status(200).json({
        message: `User succesfully removed from team, team deleted since that was the last member`,
      });
    }

    const newTeamMembers = teamData?.teamMembers?.filter((id) => id !== userId);

    await teamsRef.doc(teamDocument.id).update({ teamMembers: newTeamMembers });

    return res.status(200).json({
      message: `User succesfully removed from team!`,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to remove user from team ", e });
  }
});

app.post("/add_to_team", async (req, res) => {
  const teamsRef = db.collection("teams");
  const teamMembersRef = db.collection("team_members");

  const { userId, username, teamId } = req.body;

  try {
    const teamDocument = teamsRef.doc(teamId);
    const teamDocumentSnapshot = await teamDocument.get();
    const teamData = teamDocumentSnapshot.data();
    console.log("🚀 ~ file: app.js:243 ~ app.post ~ teamData:", teamData);
    let currentTeamMembers = teamData?.teamMembers;
    console.log(
      "🚀 ~ file: app.js:245 ~ app.post ~ currentTeamMembers:",
      currentTeamMembers
    );

    currentTeamMembers?.push(userId);

    await teamDocument.update({ teamMembers: currentTeamMembers });

    await teamMembersRef.doc().set({
      teamname: teamData.teamname,
      userId,
      username,
      role: "player",
    });

    return res.status(200).json({
      message: `User successfully added to team!`,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to add user to team", e });
  }
});

app.post("/promote_to_admin", async (req, res) => {
  const teamMembersRef = db.collection("team_members");

  const { userId } = req.body;

  try {
    await teamMembersRef.where("userId", "==", userId).get();

    const teamMembersSnapshot = await teamMembersRef
      .where("userId", "==", userId)
      .get();

    teamMembersDocument = teamMembersSnapshot.docs[0];

    await teamMembersRef.doc(teamMembersDocument.id).update({
      role: "admin",
    });

    return res.status(200).json({
      message: `User successfully promoted to admin!`,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to add user to team", e });
  }
});

app.post("/sendEmail", async (req, res) => {
  // Replace these with your actual Gmail credentials
  const userEmail = "william.brace20@gmail.com";
  const userPassword = "cdafsmamdcyfppxi";

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: userPassword,
    },
  });

  // Email content
  const mailOptions = {
    from: userEmail,
    to: "william.brace@hotmail.com",
    subject: "Test Email from Cloud Function",
    text: "Hello, this is a test email sent from a Google Cloud Function!",
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email.");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Team management listening on ${port}`);
});
