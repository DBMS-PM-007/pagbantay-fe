import { useNavigate } from "react-router-dom";
import PagbantayLogo from "../assets/pagbantay_logo.png";
import LogoContents from "../assets/pagbantay_logo_contents.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="w-[300px] h-full text-center justify-center flex flex-col space-y-4 bg-white text-black">
        <img src={PagbantayLogo} />
        <img src={LogoContents} />
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
