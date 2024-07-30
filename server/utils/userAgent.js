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


  const GENERATION_PROMPT = `You are an expert music curator. If any field is blank, assume it encompasses any for that field. Generate a playlist based on the user's preferences and limit the amount to the size:
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

function extractPlaylistInfo(chunk) {
  let playlistInfo = {
    name: "",
    songs: []
  };

  if (chunk.agent && chunk.agent.messages && chunk.agent.messages.length > 0) {
    const message = chunk.agent.messages[0];
    console.log(message);
    if (message.lc_kwargs && message.lc_kwargs.content) {
      const jsonStrings = message.lc_kwargs.content.split('}\n{').map((str, index, arr) => {
        if (index > 0) str = '{' + str;
        if (index < arr.length - 1) str = str + '}';
        return str;
      });

      jsonStrings.forEach(jsonStr => {
        try {
          const contentObj = JSON.parse(jsonStr);
          if (!playlistInfo.name) playlistInfo.name = contentObj.playlist_name;
          playlistInfo.songs.push(...contentObj.songs.map(song => ({
            name: song.name || song.Name, 
            artist: song.artist || song.Artist
          })));
        } catch (e) {
          console.error("Error parsing JSON string:", e);
        }
      });
    }
  }

  return playlistInfo;
}

async function createPlaylist(userPreferences) {
  const MAX_RETRIES = 5;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
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
        if (chunkPlaylist.name) playlist.name = chunkPlaylist.name;
        playlist.songs = playlist.songs.concat(chunkPlaylist.songs);
      }
      return playlist;
    } catch (error) {
      console.error(`Error creating playlist (attempt ${attempts + 1}):`, error);
      attempts++;
      if (attempts >= MAX_RETRIES) {
        console.error("Max retries reached. Returning default playlist.");
        return { name: "Default Playlist", songs: [] };
      }
    }
  }
}

module.exports = { createPlaylist };