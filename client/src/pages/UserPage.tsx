import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { useParams } from 'react-router-dom';
import PlaylistModule from "../components/PlaylistModule";
import axios from "axios";

const formSchema = z.object({
  size: z.string().min(1,{ message: "Size is required" }),
  genre: z.string().optional(),
  timePeriod: z.string().optional(),
  moodEmotion: z.string().optional(),
  activityContext: z.string().optional(),
  songPopularity: z.string().optional(),
  tempo: z.string().optional(),
  explicitContent: z.string().optional(),
  language: z.string().optional(),
  diversity: z.string().optional()
});

type SongType = {
    _id: string,
    name: string,
    artist: string
}

type PlaylistType = {
    _id: string,
    name: string,
    songs: SongType[]
}

export default function UserPage() {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([
    {
      _id: "",
      name: "",
      songs: []
    }
  ]);
  const [userName, setuserName] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: "",
      genre: "",
      timePeriod: "",
      moodEmotion: "",
      activityContext: "",
      songPopularity: "",
      tempo: "",
      explicitContent: "",
      language: "",
      diversity: ""
    },
  });

  const { id } = useParams<{ id: string }>();

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    axios.post(`http://localhost:3000/api/playlist/${id}`, values)
      .then((response) => {
        console.log(response.data.playlist);
        setPlaylists([...playlists, response.data.playlist]);
        form.reset();
      })
      .catch(error => {
        console.error('Could not add playlist', error.response.data);
      });
  }

  const handleDelete = (playlistId: string) => {
    axios.delete(`http://localhost:3000/api/playlist/${id}/${playlistId}`)
      .then(() => {
        setPlaylists(prevPlaylists => prevPlaylists.filter(playlist => playlist._id !== playlistId));
      })
      .catch(error => {
        console.error('Could not delete playlist', error.response.data);
      });
  }

  useEffect(() => {
    axios.get(`http://localhost:3000/api/playlist/${id}`)
      .then(response => {
        setuserName(response.data.user.name);
        setPlaylists(response.data.playlists);
      })
      .catch(error => {
        console.error('Could not retrieve playlists', error.response.data);
      });
  }, [id]);

  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <Navbar name={userName}/>
      </div>
      <div className="bg-gray-50 min-h-screen flex flex-col mt-4 items-center py-12">
        <Form {...form} >
          <form onSubmit={form.handleSubmit(handleSubmit)} className=" flex flex-col w-full max-w-4xl p-6 shadow-md rounded-lg bg-white">
            <div className="flex flex-wrap justify-center gap-2">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Size</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full p-2 mt-1 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Size</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Genre</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-1 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Genre</option>
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Classical">Classical</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Country">Country</option>
                        <option value="Reggae">Reggae</option>
                        <option value="Blues">Blues</option>
                        <option value="R&B/Soul">R&B/Soul</option>
                        <option value="Indie Pop">Indie Pop</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timePeriod"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Time Period</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-2 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Period</option>
                        <option value="2020s">2020s</option>
                        <option value="2010s">2010s</option>
                        <option value="2000s">2000s</option>
                        <option value="1990s">1990s</option>
                        <option value="1980s">1980s</option>
                        <option value="1970s">1970s</option>
                        <option value="1960s">1960s</option>
                        <option value="1950s">1950s</option>
                        <option value="1940s">1940s</option>
                        <option value="1930s">1930s</option>
                        <option value="1920s">1920s</option>
                        <option value="1910s and under">1910s and under</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="moodEmotion"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Mood/Emotion</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-1 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Mood</option>
                        <option value="Happy">Happy</option>
                        <option value="Sad">Sad</option>
                        <option value="Energetic">Energetic</option>
                        <option value="Relaxing">Relaxing</option>
                        <option value="Romantic">Romantic</option>
                        <option value="Motivational">Motivational</option>
                        <option value="Chill">Chill</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activityContext"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Activity/Context</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-1 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Context</option>
                        <option value="Workout">Workout</option>
                        <option value="Studying">Studying</option>
                        <option value="Party">Party</option>
                        <option value="Relaxation">Relaxation</option>
                        <option value="Driving">Driving</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Meditation">Meditation</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <FormField
                control={form.control}
                name="songPopularity"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Song Popularity</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-1 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Popularity</option>
                        <option value="Popular Hits">Popular Hits</option>
                        <option value="Hidden Gems">Hidden Gems</option>
                        <option value="Mix of Both">Mix of Both</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tempo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Tempo</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-1 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Tempo</option>
                        <option value="Slow">Slow</option>
                        <option value="Medium">Medium</option>
                        <option value="Fast">Fast</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="explicitContent"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Explicit Content</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-1 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Preference</option>
                        <option value="Include Explicit">Include Explicit</option>
                        <option value="Exclude Explicit">Exclude Explicit</option>
                        <option value="No Preference">No Preference</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Language</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-1 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Mandarin">Mandarin</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Russian">Russian</option>
                        <option value="Italian">Italian</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Korean">Korean</option> 
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diversity"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Diversity</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full mt-1 p-2 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Diversity</option>
                        <option value="High Diversity">High Diversity</option>
                        <option value="Moderate Diversity">Moderate Diversity</option>
                        <option value="Low Diversity">Low Diversity</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit" className="px-6 py-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
               Submit
              </Button>
            </div>
          </form>
        </Form>
        <PlaylistModule playlists={playlists} handleDelete={handleDelete} />
      </div>
    </div>
  );
}
