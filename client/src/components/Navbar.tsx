import { Menubar } from "../components/ui/menubar";
import { useNavigate } from "react-router-dom";
import tuneTailorLogo from '../assets/musical-note-music-svgrepo-com.svg';

type NavbarProps = {
  name: string;
};

export default function Navbar({ name }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/logout', {
        method: 'GET', 
        credentials: 'include', 
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <Menubar className="flex justify-between items-center border-green-600 bg-green-600 text-white p-4">
      <div className="flex items-center">
        <p className="text-lg font-bold">{name}</p>
      </div>
      <div className="flex items-center">
        <img src={tuneTailorLogo} alt="tunetailorlogo" className="w-8 h-8" />
      </div>
      <button 
        onClick={handleLogout} 
        className=" text-white text-lg font-bold hover:text-black transition-colors duration-200"
      >
        Logout
      </button>
    </Menubar>
  );
}