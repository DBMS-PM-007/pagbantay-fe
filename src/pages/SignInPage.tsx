import { useState, FormEvent, ChangeEvent } from "react";
import { useSignIn } from "@clerk/clerk-react";

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
    <div>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <button type="submit">Sign In</button>
        </form>
      ) : (
        <div>Signed in and session is active!</div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

