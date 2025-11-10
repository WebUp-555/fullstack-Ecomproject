import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../Api/userApi';
import ErrorMessage from '../Components/ErrorMessage';

const SignIn = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser(emailOrUsername, password);
      localStorage.setItem('token', response.data.accessToken);
      navigate('/');
    } catch (err) {
      // Comprehensive error logging
      console.log('=== Full Error Object ===');
      console.log(err);
      console.log('=== Error Response ===');
      console.log(err.response);
      console.log('=== Error Response Data ===');
      console.log(err.response?.data);
      console.log('=== Error Response Status ===');
      console.log(err.response?.status);
      
      // Extract error message with all possible paths
      let backendMessage = 'Something went wrong. Please try again.';
      
      if (err.response?.data) {
        backendMessage = 
          err.response.data.message ||           // ApiResponse message
          err.response.data.error ||             // Error string
          err.response.data.errors?.[0] ||       // Array of errors
          err.response.data.data?.message ||     // Nested in data
          err.message ||                          // Axios error
          backendMessage;
      } else {
        backendMessage = err.message || backendMessage;
      }
      
      console.log('=== Final Error Message ===');
      console.log(backendMessage);
      
      setError(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white px-4">
      <div className="bg-zinc-900 bg-opacity-80 p-12 md:p-16 rounded-md w-full max-w-[450px] shadow-xl">
        
        {/* Centered Heading */}
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Sign In</h1>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Show error message if exists */}
          <ErrorMessage message={error} />
          
          <input
            type="text"
            placeholder="Email or username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <a href="#" className="hover:underline">Need help?</a>
        </div>

        {/* Centered "Sign up now" Text */}
        <p className="mt-8 text-sm text-center text-gray-400">
          New to Japanee?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Sign up now
          </Link>
        </p>

        {/* Centered reCAPTCHA Text */}
        <p className="text-xs text-center text-gray-500 mt-4 leading-5">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
