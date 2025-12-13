import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Api/userApi.js";
import ErrorMessage from '../Components/ErrorMessage';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await registerUser({ username, email, password });
      navigate("/signin");
    } catch (err) {
      console.log('Error caught in component:', err);
      console.log('Error response:', err.response);
      
      // Try multiple possible error message locations
      const backendMessage =
        err.response?.data?.message ||           // Direct message
        err.response?.data?.error?.message ||    // Nested in error object
        err.response?.data?.errors?.[0] ||       // Array of errors
        err.message ||                            // Axios error message
        'Failed to create account. Please try again.';
      
      setError(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white px-4">
      <div className="bg-zinc-900 bg-opacity-80 p-12 md:p-16 rounded-md w-full max-w-[450px] shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
            title="Please enter a valid Gmail address (@gmail.com)"
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-red-600 hover:bg-red-700 transition-colors py-3 rounded font-semibold ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-white hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-xs text-center text-gray-500 mt-4 leading-5">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </p>
      </div>
    </div>
  );
};

export default SignUp;