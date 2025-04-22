import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);

export default function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignInButton />
      </SignedIn>
    </header>
  )
}

