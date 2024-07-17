<h1 align="center">
    TuneTailor
</h1>
<div align="center">
TuneTailor is a music playlist generator that leverages the power of Spotify's API, LangChain, and Tavily's unique algorithms to create personalized playlists for users.
</div>

## Live Application

Check out TuneTailor live at [https://tunetailor.onrender.com](https://tunetailor.onrender.com)! Experience personalized playlist generation in action and discover new music tailored just for you.

## Tech Stack
<div align="center">
    <img src="https://skillicons.dev/icons?i=typescript,react,mongodb,express" alt="Tech Stack">
</div>
This stack represents the core technologies behind TuneTailor, including its backend service built with Express and MongoDB for managing user data and playlist information, and the frontend application developed with React and TypeScript for a robust and type-safe user experience.

## Features

- Personalized playlist generation based on user's top tracks or artists from Spotify, powered by TuneTailor's unique algorithms, LangChain for advanced language model interactions, and Tavily for additional playlist customization.
- Integration with Spotify API for real-time data fetching, allowing TuneTailor to access a vast library of music for playlist creation.
- Secure user authentication through Spotify OAuth, ensuring a safe and secure way for users to log in and authorize TuneTailor to access their Spotify data.
- Dynamic playlist creation with options for filtering by top tracks or artists, duration, and size, offering users a highly customizable playlist generation experience.
- User-friendly interface with responsive design, making TuneTailor accessible on a wide range of devices.
- State management with React Hooks for a seamless user experience, ensuring that the UI is always in sync with the application's state.
- Form validation using Zod to ensure data integrity, helping to prevent errors and improve user input handling.

## Notes
- Playlists generated are based on the user's listening history and preferences.
- TuneTailor's innovative use of LangChain, Tavily, and its own algorithms sets it apart in the music playlist generation space, offering users a unique and personalized way to discover music.

## Installation

1. Clone the repository: `git clone https://github.com/yourusername/tunetailor-app.git`
2. Access the directory: `cd tunetailor-app`
3. Install the dependencies: `npm install`
4. Set up Spotify Developer credentials and add them to `.env` as `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_CALLBACK_URL`, `AUTH_URL`, `TOKEN_URL`,`API_BASE_URL`
5. Set up `OPENAI_API_KEY` and `TAVILY_API_KEY` and add them to `.env`
6. Start the application: `npm run dev`
7. Open [http://localhost:3000](http://localhost:3000) to view it in the browser
8. Follow the authentication flow to allow TuneTailor to access your Spotify data