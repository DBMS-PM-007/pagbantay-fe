import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useState } from "react"

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState<boolean>(true)

  const toggleButton = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <>
      {isSignUp ? <SignUpButton /> : <SignInButton />}
      <button onClick={toggleButton}>Toggle Here</button>
    </>
  )
}
