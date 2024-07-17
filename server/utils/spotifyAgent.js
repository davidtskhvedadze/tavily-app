const config = require('../utils/config')
const { ChatOpenAI } = require("@langchain/openai");
const { TavilySearchResults } = require("@langchain/community/tools/tavily_search");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");
const { HumanMessage } = require("@langchain/core/messages");

const llm = new ChatOpenAI({
  apiKey: config.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

const tavily = new TavilySearchResults({
  maxResults: 3,
});

const langgraphAgent = createReactAgent({
  llm: llm,
  tools: [tavily],
});


const GENERATION_PROMPT = `You are an expert music curator. Generate a playlist based on the user's preferences and limit the amount to the size:
- Type: {type}
- Size: {size}
- Names: {names}

The resulting playlist should be a JSON object with an appropriate playlist name (make the name appropriate to the theme of the songs) and an array of songs. Each song should have the following attributes:
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
async function createSpotifyPlaylist(userPreferences) {
  const formattedPrompt = GENERATION_PROMPT.replace('{type}', userPreferences.type)
    .replace('{size}', userPreferences.size)
    .replace('{names}', userPreferences.names.join(', '));

  const agentAnswerStream = await langgraphAgent.stream({
    messages: [new HumanMessage({ content: formattedPrompt })],
  });


  let playlist = { name: "", songs: [] };
  for await (const chunk of agentAnswerStream) {
  const chunkPlaylist = extractPlaylistInfo(chunk);
  if (chunkPlaylist.name) playlist.name = chunkPlaylist.name; 
  playlist.songs = playlist.songs.concat(chunkPlaylist.songs);
}
  return playlist ;
}

module.exports = { createSpotifyPlaylist };