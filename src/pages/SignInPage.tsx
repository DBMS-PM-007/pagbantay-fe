import { useState, FormEvent, ChangeEvent } from "react";
import { useSignIn } from "@clerk/clerk-react";
import InputField from "../components/InputField";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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
    <div className="flex flex-col justify-center">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-2">
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
          <button type="submit" className="mt-4 text-md text-black hover:cursor-pointer font-bold bg-white border border-black p-2 rounded-lg">SIGN IN</button>
        </form>
      ) : (
        <div>Signed up and session is active!</div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

