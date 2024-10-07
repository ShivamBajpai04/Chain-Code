import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  onLogin: (email: string, password: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <motion.div 
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Login to ChainCode</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 text-white"
              required
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Button variant="link" onClick={() => navigate('/signup')} className="text-blue-400 hover:underline p-0">Sign up</Button>
        </p>
      </motion.div>
    </div>
  )
}