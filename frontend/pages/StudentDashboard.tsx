import React from 'react';
import { useStore } from '../context/Store';
import { Link } from 'react-router-dom';
import { PlayCircle, Award, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user, courses, enrollments } = useStore();

  const myEnrollments = enrollments.filter(e => e.userId === user?.id);
  const totalCourses = myEnrollments.length;
  const completedCourses = myEnrollments.filter(e => e.progress === 100).length;
  const inProgressCourses = totalCourses - completedCourses;

  const data = [
    { name: 'Completed', value: completedCourses },
    { name: 'In Progress', value: inProgressCourses },
  ];
  const COLORS = ['#10B981', '#6366F1'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-500 mt-2">You have {inProgressCourses} courses in progress.</p>
        </div>
        <Link to="/catalog" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Browse New Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-700">Learning Status</h3>
                <div className="h-40 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={data} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={40} 
                                outerRadius={60} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="flex justify-around text-center text-sm">
                <div>
                    <span className="block font-bold text-lg text-emerald-500">{completedCourses}</span>
                    <span className="text-gray-400">Completed</span>
                </div>
                <div>
                    <span className="block font-bold text-lg text-indigo-500">{inProgressCourses}</span>
                    <span className="text-gray-400">In Progress</span>
                </div>
            </div>
        </div>

        {/* Course List */}
        <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
            {myEnrollments.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                    <Link to="/catalog" className="text-indigo-600 font-medium mt-2 inline-block hover:underline">Start Learning Now</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {myEnrollments.map(enrollment => {
                        const course = courses.find(c => c.id === enrollment.courseId);
                        if (!course) return null;
                        return (
                            <div key={course.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
                                <img src={course.thumbnailUrl} alt={course.title} className="w-24 h-16 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${enrollment.progress}%` }}></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                                        <span>{enrollment.progress}% Complete</span>
                                        <span>{enrollment.completedModuleIds.length}/{course.modules.length} Modules</span>
                                    </div>
                                </div>
                                <Link to={`/course/${course.id}`} className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100">
                                    <PlayCircle className="h-6 w-6" />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};