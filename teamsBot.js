const { TeamsActivityHandler, CardFactory, TurnContext, MessageFactory } = require("botbuilder");
const { createWeatherCard, adaptiveCardActions } = require("./AdaptiveCardBot");
const { ActionTypes } = require('botframework-schema');

const apiURLOpenWeather = "https://open-weather13.p.rapidapi.com/city/Pretoria"

class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();

    const weatherData = {
      iconUrl: "https://unsplash.com/photos/a-person-swimming-in-the-ocean-near-a-cave-g6Me5mUQQIQ",
      temperature: "Very hot",
      condition: "Very Kak"
    }
    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");
      if(context.activity.text != null) {
        const removedMentionText = TurnContext.removeRecipientMention(context.activity);
        const txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
        CardFactory.adaptiveCard
        if (txt.toLocaleLowerCase() === "check weather") {
          const weatherCardJSON = createWeatherCard(weatherData);
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(weatherCardJSON)] });
        }
        if (txt === "action card"){
          const actionCardTemplate = adaptiveCardActions();
          const actionCard = CardFactory.adaptiveCard(actionCardTemplate)
          await context.sendActivity({ attachments: [actionCard]});
          await this.SendDataOnCardActions(context);
        }
      }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          await context.sendActivity(
            `Badoing Badoing! My name is ZOERDOEF`
          );
          break;
        }
      }
      await next();
    });
  }

  async SendDataOnCardActions(context) {
    if (context.activity.value != null) {
        console.log(context.activity.value)
        var reply = MessageFactory.text("");
        reply.text = `Data Submitted : ${context.activity.value.name}`;
        await context.sendActivity(MessageFactory.text(reply.text));
    }
  }
}


module.exports.TeamsBot = TeamsBot;
