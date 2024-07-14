import { Menubar } from "../components/ui/menubar";
import { useNavigate } from "react-router-dom";

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
    <Menubar className="flex justify-between">
      <p>{name}</p>
      <p>Logo</p>
      <button onClick={handleLogout}>Logout</button>
    </Menubar>
  );
}