import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Navbar from "../navbar";
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

  const token = localStorage.getItem("token");
  const isTokenValid = token && (() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      console.error("Error parsing token:", error);
      return false;
    }
  })();

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
                    src="left.png"
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
                    src="right.png"
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

          {/* Partner logos section with enhanced hover effects */}
          <div className="mt-20 md:mt-24">
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-[#241e58]/60">TECHNOLOGIES USED</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full glow-line"></div>
            </div>
            <div className="flex justify-center items-center space-x-10 md:space-x-16">
              {[
              { src: '/react.svg', name: 'React' },
              { src: '/go.svg', name: 'Go' },
              { src: '/gemini.svg', name: 'Gemini' },
              { src: '/ethers.svg', name: 'Ethers Js' }
              ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center grayscale hover:grayscale-0 transition-all hover:scale-110 hover:-translate-y-1 duration-300">
                <img
                src={tech.src}
                alt={`Technology ${tech.name}`}
                className="h-6 md:h-8 w-auto"
                />
                <span className="mt-2 text-xs md:text-sm text-gray-700 font-semibold" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{tech.name}</span>
              </div>
              ))}
            </div>
          </div>

          {/* Feature cards section with enhanced effects */}
          <div className="mt-28 text-center" id="features">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#241e58]">How ChainCode Works</h2>
            <p className="text-lg text-[#241e58]/70 mb-4 max-w-2xl mx-auto">
              Turn your coding skills into valuable NFTs while learning from the community's diverse solutions
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 rounded-full glow-line"></div>

            <div className="grid grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto">
              <div className="col-span-12 md:col-span-4">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl h-full border border-gray-100 hover:border-blue-100 transition-all hover:-translate-y-3 duration-300 feature-card">
                  <div className="rounded-xl mb-6 w-16 h-16 bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center mx-auto feature-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 8L3 12L7 16M17 8L21 12L17 16M14 4L10 20" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-[#241e58]" id="practice">Solve Challenges</h3>
                  <p className="text-[#241e58]/70">
                    Work through our diverse library of coding problems and create your solution. Speed and uniqueness are rewarded with higher value NFTs.
                  </p>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl h-full border border-gray-100 hover:border-blue-100 transition-all hover:-translate-y-3 duration-300 feature-card">
                  <div className="rounded-xl mb-6 w-16 h-16 bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center mx-auto feature-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.66347 17H14.3364M11.9999 3V4M18.3639 5.63604L17.6568 6.34315M21 11.9999H20M4 11.9999H3M6.34309 6.34315L5.63599 5.63604M8.46441 15.5356C6.51179 13.5829 6.51179 10.4171 8.46441 8.46449C10.417 6.51187 13.5829 6.51187 15.5355 8.46449C17.4881 10.4171 17.4881 13.5829 15.5355 15.5356L14.9884 16.0827C14.3555 16.7155 13.9999 17.5739 13.9999 18.469V19C13.9999 20.1046 13.1045 21 11.9999 21C10.8954 21 9.99995 20.1046 9.99995 19V18.469C9.99995 17.5739 9.6444 16.7155 9.01151 16.0827L8.46441 15.5356Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-[#241e58]" id="verify">Originality Validation</h3>
                  <p className="text-[#241e58]/70">
                    Our intelligent system evaluates each solution's uniqueness against existing submissions, ensuring diverse problem-solving approaches are rewarded.
                  </p>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl h-full border border-gray-100 hover:border-blue-100 transition-all hover:-translate-y-3 duration-300 feature-card">
                  <div className="rounded-xl mb-6 w-16 h-16 bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center mx-auto feature-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-[#241e58]" id="mint">Mint & Earn</h3>
                  <p className="text-[#241e58]/70">
                    Successful unique solutions are minted as NFTs in your wallet. Browse other developers' solutions through the blockchain to learn different approaches.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 max-w-4xl mx-auto bg-blue-50/50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-2xl font-bold mb-4 text-[#241e58]">Why Tokenize Your Solutions</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 rounded-full p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L9 17L19 7" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <span className="text-[#241e58]/80">Immutable proof of your coding accomplishments</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 rounded-full p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L9 17L19 7" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <span className="text-[#241e58]/80">Access a library of alternative solution approaches</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 rounded-full p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L9 17L19 7" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <span className="text-[#241e58]/80">Recognition and rewards for innovative solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 rounded-full p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L9 17L19 7" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <span className="text-[#241e58]/80">Showcase verified code expertise to potential employers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 rounded-full p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L9 17L19 7" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <span className="text-[#241e58]/80">Learn efficiently through curated problem solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 rounded-full p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L9 17L19 7" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <span className="text-[#241e58]/80">Priority incentives for first-to-solve developers</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Newsletter section with updated title */}
          <div className="mt-28 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-10 shadow-md border border-blue-100 max-w-3xl mx-auto hover:shadow-lg transition-shadow newsletter-card">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto md:mx-0 hover:bg-blue-200 transition-colors hover:scale-110 duration-300 pulse-slow">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-3 text-[#241e58] text-center md:text-left">
                  Get New Updates
                </h3>
                <p className="text-[#241e58]/70 mb-6 text-center md:text-left">
                  Stay informed about new challenges, platform improvements, and emerging tokenization opportunities.
                </p>
                <form
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow bg-white border border-gray-200 text-black placeholder-gray-500 rounded-full px-4 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 transition-colors"
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full whitespace-nowrap shadow-md hover:shadow-lg hover:scale-105 transition-all">
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced animations and effects CSS */}
      <style jsx>{`
        /* Animation for background blob */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Grid pattern background */
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(75, 85, 99, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(75, 85, 99, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        
        /* Floating particles */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: 0.3;
          animation: float 20s infinite ease-in-out;
        }
        .particle-1 { background-color: #93c5fd; }
        .particle-2 { background-color: #c4b5fd; }
        .particle-3 { background-color: #fde68a; }
        .particle-4 { background-color: #a7f3d0; }
        .particle-5 { background-color: #fdba74; }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(40px, -40px); }
          50% { transform: translate(80px, 20px); }
          75% { transform: translate(20px, 60px); }
        }
        
        /* Shining text effect */
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        .shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
          animation: shine 5s infinite;
        }
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
        
        /* Button pulse effect */
        .pulse-btn-effect {
          animation: pulse-slight 2s infinite;
        }
        @keyframes pulse-slight {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        /* Hover float effect */
        .hover-float:hover {
          transform: translateY(-3px);
          transition: transform 0.3s ease;
        }
        
        /* Arrow icon animation */
        .arrow-icon {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        button:hover .arrow-icon {
          transform: translateX(4px);
        }
        
        /* Pulsing dot */
        .pulse-dot {
          animation: pulse-dot 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        
        /* Slow pulse */
        .pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Glowing effect */
        .glow-effect {
          box-shadow: 0 0 5px rgba(79, 70, 229, 0.2);
          transition: box-shadow 0.3s ease;
        }
        .glow-effect:hover {
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.5);
        }
        
        /* Glowing line */
        .glow-line {
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from { box-shadow: 0 0 2px rgba(79, 70, 229, 0.2); }
          to { box-shadow: 0 0 8px rgba(79, 70, 229, 0.6); }
        }
        
        /* Image overlay effect */
        .image-overlay {
          background: linear-gradient(to top, rgba(79, 70, 229, 0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        div:hover > .image-overlay {
          opacity: 1;
        }
        
        /* Shadow glow on hover */
        .hover\:shadow-glow:hover {
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.2);
        }
        
        /* Feature card enhancements */
        .feature-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .feature-icon {
          transition: all 0.3s ease;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
        .feature-card:hover .feature-icon {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          transform: rotate(5deg);
        }
        
        /* Newsletter card enhancements */
        .newsletter-card {
          position: relative;
          overflow: hidden;
        }
        .newsletter-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .newsletter-card:hover::before {
          opacity: 1;
        }
        
        /* Navigation link effect */
        .nav-link {
          position: relative;
          display: inline-block;
          transition: all 0.3s ease;
          padding-bottom: 2px;
        }
        .nav-link:hover {
          transform: translateY(-2px);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #4F46E5;
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>
    </div>
  );
}
