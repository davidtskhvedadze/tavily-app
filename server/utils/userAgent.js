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


  const GENERATION_PROMPT = `You are an expert music curator. Generate a playlist based on the user's preferences and the initial plan:
- Genre: {genre}
- Time Period: {timePeriod}
- Mood/Emotion: {moodEmotion}
- Activity Context: {activityContext}
- Song Popularity: {songPopularity}
- Tempo: {tempo}
- Explicit Content: {explicitContent}
- Language: {language}
- Diversity: {diversity}
- Size: {size}

The resulting playlist should be a JSON object with an appropriate playlist name and an array of songs. Each song should have the following attributes:
- Name
- Artist
Please add no other writing in the response, only the JSON object.`;

// Define a function to process chunks from the agent
function extractPlaylistInfo(chunk) {
  let playlistInfo = {
    name: "",
    songs: []
  };

  if (chunk.agent && chunk.agent.messages && chunk.agent.messages.length > 0) {
    const message = chunk.agent.messages[0];
    if (message.lc_kwargs && message.lc_kwargs.content) {
      const contentObj = JSON.parse(message.lc_kwargs.content);

      playlistInfo.name = contentObj.playlist_name;

      playlistInfo.songs = contentObj.songs.map(song => ({
        name: song.name, // Adjusted to match the capitalized keys in the JSON
        artist: song.artist // Adjusted to match the capitalized keys in the JSON
      }));
    }
  }

  return playlistInfo;
}
// Define the main function
async function createPlaylist(userPreferences) {
  const formattedPrompt = GENERATION_PROMPT.replace('{genre}', userPreferences.genre)
    .replace('{timePeriod}', userPreferences.timePeriod)
    .replace('{moodEmotion}', userPreferences.moodEmotion)
    .replace('{activityContext}', userPreferences.activityContext)
    .replace('{songPopularity}', userPreferences.songPopularity)
    .replace('{tempo}', userPreferences.tempo)
    .replace('{explicitContent}', userPreferences.explicitContent)
    .replace('{language}', userPreferences.language)
    .replace('{diversity}', userPreferences.diversity)
    .replace('{size}', userPreferences.size);

  const agentAnswerStream = await langgraphAgent.stream({
    messages: [new HumanMessage({ content: formattedPrompt })],
  });


  let playlist = { name: "", songs: [] };
  for await (const chunk of agentAnswerStream) {
  const chunkPlaylist = extractPlaylistInfo(chunk);
  if (chunkPlaylist.name) playlist.name = chunkPlaylist.name; // Update playlist name if found
  playlist.songs = playlist.songs.concat(chunkPlaylist.songs); // Concatenate songs
}
  return playlist ;
}

module.exports = { createPlaylist };