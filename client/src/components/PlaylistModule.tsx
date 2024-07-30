import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

type PlaylistType = {
  _id?: string;
  name: string;
  songs: SongType[];
};

type SongType = {
  name: string;
  artist: string;
};

interface PlaylistModuleProps {
  playlists: PlaylistType[];
  handleDelete: (id: string) => void;
}

const PlaylistModule: React.FC<PlaylistModuleProps> = ({ playlists, handleDelete }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {playlists.map((playlist: PlaylistType, index: number) => (
        <Accordion key={index} type="multiple" className="mt-2 mb-4 ">
          <AccordionItem key={`item-${index}`} value={`item-${playlist._id || index}`} className="bg-gray-100">
            <AccordionTrigger className="p-4 text-lg font-semibold text-gray-800 cursor-pointer hover:bg-gray-200">
              {playlist.name}
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-white">
              <ul className="list-none p-0 m-0">
                {playlist.songs.map((song: SongType, songIndex: number) => (
                  <li key={songIndex} className="py-2 border-b border-gray-200 last:border-b-0">{song.name} - {song.artist}</li>
                ))}
              </ul>
              <AlertDialog>
                <AlertDialogTrigger>
                  <button className="mt-4 mr-4 text-red-600 hover:text-red-800 text-lg">
                  &times; Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete your playlist.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(playlist._id || index.toString())}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default PlaylistModule;