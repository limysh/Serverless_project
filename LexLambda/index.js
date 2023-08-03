const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./csci5410-project-serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const validateTeamName = async (slots) => {
  if (!slots?.TeamName) {
    console.log(
      "🚀 ~ file: index.js:23 ~ validateTeamName ~ !slots?.TeamName:",
      !slots?.TeamName
    );

    return {
      isValid: false,
      invalidSlot: "TeamName",
    };
  }

  const TeamName = toTitleCase(slots.TeamName.value.originalValue);
  console.log(
    "🚀 ~ file: index.js:32 ~ validateTeamName ~ TeamName:",
    TeamName
  );

  try {
    const teamRef = db.collection("teams");
    console.log(
      "🚀 ~ file: index.js:35 ~ validateTeamName ~ teamRef:",
      teamRef
    );
    const snapshot = await teamRef.where("teamname", "==", TeamName).get();
    console.log(
      "🚀 ~ file: index.js:37 ~ validateTeamName ~ snapshot:",
      snapshot
    );

    if (snapshot.empty) {
      console.log(
        "🚀 ~ file: index.js:35 ~ validateTeamName ~ snapshot.empty:",
        snapshot.empty
      );

      return {
        isValid: false,
        invalidSlot: "TeamName",
        message:
          "A team with this name was not found, please choose a valid team name",
      };
    } else {
      return { isValid: true };
    }
  } catch (error) {
    console.log("Error validating team name ", error);
  }
};

const handler = async (event, context) => {
  console.log(event);
  console.log("slots are", event.sessionState.intent.slots);

  let response;

  const bot = event.bot.name;
  const slots = event.sessionState.intent.slots;
  const intent = event.sessionState.intent.name;

  if (event.invocationSource == "DialogCodeHook") {
    const teamValidationResult = await validateTeamName(slots);
    console.log(
      "🚀 ~ file: index.js:59 ~ handler ~ teamValidationResult:",
      teamValidationResult
    );
    if (!teamValidationResult.isValid) {
      console.log(
        "🚀 ~ file: index.js:83 ~ handler ~ !teamValidationResult.isValid:",
        !teamValidationResult.isValid
      );
      if (teamValidationResult?.message) {
        console.log(
          "🚀 ~ file: index.js:85 ~ handler ~ teamValidationResult?.message:",
          teamValidationResult?.message
        );
        response = {
          sessionState: {
            dialogAction: {
              slotToElicit: teamValidationResult.invalidSlot,
              type: "ElicitSlot",
            },
            intent: {
              name: intent,
              slots: slots,
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: teamValidationResult.message,
            },
          ],
        };
      } else {
        response = {
          sessionState: {
            dialogAction: {
              slotToElicit: teamValidationResult.invalidSlot,
              type: "ElicitSlot",
            },
            intent: {
              name: intent,
              slots: slots,
            },
          },
        };
      }
    } else {
      response = {
        sessionState: {
          dialogAction: {
            type: "Delegate",
          },
          intent: {
            name: intent,
            slots: slots,
          },
        },
      };
    }
  }

  if (event.invocationSource == "FulfillmentCodeHook") {
    response = {
      sessionState: {
        dialogAction: {
          type: "Close",
        },
        intent: {
          name: intent,
          slots: slots,
          state: "Fulfilled",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: "Score is 40",
        },
      ],
    };
  }

  console.log("🚀 ~ file: index.js:168 ~ handler ~ response:", response);
  return response;

  // const { teamName } = event.pathParameters;

  // Query Firestore to check if team name exists
};

module.exports.handler = handler;

// export const handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify("Hello from Lambda!"),
//   };
//   return response;
// };

// export const handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify('Hello from Lambda!'),
//   };
//   return response;
// };
