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

const GENERATION_PROMPT = `As a skilled music curator, your task is to create a playlist that reflects the themes and styles of the provided song or artist names. Importantly, if the names provided are of specific songs, ensure the playlist does not contain these exact songs. Instead, find songs that are similar in style, theme, or vibe. Use the names in the 'names' array as your guide. The playlist should cater to the specified 'type' and contain a number of songs equal to 'size'. 

Details:
- Type: {type} (e.g., genre, mood)
- Size: {size} (the number of songs in the playlist)
- Names: {names} (song or artist names to inspire the playlist, without including these exact songs in the final playlist)

Output a JSON object with:
1. A playlist name that captures the essence of the songs.
2. An array of songs, where each song includes:
   - Name
   - Artist
   - Ensure the songs are similar to the provided names but do not include the exact songs from the 'names' array.

Please ensure the response contains only the JSON object, with no additional text.

Example:
If 'names' includes ["Coldplay - Yellow", "Imagine Dragons - Believer"], 'type' is "motivational", and 'size' is 5, the output should be a JSON object with a fitting playlist name and five songs that match the motivational theme inspired by the artists and songs mentioned, without including 'Yellow' or 'Believer' in the playlist.`;

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