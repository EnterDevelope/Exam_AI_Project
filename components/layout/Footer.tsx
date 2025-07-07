import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white mt-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-6 py-6 text-sm text-gray-500">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Feedback</a>
      </div>
    </footer>
  );
} 