import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { TypingSession, Lesson } from '../types';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<(TypingSession & { lessons: Lesson })[]>([]);
  const [stats, setStats] = useState({
    avgWpm: 0,
    avgAccuracy: 0,
    totalTime: 0,
    totalSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('typing_sessions')
      .select('*, lessons(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && !error) {
      setSessions(data as any);

      const totalWpm = data.reduce((sum, session) => sum + session.wpm, 0);
      const totalAccuracy = data.reduce((sum, session) => sum + session.accuracy, 0);
      const totalTime = data.reduce((sum, session) => sum + session.time_taken, 0);

      setStats({
        avgWpm: data.length > 0 ? Math.round(totalWpm / data.length) : 0,
        avgAccuracy: data.length > 0 ? Math.round(totalAccuracy / data.length) : 0,
        totalTime,
        totalSessions: data.length,
      });
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading your stats...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.avgWpm}</div>
          <div className="text-gray-600 text-sm">Average WPM</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.avgAccuracy}%</div>
          <div className="text-gray-600 text-sm">Average Accuracy</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{Math.round(stats.totalTime / 60)}</div>
          <div className="text-gray-600 text-sm">Minutes Practiced</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.totalSessions}</div>
          <div className="text-gray-600 text-sm">Total Sessions</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Recent Sessions</h3>
        </div>

        {sessions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No sessions yet. Start practicing to see your progress!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lesson
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WPM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">
                        {session.lessons.title}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {session.lessons.difficulty}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">{session.wpm}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">{session.accuracy}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{session.time_taken}s</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(session.created_at)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
