import React from 'react';

function Loading() {
    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>

            <style>
                {`
          .loader {
            border-top-color: #1C4BB2;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
}

export default Loading;
