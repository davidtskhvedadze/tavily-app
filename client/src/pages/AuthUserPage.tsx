import { useState } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playlists, setPlaylists] = useState<PlaylistType[]>([
    {
      name: "Playlist 1",
      songs: [
        { name: "Song Name 1", artist: "Artist 1" },
        { name: "Song Name 2", artist: "Artist 2" },
        { name: "Song Name 3", artist: "Artist 3" }
      ]
    }
  ]);

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
  }

  return (
    <div>
      <Navbar />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} >
          <FormField
            control={form.control}
            name="filterby"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filter by</FormLabel>
                <FormControl>
                  <select {...field}>
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
              <FormItem>
                <FormLabel>size</FormLabel>
                <FormControl>
                  <select {...field}>
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
              <FormItem>
                <FormLabel>size</FormLabel>
                <FormControl>
                  <select {...field}>
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {playlists.map((playlist, index) => (
        <Accordion key={`accordion-${index}`} type="multiple">
          <AccordionItem key={`item-${index}`} value={`item-${index}`}>
            <AccordionTrigger>{playlist.name}</AccordionTrigger>
            <AccordionContent>
              <ul>
                {playlist.songs.map((song, songIndex) => (
                  // Ensure song keys are unique even if song names are not
                  <li key={`song-${index}-${songIndex}`}>{song.name} - {song.artist}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))} 
    </div>
  );
}
