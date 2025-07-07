import React from 'react';

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <span className="text-xl font-bold tracking-tight">Exam.ai</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-primary">Home</a>
          <a href="#" className="hover:text-primary">Features</a>
          <a href="#" className="hover:text-primary">Log in</a>
        </nav>
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search in site"
            className="input-field w-48"
          />
        </div>
      </div>
    </header>
  );
} 