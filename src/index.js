/**
 * App ID for the skill
 */
var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * The AlexaSkill prototype and helper functions
 */
 var AlexaSkill = require('./AlexaSkill');

/**
 * BabysitterSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
 var BabysitterSkill = function () {
  AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
BabysitterSkill.prototype = Object.create(AlexaSkill.prototype);
BabysitterSkill.prototype.constructor = BabysitterSkill;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
 BabysitterSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
    + ", sessionId: " + session.sessionId);

    // Any session init logic would go here.
  };

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
 BabysitterSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  console.log("BabysitterSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

  initialGreeting(session, response);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
 BabysitterSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
    + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
  };

  BabysitterSkill.prototype.intentHandlers = {

    "AMAZON.YesIntent": function (intent, session, response) {
      yesResponse(session, response);
    },

    "AMAZON.NoIntent": function (intent, session, response) {
      noResponse(session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
      var speechText = "";

      switch (session.attributes.lastQuestion) {
        case "greeting":
          speechText = "Welcome to Babysitter.  " +
          "If you have already saved a child say yes, otherwise say no. You can also say exit. ";
          break;
        case "edit-delete-add-child":
          speechText = "You can edit or delete a child that you have already saved previously, or you can add a new child. You can also say exit. ";
          break;
          case "add-new-child":
        speechText = "You can say, yes to add a new child, or you can exit. ";
          break;
          default:
          speechText = "Welcome to Babysitter.  " +
          "To start adding a new child, say add new child, or you can exit. ";
      }

      var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      var repromptOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
        // For the repromptText, play the speechOutput again
        response.ask(speechOutput, repromptOutput);
      },

      "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
      },

      "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
      }
    };


function initialGreeting(session, response) {
      var speechText = "Welcome to Babysitter. Have you already saved a child?";

    //Reprompt speech will be triggered if the user doesn't respond.
    var repromptText = "Please say yes or no";

    session.attributes.lastQuestion = "greeting"

    var speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
      speech: repromptText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "Babysitter", speechText);
  }

// If user says that they already have saved a child
function yesResponse(session, response) {
  if(session.attributes.lastQuestion === "greeting") {
    var speechText = "Would you like to edit, delete, or add a new child?";

    //Reprompt speech will be triggered if the user doesn't respond.
    var repromptText = "Please say edit, delete, or new";

    session.attributes.lastQuestion = "edit-delete-add-child";
  }

    var speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
      speech: repromptText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "Babysitter", speechText);
  }

// If user says that they have not yet saved a child
function noResponse(session, response) {
  if(session.attributes.lastQuestion === "greeting") {
    var speechText = "Would you like to add a new child?";

    //Reprompt speech will be triggered if the user doesn't respond.
    var repromptText = "Please say yes or no";

    session.attributes.lastQuestion = "add-new-child";
  }

    var speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
      speech: repromptText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "Babysitter", speechText);
  }
/**
 * Responds to the user saying "Who's there".
 */
 function handleWhosThereIntent(session, response) {
  var speechText = "";
  var repromptText = "";

  if (session.attributes.stage) {
    if (session.attributes.stage === 1) {
            //Retrieve the joke's setup text.
            speechText = session.attributes.setup;

            //Advance the stage of the dialogue.
            session.attributes.stage = 2;

            repromptText = "You can ask, " + speechText + " who?";
          } else {
            session.attributes.stage = 1;
            speechText = "That's not how knock knock jokes work! <break time=\"0.3s\" /> "
            + "knock knock";

            repromptText = "You can ask, who's there."
          }
        } else {

        //If the session attributes are not found, the joke must restart. 
        speechText = "Sorry, I couldn't correctly retrieve the joke. "
        + "You can say, tell me a joke";

        repromptText = "You can say, tell me a joke";
      }

      var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
      };
      var repromptOutput = {
        speech: '<speak>' + repromptText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
      };
      response.ask(speechOutput, repromptOutput);
    }

/**
 * Delivers the punchline of the joke after the user responds to the setup.
 */
 function handleSetupNameWhoIntent(session, response) {
  var speechText = "",
  repromptText = "",
  speechOutput,
  repromptOutput,
  cardOutput;

  if (session.attributes.stage) {
    if (session.attributes.stage === 2) {
      speechText = session.attributes.speechPunchline;
      cardOutput = session.attributes.cardPunchline;
      speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
      };
            //If the joke completes successfully, this function uses a "tell" response.
            response.tellWithCard(speechOutput, "Wise Guy", cardOutput);
          } else {

            session.attributes.stage = 1;
            speechText = "That's not how knock knock jokes work! <break time=\"0.3s\" /> "
            + "Knock knock!";
            cardOutput = "That's not how knock knock jokes work! "
            + "Knock knock!";

            repromptText = "You can ask who's there.";

            speechOutput = {
              speech: speechText,
              type: AlexaSkill.speechOutputType.SSML
            };
            repromptOutput = {
              speech: repromptText,
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            //If the joke has to be restarted, this function uses an "ask" response.
            response.askWithCard(speechOutput, repromptOutput, "Wise Guy", cardOutput);
          }
        } else {
          speechText = "Sorry, I couldn't correctly retrieve the joke. "
          + "You can say, tell me a joke";

          repromptText = "You can say, tell me a joke";

          speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          response.askWithCard(speechOutput, repromptOutput, "Wise Guy", speechOutput);
        }
      }

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new BabysitterSkill();
    skill.execute(event, context);
  };
