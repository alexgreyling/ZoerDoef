const { checkLoadSheddingAt6AM } = require('./utils');
function createWeatherCard(weatherData, loadSheddingData) {
  // Helper function to format the date to match the API response format
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  // Determine if there's load shedding at 6 AM
  const isLoadSheddingAt6AM = checkLoadSheddingAt6AM(loadSheddingData);
  const loadSheddingText = isLoadSheddingAt6AM ? "Load shedding at 6 AM" : "No load shedding at 6 AM";

  // Build the Adaptive Card JSON
  return {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.3",
    "body": [
      {
        "type": "TextBlock",
        "text": "Weather and Load Shedding Update",
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
        "text": `Current Load Shedding Stage: ${loadSheddingData.details.currentStage}`,
        "spacing": "Medium",
        "separator": true
      },
      {
        "type": "TextBlock",
        "text": loadSheddingText,
        "weight": "Bolder",
        "color": isLoadSheddingAt6AM ? "Attention" : "Good",
        "spacing": "Small",
        "separator": true
      },
      {
        "type": "TextBlock",
        "text": loadSheddingData.comment,
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
  