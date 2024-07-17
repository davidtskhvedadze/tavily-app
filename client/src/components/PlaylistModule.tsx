import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';

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
    <>
      {playlists.map((playlist: PlaylistType, index: number) => (
        <Accordion key={index} type="multiple" className="mb-4">
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
              <button onClick={() => handleDelete(playlist._id || index.toString())} className="absolute top-0 right-0 mt-4 mr-4 text-red-600 hover:text-red-800">
                &times;
              </button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
};

export default PlaylistModule;