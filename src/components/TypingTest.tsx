import { useState, useEffect, useRef } from 'react';
import { Lesson } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { RotateCcw, Trophy } from 'lucide-react';

interface TypingTestProps {
  lesson: Lesson;
  onComplete: () => void;
}

export default function TypingTest({ lesson, onComplete }: TypingTestProps) {
  const { user } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, timeTaken: 0 });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lesson]);

  useEffect(() => {
    if (startTime && !isComplete) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime, isComplete]);

  useEffect(() => {
    if (userInput.length === lesson.content.length && !isComplete) {
      handleComplete();
    }
  }, [userInput, lesson.content, isComplete]);

  const handleInputChange = (value: string) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (value.length <= lesson.content.length) {
      setUserInput(value);
    }
  };

  const calculateStats = () => {
    const timeInMinutes = currentTime / 60000;
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const wpm = Math.round(wordsTyped / timeInMinutes) || 0;

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === lesson.content[i]) {
        correctChars++;
      }
    }
    const accuracy = Math.round((correctChars / lesson.content.length) * 100);

    return { wpm, accuracy, timeTaken: Math.round(currentTime / 1000) };
  };

  const handleComplete = async () => {
    const calculatedStats = calculateStats();
    setStats(calculatedStats);
    setIsComplete(true);

    if (user) {
      await supabase.from('typing_sessions').insert({
        user_id: user.id,
        lesson_id: lesson.id,
        wpm: calculatedStats.wpm,
        accuracy: calculatedStats.accuracy,
        time_taken: calculatedStats.timeTaken,
        completed: true,
      });
    }
  };

  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setCurrentTime(0);
    setIsComplete(false);
    inputRef.current?.focus();
  };

  const renderText = () => {
    return lesson.content.split('').map((char, index) => {
      let className = 'text-gray-400';

      if (index < userInput.length) {
        className = userInput[index] === char
          ? 'text-green-600 bg-green-50'
          : 'text-red-600 bg-red-50';
      } else if (index === userInput.length) {
        className = 'text-gray-800 bg-blue-100 border-b-2 border-blue-500';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Great Job!</h2>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-blue-600">{stats.wpm}</div>
              <div className="text-gray-600 mt-2">WPM</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-green-600">{stats.accuracy}%</div>
              <div className="text-gray-600 mt-2">Accuracy</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-purple-600">{stats.timeTaken}s</div>
              <div className="text-gray-600 mt-2">Time</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Choose Another Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{lesson.title}</h2>
          <div className="flex gap-6 text-sm">
            <span className="text-gray-600">
              Time: <span className="font-semibold text-blue-600">{formatTime(currentTime)}</span>
            </span>
            <span className="text-gray-600">
              Difficulty: <span className="font-semibold capitalize text-orange-600">{lesson.difficulty}</span>
            </span>
          </div>
        </div>

        <div className="mb-6 p-6 bg-gray-50 rounded-xl font-mono text-lg leading-relaxed">
          {renderText()}
        </div>

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl font-mono text-lg focus:border-blue-500 focus:outline-none resize-none"
          rows={4}
          placeholder="Start typing here..."
        />

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            Progress: {userInput.length} / {lesson.content.length} characters
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
