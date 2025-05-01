import { useState, FormEvent, ChangeEvent } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Header from "../components/Header";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const registerVolunteer = async (data: any) => {
    const API_URL = "https://vozfgc1nwa.execute-api.ap-southeast-1.amazonaws.com"; 
  
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to register volunteer");
      }
  
      console.log("Volunteer registration successful");
    } catch (error) {
      console.error("Volunteer registration error:", error);
      throw error;
    }
  };  

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      if (!signUp) throw new Error("Sign-up instance not ready");

      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: contact,
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
      console.log("Session Id:", sessionId);
      console.log("Sign-up status:", signUp.status);
      console.log("Missing fields:", signUp?.missingFields);

      await setActive({ session: sessionId });

      const volunteerData = {
        full_name: `${firstName} ${lastName}`,
        email: email,
        contact_number: contact || null,
        committee: null,
        motivation: null,
      };
      
      try {
        await registerVolunteer(volunteerData);
      } catch (apiErr: any) {
        console.error("API registration failed:", apiErr);
        setError("Failed to register user to the system. Please try again.");
        return; 
      }
      
      setSubmitted(true);     

    } catch (err: any) {
      console.error("Sign-up error:", err);
      setError(err.message || "Something went wrong");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen text-center items-center flex flex-col space-y-4 bg-white text-black">
      <Header title="SIGN UP" />
      {!submitted ? (
        <div className="w-[300px] flex flex-col gap-[20px]">
          <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center gap-2">
            <InputField
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
            />
            <InputField
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
            />
            <InputField
              type="text"
              placeholder="Phone Number"
              value={contact}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setContact(e.target.value)
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
            <button
              type="submit"
              className="text-md text-white hover:cursor-pointer font-bold bg-[maroon] border border-black p-2 rounded-lg">
              CREATE ACCOUNT
            </button>
          </form>
          <p className="text-[grey] text-xs">
            Already have an account?
          </p>
          <button
            onClick={() => navigate("/sign-in")}
            className="w-full text-md text-black hover:cursor-pointer font-bold bg-white border border-black p-2 rounded-lg">
            SIGN IN
          </button>
        </div>
      ) : (
        <Navigate to="./volunteer" />
      )
      }
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div >
  );
}
