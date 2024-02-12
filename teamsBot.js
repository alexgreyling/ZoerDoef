const {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
} = require("botbuilder");
const { createWeatherCard } = require("./AdaptiveCardBot");
const axios = require("axios");
const { checkLoadSheddingAt6AM } = require("./utils");

const weatherOptions = {
  method: "GET",
  url: "https://open-weather13.p.rapidapi.com/city/Pretoria",
  headers: {
    "X-RapidAPI-Key": "56cfa35d48msh64026514fc8e09ap1adc3djsn37827c4cd8ce",
    "X-RapidAPI-Host": "open-weather13.p.rapidapi.com",
  },
};

const loadsheddingOptions = {
  method: "GET",
  url: "https://mzansi-loadshedding-api.p.rapidapi.com/schedule/hatfield",
  headers: {
    "X-RapidAPI-Key": "56cfa35d48msh64026514fc8e09ap1adc3djsn37827c4cd8ce",
    "X-RapidAPI-Host": "mzansi-loadshedding-api.p.rapidapi.com",
  },
};

class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");
      const removedMentionText = TurnContext.removeRecipientMention(
        context.activity
      );
      const txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
      CardFactory.adaptiveCard;
      if (txt.toLocaleLowerCase() === "should i work") {
        const weatherData = await axios
          .request(weatherOptions)
          .then((response) => {
            return {
              iconUrl: `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`,
              temperature: Math.round(((response.data.main.temp - 32) * 5) / 9),
              condition: `${response.data.weather[0].description}`,
            };
          })
          .catch((error) => {
            console.error(error);
            return null;
          });

        const loadSheddingData = await axios
          .request(loadsheddingOptions)
          .then((response) => {
            const isLoadSheddingAt6AM = checkLoadSheddingAt6AM(response.data);
            console.log(isLoadSheddingAt6AM);
            let comment = "";
            if (weatherOptions.temperature < 18 && isLoadSheddingAt6AM) {
                comment = "❄️ It is way too cold to work today, and there will be crazy traffic 🚗.  \nDo you want me to call in sick for you?";
            } else {
                comment = "☀️ It looks like a great day to squash some bugs and drop some databases.  \nRemember to feed me when you get into the office 🌽";
            }
            return {
              schedule: response.data.schedule,
              details: response.data.details,
              comment: comment,
            };
          })
          .catch((error) => {
            console.error(error);
            return null;
          });

        if (weatherData && loadSheddingData) {
          const weatherCardJSON = createWeatherCard(
            weatherData,
            loadSheddingData
          );
          await context.sendActivity({
            attachments: [CardFactory.adaptiveCard(weatherCardJSON)],
          });
        } else {
          await await context.sendActivity("NOT WORK");
        }
      }
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          await context.sendActivity(`Badoing Badoing! My name is ZOERDOEF`);
          break;
        }
      }
      await next();
    });
  }
}

module.exports.TeamsBot = TeamsBot;
