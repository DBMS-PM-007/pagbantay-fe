import { useState, FormEvent, ChangeEvent } from "react";
import { useSignUp } from "@clerk/clerk-react";
import InputField from "../components/InputField";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      if (!signUp) throw new Error("Sign-up instance not ready");

      await signUp.create({
        emailAddress: email,
        password: password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      const verificationCode = prompt(
        "Enter the verification code sent to your email:"
      );

      try {
        await signUp.attemptEmailAddressVerification({
          code: verificationCode || "",
        });
      } catch (err: any) {
        console.error("Verification failed:", err);
        throw new Error("Email verification failed");
      }

      const sessionId = signUp.createdSessionId;
      // Uncomment Below for Debugging
      //console.log("Session Id:", sessionId);
      //console.log("Sign-up status:", signUp.status);
      //console.log("Missing fields:", signUp?.missingFields);

      await setActive({ session: sessionId });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Sign-up error:", err);
      setError(err.message || "Something went wrong");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-center">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-2">
          <InputField
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <InputField
            type="text"
            placeholder="Phone Number"
            value={number}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNumber(e.target.value)
            }
          />
          <InputField
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <InputField
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <button type="submit" className="mt-4 text-md text-white hover:cursor-pointer font-bold bg-[maroon] border border-black p-2 rounded-lg">CREATE ACCOUNT</button>
        </form>
      ) : (
        <div>Signed up and session is active!</div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
