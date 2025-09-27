import React from 'react';
import { useNavigate } from 'react-router-dom';
import saiImage from "../assets/Logo.png";
import { Button } from '@/components/ui/button';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white px-4">

      <img
        src={saiImage}
        alt="Sri Sai"
        className="w-36 h-36 rounded-full shadow-lg mb-6 animate-bounce"
      />

      <h1 className="text-6xl font-bold mb-4">404</h1>

      <p className="text-xl mb-6 text-center">
        Om Sai Ram! The page you are looking for cannot be found.
      </p>

      <Button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-yellow-600 cursor-pointer text-white rounded-lg shadow-md hover:bg-yellow-700 transition-colors"
      >
        Return to Home
      </Button>

    </div>
  );
}

export default NotFound;
