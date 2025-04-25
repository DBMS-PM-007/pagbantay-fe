import { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import ToggleButton from "../components/ToggleButton";
import Header from "../components/Header";
import PagbantayLogo from "../assets/pagbantay_logo.png";

export default function Home() {
  const [toggle, setToggle] = useState<boolean>(true);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Header title={toggle ? "SIGN IN" : "SIGN UP"} />
      <UserButton />
      <div className="w-[350px] h-full mt-6 text-center justify-center flex flex-col space-y-4 bg-white text-black p-6">
        <img src={PagbantayLogo} />
        {toggle ? <SignInPage /> : <SignUpPage />}
        <ToggleButton toggle={toggle} handleToggle={handleToggle} />
      </div>
    </div>
  );
}
