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

  function adaptiveCardActions(){
    return {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
        {
            "type": "TextBlock",
            "text": "Adaptive Card Actions"
        }
    ],
    "actions": [
        {
            "type": "Action.OpenUrl",
            "title": "Action Open URL",
            "url": "https://adaptivecards.io"
        },
        {
            "type": "Action.ShowCard",
            "title": "Action Submit",
            "card": {
                "type": "AdaptiveCard",
                "version": "1.5",
                "body": [
                    {
                        "type": "Input.Text",
                        "id": "name",
                        "label": "Please enter your name:",
                        "isRequired": true,
                        "errorMessage": "Name is required"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Submit",
                        "id": "nameSubmit"
                    }
                ]
            }
        },
        {
            "type": "Action.ShowCard",
            "title": "Action ShowCard",
            "card": {
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "This card's action will show another card"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.ShowCard",
                        "title": "Action.ShowCard",
                        "card": {
                            "type": "AdaptiveCard",
                            "body": [
                                {
                                    "type": "TextBlock",
                                    "text": "**Welcome To New Card**"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "This is your new card inside another card"
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}};
  
module.exports = {
  createWeatherCard, 
  adaptiveCardActions
};
  