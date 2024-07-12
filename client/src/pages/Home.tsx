import { useState } from "react";
import spotify from "../assets/alexander-shatov-JlO3-oY5ZlQ-unsplash.jpg"
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function Home() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <main className="h-screen">
      <div className="flex h-full">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
          {isSignup === false ? <Login /> : <Signup />}
          {isSignup === false ? (
            <div className="mt-4 flex justify-center items-center">
            Don't have an account? 
              <button 
                onClick={() => setIsSignup(!isSignup)} 
                className="flex justify-center ml-2 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 p-2 rounded"
              >
              Sign up
              </button>
            </div>
          ) : null}
        </div>
        <div className="hidden md:block w-1/2 h-full">
          <img alt="spotify" src={spotify} className="w-full h-full object-cover"/>
        </div>
      </div>
    </main>
  );
}