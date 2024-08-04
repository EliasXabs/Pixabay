// components/Navbar.tsx
import React from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>
          Pixabay App
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <NavLink href="/home" label="Home" />
          <NavLink href="/explore" label="Explore" />
          <NavLink href="/collections" label="My Collections" />
          <NavLink href="/forums" label="Forums" />
          <NavLink href="/profile" label="Profile" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

// NavLink Component
const NavLink = ({ href, label }: { href: string; label: string }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <a
      href={href}
      className={`hover:text-gray-200 ${
        isActive ? 'border-b-2 border-white' : 'border-transparent'
      }`}
    >
      {label}
    </a>
  );
};

// Mobile Menu Component
const MobileMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-md focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-blue-600">
          <div onClick={() => {router.push('/'); setIsOpen(false)}} className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white">Home</div>
          <div onClick={() => {router.push('/explore'); setIsOpen(false)}} className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white">Explore</div>
          <div onClick={() => {router.push('/collections'); setIsOpen(false)}} className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white">My Collections</div>
          <div onClick={() => {router.push('/forums'); setIsOpen(false)}} className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white">Forums</div>
          <div onClick={() => {router.push('/profile'); setIsOpen(false)}} className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white">Profile</div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
