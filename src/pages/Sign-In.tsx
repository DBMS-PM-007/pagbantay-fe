import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <>
      <SignedOut>
        <h1>Signed Out</h1>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <h1>Signed In</h1>
        <UserButton />
      </SignedIn>
    </>
  )
}
