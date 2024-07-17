import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';

type PlaylistType = {
  _id: string;
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
        <Accordion key={index} type="multiple">
          <AccordionItem key={`item-${index}`} value={`item-${playlist._id}`}>
            <AccordionTrigger>{playlist.name}</AccordionTrigger>
            <AccordionContent>
              <ul>
                {playlist.songs.map((song: SongType, index: number) => (
                  <li key={index}>{song.name} - {song.artist}</li>
                ))}
              </ul>
              <button onClick={() => handleDelete(playlist._id)}>&times;</button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
};

export default PlaylistModule;