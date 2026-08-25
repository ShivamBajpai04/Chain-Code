import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import Problems from "./components/pages/problems";
import ProblemsListPage from "./components/pages/problemsList";
import TryIt from "./components/pages/tryIt";
import LandingPage2 from "./components/pages/landingPage2";
import NFTPage from "./components/pages/nftpage";
import api from "./utils/api";
import { DNFT } from "./components/pages/dnft";
import { PollList } from "./components/PollList";
import { PollVoting } from "./components/PollVoting";
import { useAuthToken, setAuthToken } from "./utils/auth";
import { BlogList, BlogPost } from "./components/pages/Blog";

function NotFound() {
  return (
    <div className="app-ledger-grid flex min-h-screen flex-col items-center justify-center text-[#f5f1e8]">
      <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-[#d4a017]">
        404
      </p>
      <h1 className="f-display mt-3 text-2xl font-semibold tracking-tight">
        This page isn't on the ledger
      </h1>
      <Link
        to="/"
        className="mt-8 rounded-md border border-white/[0.12] px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/[0.06]"
      >
        Back home
      </Link>
    </div>
  );
}

function App() {
  const token = useAuthToken();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      const data = response.data;

      setAuthToken(data.token);
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
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
        walletAddress,
      });

      const data = response.data;

      setAuthToken(data.token);
      return true; // Indicate successful signup
    } catch (error: any) {
      console.error("Signup error:", error);
      // surface the server's reason to the form
      throw new Error(
        error?.response?.data?.msg || "Signup failed. Please try again."
      );
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage2 />} />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/problems" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            token ? (
              <Navigate to="/problems" replace />
            ) : (
              <Signup onSignup={handleSignup} />
            )
          }
        />
        <Route
          path="/problems"
          element={
            token ? (
              <ProblemsListPage handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/try"
          element={token ? <TryIt /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/problems/:id"
          element={
            token ? (
              <Problems handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/polls"
          element={token ? <PollList onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/polls/:id"
          element={token ? <PollVoting /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/nft"
          element={token ? <NFTPage onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        {/* NFT certificate detail — moved off the /:id catch-all so unknown
            single-segment URLs get a real 404 instead of a broken NFT fetch.
            Guarded like every other data page: it fetches submission content. */}
        <Route
          path="/nft/:id"
          element={token ? <DNFT /> : <Navigate to="/login" replace />}
        />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
