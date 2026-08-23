import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authSignIn, authSignUp } from "../lib/supabase";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");

  // Submit the current email/password credentials to Supabase.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const response =
      mode === "login"
        ? await authSignIn(email, password)
        : await authSignUp(email, password);

    if (response.error) {
      setError(response.error.message);
      return;
    }

    navigate("/");
  };

  // Switch between login and signup modes.
  const toggleMode = () => {
    setError("");
    setMode((currentMode) => (currentMode === "login" ? "signup" : "login"));
  };

  // Render the minimal auth form.
  return (
    <main>
      <h1>{mode === "login" ? "Sign in" : "Sign up"}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? <p role="alert">{error}</p> : null}

        <button type="submit">{mode === "login" ? "Sign in" : "Sign up"}</button>
      </form>

      <button type="button" onClick={toggleMode}>
        {mode === "login" ? "Create an account" : "Already have an account?"}
      </button>
    </main>
  );
}
