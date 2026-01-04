import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Keyboard, Mail, Lock, AlertCircle, CheckCircle, Github } from 'lucide-react';  // Added CheckCircle

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);  // New state
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGithub } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);

    if (result.error) {
      setError(result.error.message);
      setIsConfirmationSent(false);
    } else {
      setSuccessMessage('');
      setIsConfirmationSent(true);  // Set flag for confirmation UI
    }

    setLoading(false);
  };

  const handleGithubSignIn = async () => {
    setError('');
    setLoading(true);
    const { error } = await signInWithGithub();
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Keyboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TypeMaster</h1>
          <p className="text-gray-600">Master the art of typing</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isConfirmationSent ? (
            // Confirmation UI
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-4">
                We've sent a confirmation link to <strong>{email}</strong>.
              </p>
              <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                <li>1. Open your email inbox.</li>
                <li>2. Click the confirmation link.</li>
                <li>3. Return here and log in.</li>
              </ul>
              <button
                onClick={() => {
                  setIsConfirmationSent(false);
                  setSuccessMessage('');
                  setIsLogin(true);
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Login
              </button>
            </div>
          ) : (
            // Normal Auth UI
            <>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    isLogin
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    !isLogin
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                onClick={handleGithubSignIn}
                disabled={loading}
                className="w-full py-3 mb-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                Sign in with GitHub
              </button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Practice typing and track your progress
        </div>
      </div>
    </div>
  );
}
