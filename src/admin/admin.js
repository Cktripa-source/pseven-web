import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";

export default function AdminAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [error, setError] = useState(""); // To store error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Make the API call to register the user with the selected role
      const response = await axios.post("/api/register", {
        fullName: name,
        email,
        password,
        agreeToTerms: true, // Set this based on your agreement logic
        role, // Include the selected role in the payload
      });

      console.log(response.data);
      // You can redirect the user or show success message here
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 bg-gray-800 shadow-xl"
      >
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">
            {isSignup ? "Admin Signup" : "Admin Login"}
          </h2>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                <User className="text-gray-400" />
                <Input 
                  id="name" 
                  type="text" 
                  className="bg-gray-700 text-white border-none focus:ring-0 w-full" 
                  placeholder="Your Name" 
                  name="name"
                  required 
                />
              </div>
            )}
            <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
              <Mail className="text-gray-400" />
              <Input 
                id="email" 
                type="email" 
                className="bg-gray-700 text-white border-none focus:ring-0 w-full" 
                placeholder="Your Email" 
                name="email"
                required 
              />
            </div>
            <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
              <Lock className="text-gray-400" />
              <Input 
                id="password" 
                type="password" 
                className="bg-gray-700 text-white border-none focus:ring-0 w-full" 
                placeholder="Your Password" 
                name="password"
                required 
              />
            </div>

            {/* Role selection for admin */}
            {isSignup && (
              <div className="mb-4 bg-gray-700 p-2 rounded-lg">
                <label htmlFor="role" className="text-gray-400">Select Role</label>
                <select 
                  id="role" 
                  name="role" 
                  className="bg-gray-700 text-white border-none focus:ring-0 w-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {/* Show error message */}
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 shadow-lg">
              {isSignup ? "Sign Up" : "Log In"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-blue-400 hover:underline"
            >
              {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
}
