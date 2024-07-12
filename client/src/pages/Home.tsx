import spotify from "../assets/alexander-shatov-JlO3-oY5ZlQ-unsplash.jpg"
import Signup from "../components/Signup";

export default function Home() {

  return (
    <main className="h-screen">
      <div className="flex h-full">
        <div className="w-1/2 flex justify-center items-center">
          <Signup />
        </div>
        <div className="w-1/2 h-full">
          <img alt="spotify" src={spotify} className="w-full h-full object-cover"/>
        </div>
      </div>
    </main>
  );
}