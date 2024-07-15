const config = require('../utils/config');
const { ChatOpenAI } = require("@langchain/openai");
const { TavilySearchResults } = require("@langchain/community/tools/tavily_search");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");
const { HumanMessage } = require("@langchain/core/messages");

// Initialize OpenAI LLM
const llm = new ChatOpenAI({
  apiKey: config.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

// Initialize Tavily
const tavily = new TavilySearchResults({
  maxResults: 3,
});

// Create a LangGraph agent
const langgraphAgent = createReactAgent({
  llm: llm,
  tools: [tavily],
});

// Define a function to process chunks from the agent
function processChunks(chunk) {
  let playlist = [];
  if ("agent" in chunk) {
    for (const message of chunk.agent.messages) {
      if (message.content) {
        const jsonStartIndex = message.content.indexOf('{');
        const jsonEndIndex = message.content.lastIndexOf('}');
        
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
          const jsonString = message.content.slice(jsonStartIndex, jsonEndIndex + 1);
          try {
            const responseJson = JSON.parse(jsonString);
            if (responseJson.songs) {
              playlist = responseJson.songs;
            }
          } catch (error) {
            console.log(`Failed to parse JSON: ${error.message}`);
          }
        } else {
          console.log(`No JSON found in message: ${message.content}`);
        }
      }
    }
  }
  return playlist;
}

// Define the function to create a playlist based on user preferences
async function createPlaylist(userPreferences) {
  const {
    size,
    genre,
    timePeriod,
    moodEmotion,
    activityContext,
    songPopularity,
    tempo,
    explicitContent,
    language,
    diversity,
  } = userPreferences;

  const userQuestion = `
    Create a playlist with the following preferences:
    - Genre: ${genre}
    - Time Period: ${timePeriod}
    - Mood/Emotion: ${moodEmotion}
    - Activity Context: ${activityContext}
    - Song Popularity: ${songPopularity}
    - Tempo: ${tempo}
    - Explicit Content: ${explicitContent}
    - Language: ${language}
    - Diversity: ${diversity}
    - Size: ${size}

    The resulting playlist should be a JSON object with an appropriate playlist name and an array of songs. Each song should have the following attributes:
    - Name
    - Artist
  `;

  const agentAnswer = await langgraphAgent.stream({
    messages: [new HumanMessage({ content: userQuestion })],
  });

  let playlist = [];
  for await (const chunk of agentAnswer) {
    playlist = [...playlist, ...processChunks(chunk)];
  }

  console.log("************ Playlist ************", playlist);

  // Convert the playlist array to a JSON object
  const playlistJson = {
    playlist_name: `My ${timePeriod} ${genre} ${activityContext} Playlist`,
    songs: playlist
  };

  return playlistJson;
}

module.exports = { createPlaylist };
