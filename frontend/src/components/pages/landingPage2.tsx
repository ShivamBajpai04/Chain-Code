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
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Enhanced decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-3/4 left-1/4 w-60 h-60 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={`particle particle-${i % 5 + 1}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Render Header if token is not valid, otherwise render Navbar */}
      {token ?  <Navbar />: <Header/> }
      {console.log(isTokenValid)}

      {/* Hero Section with enhanced effects */}
      <section className="relative overflow-hidden py-16 md:py-24 pt-32 md:pt-40">
        <div className="hero-gradient absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white" aria-hidden="true"></div>

        <div className="container relative z-10">
          <div className="flex justify-center mb-12">
            <div className="text-center max-w-2xl">
              <span className="px-4 py-1.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full inline-block shadow-sm mb-4 animate-pulse-slow">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                Code • Mint • Earn • Own
              </span>
              <motion.h1 
                className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-[#241e58] leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Own Your <span className="bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text shine-effect">Unique Code</span> as NFTs
              </motion.h1>
              <p className="text-lg md:text-xl text-[#241e58]/70 mb-8">
                Solve coding challenges, earn NFTs for unique solutions, and build your on-chain portfolio of verified unique code
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={handleGetStarted} 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-blue-300/50 transition-all hover:scale-105 pulse-btn-effect"
                >
                  Start Coding & Earning <span className="ml-2 arrow-icon">&#8594;</span>
                </Button>
                <a href="#features" className="text-blue-600 hover:text-blue-800 font-medium flex items-center hover-float">
                  How It Works <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Three images side by side with improved text alignment */}
          <div className="grid grid-cols-12 gap-4 md:gap-8 items-center mt-12 max-w-6xl mx-auto">
            {/* Left image and text - with improved styling */}
            <div className="col-span-12 md:col-span-3 order-2 md:order-1">
              <div className="flex flex-col md:items-end text-right bg-white/60 rounded-xl p-2 backdrop-blur-sm shadow-sm mb-3 mx-auto md:mr-0 max-w-[200px]">
                <p className="text-sm font-semibold text-blue-600">Smart Analysis</p>
                <p className="text-xs font-medium text-[#241e58]/80">Originality Detection</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all mt-2 border border-gray-100 hover:border-blue-100 hover:-translate-y-2 duration-300 group">
                <div className="rounded-xl mb-4 w-full overflow-hidden">
                  <img
                    src="lpa3.png"
                    alt="Solution Analysis"
                    className="rounded-xl mb-4 w-full hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#241e58] group-hover:text-blue-600 transition-colors">Originality Check</h3>
                <p className="text-sm text-[#241e58]/70">
                  Our advanced algorithms verify solution uniqueness, encouraging innovative approaches to coding problems.
                </p>
              </div>
            </div>

            {/* Middle larger image with glowing effect */}
            <div className="col-span-12 md:col-span-6 order-1 md:order-2 mb-6 md:mb-0">
              <div className="relative mx-auto">
                <div className="absolute -z-10 text-center w-full top-[-40px] mx-auto">
                  <span className="px-4 py-1.5 text-xs md:text-sm font-medium bg-blue-50 text-blue-600 rounded-full inline-block shadow-sm border border-blue-100 glow-effect">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 mr-2 pulse-dot"></span>
                    <span className="font-semibold">Mint NFTs for Your Code Solutions</span>
                  </span>
                </div>
                <div className="relative mt-6 rounded-2xl overflow-hidden shadow-xl border border-gray-200 mx-auto hover:border-blue-200 transition-all hover:shadow-glow">
                  <img
                    src="lpa3.png"
                    alt="NFT Collection of Code Solutions"
                    className="w-full transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-full py-1.5 px-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 pulse-effect"></div>
                    <span className="text-xs text-white font-medium">On-Chain Verification</span>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full image-overlay"></div>
                </div>
              </div>
            </div>

            {/* Right image and text - with improved styling */}
            <div className="col-span-12 md:col-span-3 order-3">
              <div className="flex flex-col md:items-start bg-white/60 rounded-xl p-2 backdrop-blur-sm shadow-sm mb-3 mx-auto md:ml-0 max-w-[200px]">
                <p className="text-sm font-semibold text-blue-600">Earn Rewards</p>
                <p className="text-xs font-medium text-[#241e58]/80">For Faster Solutions</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all mt-2 border border-gray-100 hover:border-blue-100 hover:-translate-y-2 duration-300 group">
                <div className="rounded-xl mb-4 w-full overflow-hidden">
                  <img
                    src="lpa3.png"
                    alt="Rewards System"
                    className="rounded-xl mb-4 w-full hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#241e58] group-hover:text-blue-600 transition-colors">Incentives</h3>
                <p className="text-sm text-[#241e58]/70">
                  Solve quickly with unique approaches to earn higher rewards and build your on-chain portfolio.
                </p>
              </div>
            </div>
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
