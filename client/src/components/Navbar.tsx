import { Menubar } from "../components/ui/menubar"

export default function Navbar() {
  return (
    <Menubar className="flex justify-between">
      <p >AccName</p>
      <p>Logo</p>
      <button>Logout</button>
    </Menubar>
  )
}