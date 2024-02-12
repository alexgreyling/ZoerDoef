function createWeatherCard(weatherData) {
    return {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.3",
      "body": [
        {
          "type": "TextBlock",
          "text": "Weather Forecast",
          "weight": "Bolder",
          "size": "Medium"
        },
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "items": [
                {
                  "type": "Image",
                  "url": weatherData.iconUrl,
                  "size": "Small",
                  "style": "Person"
                }
              ],
              "width": "auto"
            },
            {
              "type": "Column",
              "items": [
                {
                  "type": "TextBlock",
                  "text": `${weatherData.temperature}°C`,
                  "weight": "Bolder",
                  "size": "Large"
                },
                {
                  "type": "TextBlock",
                  "text": weatherData.condition,
                  "isSubtle": true,
                  "spacing": "None"
                }
              ],
              "width": "stretch"
            }
          ]
        },
        {
          "type": "TextBlock",
          "text": "Have a great day!",
          "isSubtle": true,
          "wrap": true,
          "separator": true
        }
      ]
    };
  }
  
  module.exports = {
    createWeatherCard
  };
  