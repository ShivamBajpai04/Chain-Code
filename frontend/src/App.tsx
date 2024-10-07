import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import Problems from "./components/pages/problems";
import { ProblemProvider } from "./context/ProblemContext";
import LandingPage from "./components/pages/landingPage";
import LandingPage2 from "./components/pages/landingPage2";
import NFTPage from "./components/pages/nftPage";
import axios from "axios";
import { DNFT } from "./components/pages/dnft";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email: email,
        password: password,
      });
      console.log(response);

      const data = response.data;
      console.log(data);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      window.location.href = "/problems";
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleSignup = async (
    username: string,
    email: string,
    password: string,
    walletAddress: string
  ) => {
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, walletAddress }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      // Redirect to problems page or dashboard
      window.location.href = "/problems";
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    // Redirect to landing page
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage2 />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/:id" element={<div><DNFT/></div>} />
        <Route
          path="/problems"
          element={
            token ? (
              <ProblemProvider>
                <Problems handleLogout={handleLogout} />
              </ProblemProvider>
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/nft" element={<NFTPage />} />
      </Routes>
    </Router>
  );
}

export default App;
