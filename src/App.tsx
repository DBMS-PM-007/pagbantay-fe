import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);

function App() {
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <p className="text-4xl font-bold text-blue-600">
        Tailwind is working! 🎉
      </p>
    </div>
  );
}

export default App;