import { Menubar } from "../components/ui/menubar";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
  name: string;
};

export default function Navbar({ name }: NavbarProps) {
  const navigate = useNavigate();

  function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate('/');
  }

  return (
    <Menubar className="flex justify-between">
      <p>{name}</p>
      <p>Logo</p>
      <button onClick={handleLogout}>Logout</button>
    </Menubar>
  );
}