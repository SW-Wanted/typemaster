import { useEffect, useState } from 'react';
import { Lesson } from '../types';
import { supabase } from '../lib/supabase';
import { BookOpen, Zap, Flame } from 'lucide-react';

interface LessonSelectorProps {
  onSelectLesson: (lesson: Lesson) => void;
}

export default function LessonSelector({ onSelectLesson }: LessonSelectorProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('difficulty', { ascending: true });

    if (data && !error) {
      setLessons(data);
    }
    setLoading(false);
  };

  const filteredLessons = selectedDifficulty === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.difficulty === selectedDifficulty);

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <BookOpen className="w-5 h-5" />;
      case 'intermediate':
        return <Zap className="w-5 h-5" />;
      case 'advanced':
        return <Flame className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading lessons...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Choose Your Lesson</h1>
        <p className="text-gray-600">Select a lesson to start improving your typing skills</p>
      </div>

      <div className="flex gap-3 justify-center mb-8">
        <button
          onClick={() => setSelectedDifficulty('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            selectedDifficulty === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Levels
        </button>
        <button
          onClick={() => setSelectedDifficulty('beginner')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            selectedDifficulty === 'beginner'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Beginner
        </button>
        <button
          onClick={() => setSelectedDifficulty('intermediate')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            selectedDifficulty === 'intermediate'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Intermediate
        </button>
        <button
          onClick={() => setSelectedDifficulty('advanced')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            selectedDifficulty === 'advanced'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Advanced
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => onSelectLesson(lesson)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${getDifficultyColor(lesson.difficulty)}`}>
                {getDifficultyIcon(lesson.difficulty)}
              </div>
              <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                {lesson.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">{lesson.title}</h3>

            <p className="text-sm text-gray-600 line-clamp-2 mb-4 font-mono">
              {lesson.content.substring(0, 80)}...
            </p>

            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full border ${getDifficultyColor(lesson.difficulty)}`}>
                {lesson.difficulty}
              </span>
              <span className="text-xs text-gray-500">{lesson.content.length} chars</span>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No lessons found for this difficulty level
        </div>
      )}
    </div>
  );
}
