import { useState, FormEvent, ChangeEvent } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import InputField from "@components/InputField"
import axios from "axios";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL

  const registerVolunteer = async (data: any) => {
    try {
      const response = await axios.post(`${API_URL}/users`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Volunteer registration successful:", response.data);
    } catch (error: any) {
      console.error("Volunteer registration error:", error);
      const message = error.response?.data?.detail || "Failed to register volunteer";
      throw new Error(message);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const phoneRegex = /^\+?[0-9]{10,}$/;
    let hasError = false;

    if (!phoneRegex.test(contact)) {
      toast.error("Please enter a valid phone number");
      hasError = true;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      hasError = true;
    }

    if (hasError) return;

    try {
      if (!signUp) throw new Error("Sign-up instance not ready");

      toast("Creating user...")
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
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
      console.log("Session Id:", sessionId);
      console.log("Sign-up status:", signUp.status);
      console.log("Missing fields:", signUp?.missingFields);

      await setActive({ session: sessionId });

      const volunteerData = {
        first_name: firstName,
        last_name: lastName,
        is_admin: false,
        contact_info: contact,
        status: null,
        email: email
      };

      try {
        await registerVolunteer(volunteerData);
      } catch (apiErr: any) {
        console.error("API registration failed:", apiErr);
        return;
      }

      toast.success("Successfully registered user!")
      setSubmitted(true);
    } catch (err: any) {
      console.error("Sign-up error:", err);
      toast.error("Failed to register user. Please try again!");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen text-center justify-center items-center flex flex-col space-y-4 bg-white text-black">
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
      )}
    </div>
  );
}
