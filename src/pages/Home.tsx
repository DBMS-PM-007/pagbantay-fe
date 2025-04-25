import { useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import PagbantayLogo from "../assets/pagbantay_logo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="w-[350px] h-full mt-6 text-center justify-center flex flex-col space-y-4 bg-white text-black p-6">
        <img src={PagbantayLogo} />
        <UserButton />
        <button
          onClick={() => navigate("/sign-in")}
          type="submit"
          className="mt-4 text-md text-black hover:cursor-pointer font-bold bg-white border border-black p-2 rounded-lg">
          SIGN IN
        </button>
        <button
          onClick={() => navigate("/sign-up")}
          type="submit"
          className="mt-4 text-md text-white hover:cursor-pointer font-bold bg-[maroon] border border-black p-2 rounded-lg">
          SIGN UP
        </button>
      </div>
    </div>
  );
}
