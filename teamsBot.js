const {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
} = require("botbuilder");
const { createWeatherCard } = require("./AdaptiveCardBot");
const axios = require("axios");
const { checkLoadSheddingAt6AM } = require("./utils");
const graph = require('@microsoft/microsoft-graph-client');

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

const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6Img5VER5ZEI3ZGZFckNpNGNKZTI0V0x3dkYwbW1JVFRSU251VERXT0pZOUUiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyIsImtpZCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8wOTM3ZWMzZi1hMjNmLTRlNTAtODMyNC02OGE1ZWI5MjA2YzgvIiwiaWF0IjoxNzA3NzMzNTQ3LCJuYmYiOjE3MDc3MzM1NDcsImV4cCI6MTcwNzgyMDI0NywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQTBSTWZENnJwc1d0UFcyZGhpY2tLSWZId0lHWVlZbk90YW9hUHBhWDVLQ0xobVowUWlWaittQ2RpcHJ0T2pZNFI4a0JFRHo4cnhJeVhKWjhHYnc5bG14Ky9Lam82NDJ0dUh3eXEwOTZGMHEwPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiR3JleWxpbmciLCJnaXZlbl9uYW1lIjoiQWxleCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwNS4xODUuNTYuNTAiLCJuYW1lIjoiQWxleCBHcmV5bGluZyIsIm9pZCI6ImNlMWM5ZTljLWZhMTAtNDA2OC1hZTVlLTczZDI4ZDQzYTg4YSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMzQyREZFNUU2IiwicmgiOiIwLkFSQUFQLXczQ1QtaVVFNkRKR2lsNjVJR3lBTUFBQUFBQUFBQXdBQUFBQUFBQUFDWEFLYy4iLCJzY3AiOiJDaGFubmVsTWVzc2FnZS5TZW5kIENoYXQuUmVhZFdyaXRlIENoYXRNZXNzYWdlLlNlbmQgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiTXdiMURKWWJTZlkwek10ajVGZnFhVUNsUGxwaXFaZ2N2cjZPelNNeG52USIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBRiIsInRpZCI6IjA5MzdlYzNmLWEyM2YtNGU1MC04MzI0LTY4YTVlYjkyMDZjOCIsInVuaXF1ZV9uYW1lIjoiQWxleGdAYWdpbGVicmlkZ2UuY28uemEiLCJ1cG4iOiJBbGV4Z0BhZ2lsZWJyaWRnZS5jby56YSIsInV0aSI6IlBOMW9oYS1PS2tHMk55ZWxFUTA0QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6InlYRFhZc1pmdzVwNjBuUjY4TWRqNGhaRGZGdUdtUGNxa0ZIS3BPSGV6bWMifSwieG1zX3RjZHQiOjE0MTA0MzYyOTV9.PXwl8uLSI5tLY_4_9udPjOJI3u98TnnjeZKgV76vxCw3K0DH8oBJZh2G9UYYx-JK6xImECsecD9luSjNi_qkMwKUPGcTtuTx8V4QO1rQFGVBVuH9RNOAgB9uirS8lrWhmK9VvX-ATiGzDbSYMmBMA0YezuB5qJfusDGRGcfcq67DMugfltdqtaSzDw1IDNnBj8kBFtazwy_-WI2NBAcxcgchhSUI4SfQEo9dT3dQ-6xhbQ-v-aSan9OLb09dHT_XxtPA5o5oZgv9BMkUk8_8ucx-0K76IE_mvKBu3MYZ5o6xI-rYwoNOiy-fEhqgwuZYzLDoai0vCAirlR-osPHPUw"

class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");
      const removedMentionText = TurnContext.removeRecipientMention(
        context.activity
      );
      const txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
        let temperature = 0;
        let loadShedding = "";
      CardFactory.adaptiveCard;
      if (txt === "should I work") {
        const weatherData = await axios
          .request(weatherOptions)
          .then((response) => {
            temperature = Math.round(((response.data.main.temp - 32) * 5) / 9);
            return {
              iconUrl: `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`,
              temperature: temperature,
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
            loadShedding = response.data.details;
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

      if (txt === "call in sick") {
        const client = graph.Client.init({
          authProvider: (done) => {
            done(null, accessToken);
          }
        });
      
        const message = {
          body: {
            content: `Good morning. It is currently ${temperature}C, and ${loadShedding}. Therefore I will be taking a day's sick leave. Thank you.  \n Kind regards,  \nAlex Greyling`,
            contentType: "text"
          }
        };
      
        try {
          const res = await client
            .api('/teams/84309cd1-61e4-4cc8-ae1f-78666e53a22c/channels/19%3Aa70eb3851b894b409f0fa929e02a1ca1%40thread.tacv2/messages')
            .post(message);
          console.log(res);
          await context.sendActivity("I have successfully called in sick on your behalf, enjoy playing League of Legends.");
        } catch (err) {
          console.log(err);
          await context.sendActivity("Failed to send message to Teams channel");
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
