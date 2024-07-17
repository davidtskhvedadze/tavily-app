import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { useParams } from 'react-router-dom';
import PlaylistModule from "../components/PlaylistModule";
import axios from "axios";
import Loading from "../components/Loading";

const formSchema = z.object({
  filterby: z.string().min(1,{ message: "Filter is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  size: z.string().min(1, { message: "Size is required" }),
});

type SongType = {
    name: string,
    artist: string
}

type PlaylistType = {
    name: string,
    songs: SongType[]
}

export default function AuthUserPage() {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useParams<{ token: string }>();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filterby: "",
      duration: "",
      size: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const playlistResponse = await fetch(`https://api.spotify.com/v1/me/top/${values.filterby}?time_range=${values.duration}&limit=${values.size}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    const playlistData = await playlistResponse.json();
    
    const llmData = {
      type: values.filterby,
      size: values.size,
      names: playlistData.items.map((item: {name: string}) => item.name)
    }
    console.log("Playlist data", llmData);

    axios.post(`/api/spotifyplaylist/${token}`, llmData)
      .then((response) => {
        console.log(response.data.playlist);
        setPlaylists([...playlists, response.data.playlist]);
        form.reset();
      })
      .catch(error => {
        console.error('Could not add playlist', error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleDelete = (playlistIndex: string) => {
    setPlaylists(prevPlaylists => prevPlaylists.filter((_, i) => i !== parseInt(playlistIndex)));
  }

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        console.error("No token provided");
        return;
      }
  
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
  
      const data = await response.json();
      console.log("Profile data", data);
      setUserName(data.display_name);
    }
  
    fetchData();
  }, [token]);

  return (
    <div className="bg-gray-900">
      <div className="sticky top-0 w-full z-50">
        <Navbar name={userName}/>
      </div>
      <div className="bg-black min-h-screen flex flex-col mt-10 items-center py-14e">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col w-full max-w-4xl p-6 shadow-md rounded-lg bg-gray-900">
            <div className="flex flex-wrap justify-center gap-2">
              <FormField
                control={form.control}
                name="filterby"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold text-gray-100">Filter by</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full p-2 mt-1 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Filter</option>
                        <option value="tracks">tracks</option>
                        <option value="artists">artists</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold text-gray-100">Duration</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full p-2 mt-1 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Duration</option>
                        <option value="short_term">short-term</option>
                        <option value="medium_term">medium-term</option>
                        <option value="long_term">long-term</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold text-gray-100">Size</FormLabel>
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
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit" className="px-6 py-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
               Submit
              </Button>
            </div>
          </form>
        </Form>
        <h2 className="mt-4 font-semibold text-lg text-gray-100">Generated Playlist(s)</h2>
        {loading === true ? <Loading /> : <PlaylistModule playlists={playlists} handleDelete={handleDelete} />}
      </div>
    </div>
  );
}
