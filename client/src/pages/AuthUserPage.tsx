import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";

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
  const [user, setUser] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filterby: "",
      duration: "",
      size: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setPlaylists([...playlists, { name: "Playlist 1", songs: [{ name: "Song 1", artist: "Artist 1" }] }]);
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getProfile();
      console.log("data", data);
      setUser(data);
    }
    fetchData();
  }, [user]);

  async function getProfile() {
    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts?.pop()?.split(';')?.shift();
    }
  
    const accessToken = getCookie('accessToken');
    console.log("accessToken", accessToken);
    if (!accessToken) {
      console.error('Access token not found in cookies');
      return;
    }
  
    console.log("accessToken", accessToken);
  
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    return data;
  }

  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <Navbar name={"Jake"}/>
      </div>
      <div className="bg-gray-50 min-h-screen flex flex-col mt-4 items-center py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className=" flex flex-col w-full max-w-4xl p-6 shadow-md rounded-lg bg-white">
            <div className="flex flex-wrap justify-center gap-2">
              <FormField
                control={form.control}
                name="filterby"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-center mt-1 font-semibold">Filter by</FormLabel>
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
                    <FormLabel className="flex justify-center mt-1 font-semibold">Duration</FormLabel>
                    <FormControl className="flex">
                      <select {...field} className="form-select block w-full p-2 mt-1 border-gray-300 shadow-sm rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-center">
                        <option value="">Select Duration</option>
                        <option value="short-term">short-term</option>
                        <option value="medium-term">medium-term</option>
                        <option value="long-term">long-term</option>
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
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit" className="px-6 py-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
               Submit
              </Button>
            </div>
          </form>
        </Form>
        {playlists.map((playlist, index) => (
          <Accordion key={`accordion-${index}`} type="multiple">
            <AccordionItem key={`item-${index}`} value={`item-${index}`}>
              <AccordionTrigger>{playlist.name}</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {playlist.songs.map((song, songIndex) => (
                    <li key={`song-${index}-${songIndex}`}>{song.name} - {song.artist}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))} 
      </div>
    </div>
  );
}
