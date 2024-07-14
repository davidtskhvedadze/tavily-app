const config = require('../utils/config')
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
  const playlist = [];
  if ("agent" in chunk) {
    for (const message of chunk.agent.messages) {
      if (
        "tool_calls" in message.additional_kwargs != undefined &&
        Array.isArray(message.additional_kwargs.tool_calls)
      ) {
        const toolCalls = message.additional_kwargs.tool_calls;
        toolCalls.forEach((toolCall) => {
          const toolName = toolCall.function.name;
          if (toolName === "TavilySearchResults") {
            playlist.push(...toolCall.results);
          }
        });
      } else {
        const agentAnswer = message.content;
        console.log(`Agent: ${agentAnswer}`);
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
    Genre: ${genre}
    Time Period: ${timePeriod}
    Mood/Emotion: ${moodEmotion}
    Activity Context: ${activityContext}
    Song Popularity: ${songPopularity}
    Tempo: ${tempo}
    Explicit Content: ${explicitContent}
    Language: ${language}
    Diversity: ${diversity}
    Size: ${size}
  `;

  const agentAnswer = await langgraphAgent.stream({
    messages: [new HumanMessage({ content: userQuestion })],
  });

  let playlist = [];
  for await (const chunk of agentAnswer) {
    playlist = processChunks(chunk);
  }
  return playlist;
}

module.exports = { createPlaylist };
