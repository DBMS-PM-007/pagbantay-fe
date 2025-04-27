import { useState, FormEvent, ChangeEvent } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Header from "../components/Header";
import PagbantayLogo from "../assets/pagbantay_logo.png";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!signIn) {
      setError("Sign-in component not ready");
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setSubmitted(true);
      } else {
        console.warn("Unexpected sign-in status:", result.status);
        setError("Unexpected sign-in status");
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError("Sign-in failed.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen text-center items-center flex flex-col space-y-4 bg-white text-black">
      <Header title="SIGN IN" />
      {!submitted ? (
        <div className="w-[300px] flex flex-col gap-[20px]">
          <img src={PagbantayLogo} />
          <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center gap-2">
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <button type="submit" className="w-full text-md text-black hover:cursor-pointer font-bold bg-white border border-black p-2 rounded-lg">
              SIGN IN
            </button>
          </form>
          <a href="/" className="text-[grey] text-xs">
            Forgot password?
          </a>
          <button
            onClick={() => navigate("/sign-up")}
            className="w-full text-md text-white hover:cursor-pointer font-bold bg-[maroon] border border-black p-2 rounded-lg">
            SIGN UP
          </button>
        </div>
      ) : (
        <Navigate to="./volunteer" />
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

