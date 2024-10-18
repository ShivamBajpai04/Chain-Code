import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./newStyle.css";

export default function UpdatedLandingPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        if (Date.now() < exp) {
          navigate("/problems");
          return;
        }
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-white">
      <header className="navbar">
        <motion.h1
          className="text-4xl font-bold text-black navbar-brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ChainCode
        </motion.h1>
        <nav className="navbar-nav text-xl">
          <motion.ul
            className="flex space-x-6 text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <li>
              <Link
                to="/login"
                className="hover:text-blue-500 transition-colors"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="logout-btn hover:text-blue-500 transition-colors"
              >
                Get Started
              </Link>
            </li>
          </motion.ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 relative z-20 text-center">
        <motion.div
          className="text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="main-heading">
            Write better Code, <br />
            <span className="highlight">collaboratively</span>
          </h2>
          <p className="text-xl mb-8 text-gray-700">
            Practice, Innovate, and Own your solutions with us.
          </p>
          <motion.div
            className="flex flex-col items-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex space-x-4">
              <Button
                onClick={handleGetStarted}
                className="bg-blue-500 hover:bg-blue-700 text-white"
              >
                Get Started for free &#8594;
              </Button>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:text-blue-700 hover:border-blue-700"
              >
                Learn More
              </Button>
            </div>
            <motion.img
              src="lpa3.png"
              alt="Laptop with coding platform"
              className="laptop-image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 section-cards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="card practice-card">
            <h3 className="text-2xl font-bold mb-4">Practice</h3>
            <p>
              Sharpen your coding skills with our vast collection of challenges.
            </p>
          </div>
          <div className="card innovate-card">
            <h3 className="text-2xl font-bold mb-4">Innovate</h3>
            <p>Create unique solutions and stand out from the crowd.</p>
          </div>
          <div className="card own-card">
            <h3 className="text-2xl font-bold mb-4">Own</h3>
            <p>Claim ownership of your solutions on the blockchain.</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 email-subscription"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Stay Updated
          </h3>
          <form
            className="flex justify-center space-x-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs bg-gray-100 border border-gray-300 text-black placeholder-gray-500"
            />
            <Button type="submit" className="bg-blue-500 text-white">
              Subscribe
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
