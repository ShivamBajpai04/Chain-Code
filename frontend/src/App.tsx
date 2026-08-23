import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import Problems from "./components/pages/problems";
// import { ProblemProvider } from "./context/ProblemContext";
import LandingPage2 from "./components/pages/landingPage2";
import NFTPage from "./components/pages/nftpage";
import axios from "axios";
import { DNFT } from "./components/pages/dnft";
// import Polling from "./components/pages/polling";
import { PollList } from "./components/PollList";
import { PollVoting } from "./components/PollVoting";
// import { PollProvider } from "./context/PollContext";

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_DOMAIN + "/auth/login",
        {
          email: email,
          password: password,
        }
      );
      // console.log(response);

      const data = response.data;
      // console.log(data);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      return true; // Indicate successful login
    } catch (error: any) {
      console.error("Login error:", error);
      // surface the server's reason (axios puts it on response.data.msg)
      const msg =
        error?.response?.data?.msg || "Login failed. Please try again.";
      throw new Error(msg);
    }
  };

  const handleSignup = async (
    username: string,
    email: string,
    password: string,
    walletAddress: string
  ) => {
    // console.log(import.meta.env.VITE_DOMAIN);
    try {
      const response = await fetch(
        import.meta.env.VITE_DOMAIN + "/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, walletAddress }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // surface the server's reason to the form
        throw new Error(data.msg || "Signup failed. Please try again.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      return true; // Indicate successful signup
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error?.message || "Signup failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage2 />} />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/problems" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            token ? (
              <Navigate to="/problems" />
            ) : (
              <Signup onSignup={handleSignup} />
            )
          }
        />
        <Route path="/:id" element={<DNFT />} />
        <Route
          path="/problems"
          element={
            token ? (
              <Problems handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/polls"
          element={token ? <PollList /> : <Navigate to="/login" />}
        />
        <Route
          path="/polls/:id"
          element={token ? <PollVoting /> : <Navigate to="/login" />}
        />
        <Route
          path="/nft"
          element={token ? <NFTPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
