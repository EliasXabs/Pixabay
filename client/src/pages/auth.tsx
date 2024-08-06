// pages/auth.tsx
import { useState, FormEvent } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { signup, login } from '../api';
import Cookies from 'js-cookie';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="relative w-full max-w-3xl h-96 bg-white shadow-lg rounded-lg overflow-hidden flex">
        {/* Sign In Card */}
        <div className="w-1/2 p-8 flex flex-col h-full absolute inset-y-0 left-0">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
          <LoginForm />
        </div>

        {/* Sign Up Card */}
        <div className="w-1/2 p-8 flex flex-col h-full absolute inset-y-0 right-0">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <SignupForm />
        </div>

        {/* Overlay Card */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-blue-500 text-white flex flex-col items-center justify-center transition-transform duration-500 ${
            isLogin ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ zIndex: 2 }}
        >
          <h2 className="text-3xl font-bold mb-4">Pixabay</h2>
          <p className="mb-8 text-center px-4">
            Access a vast library of images from Pixabay API. Perfect for all your creative needs.
          </p>
          <button
            onClick={toggleAuth}
            className="bg-white text-blue-500 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isLogin ? 'Already have an Account' : 'Create an Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { accessToken, refreshToken } = await login(email, password);
      console.log('Logged in successfully:', { accessToken, refreshToken });

      if (rememberMe) {
        Cookies.set('accessToken', accessToken, { expires: 7 });
        Cookies.set('refreshToken', refreshToken, { expires: 7 });
      } else {
        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);
      }

      router.push('/home');
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        console.error('Login failed:', error.response.data);
      } else {
        console.error('Login failed:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-xs">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-full max-w-xs">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-full max-w-xs flex items-center justify-between">
          <label className="flex items-center text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 w-5 h-5"
            />
            Remember Me
          </label>
          {/* Forgot Password Link */}
          <a
            href="/forgot-password"
            className="text-blue-500 hover:underline text-sm"
          >
            Forgot Password?
          </a>
        </div>
      </div>
      <button
        type="submit"
        className="w-full max-w-xs bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition-colors mt-4 self-center"
      >
        Sign In
      </button>
    </form>
  );
};

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await signup(username, email, password);
      console.log('Signup successful:', response);

      if (response.message === 'User created successfully') {
        router.push({
          pathname: '/verification',
          query: { email },
        });
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        console.error('Signup failed:', error.response.data);
      } else {
        console.error('Signup failed:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-xs">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-full max-w-xs">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-full max-w-xs">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full max-w-xs bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition-colors mt-4 self-center"
      >
        Sign Up
      </button>
    </form>
  );
};

export default AuthPage;
