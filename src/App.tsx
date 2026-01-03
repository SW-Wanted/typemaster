import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import LessonSelector from './components/LessonSelector';
import TypingTest from './components/TypingTest';
import Dashboard from './components/Dashboard';
import { Lesson } from './types';
import { Keyboard, BookOpen, BarChart3, LogOut } from 'lucide-react';

function AppContent() {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'lessons' | 'typing' | 'dashboard'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (!user) {
    return <Auth />;
  }

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('typing');
  };

  const handleCompleteLesson = () => {
    setSelectedLesson(null);
    setCurrentView('lessons');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Keyboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">TypeMaster</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentView('lessons');
                  setSelectedLesson(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'lessons'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Lessons
              </button>

              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>

              <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {currentView === 'lessons' && !selectedLesson && (
          <LessonSelector onSelectLesson={handleSelectLesson} />
        )}

        {currentView === 'typing' && selectedLesson && (
          <TypingTest lesson={selectedLesson} onComplete={handleCompleteLesson} />
        )}

        {currentView === 'dashboard' && <Dashboard />}
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        TypeMaster - Master the art of typing
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
