import { useState, FormEvent } from 'react';
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
            {isLogin ? 'Create an Account' : 'Already have an Account'}
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log('Login:', { email, password, rememberMe });

    // Simulate login process
    const loginResponse = {
      accessToken: 'exampleAccessToken',
      refreshToken: 'exampleRefreshToken',
    };

    if (rememberMe) {
      // Store tokens in cookies
      Cookies.set('accessToken', loginResponse.accessToken, { expires: 7 }); // Expires in 7 days
      Cookies.set('refreshToken', loginResponse.refreshToken, { expires: 7 });
    }

    // Handle login logic here
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
        <div className="w-full max-w-xs flex items-center">
          <label className="flex items-center text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 w-5 h-5"
            />
            Remember Me
          </label>
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log('Signup:', { username, email, password });

    // Add your signup logic here
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
