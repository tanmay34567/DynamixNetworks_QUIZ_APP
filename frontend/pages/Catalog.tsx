import React from 'react';
import { useStore } from '../context/Store';
import { UserRole } from '../types';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { courses, user, enroll, enrollments } = useStore();

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.courseId === courseId && e.userId === user?.id);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
        <p className="text-gray-500 text-lg">Discover new skills and advance your career with our AI-enhanced learning paths.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-48 overflow-hidden relative group">
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-medium">{course.category}</span>
                </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-xl font-bold text-gray-900 leading-tight">{course.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">{course.instructorName}</p>
              <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">{course.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 font-medium">
                    {course.modules.length} Modules
                </div>
                {isEnrolled(course.id) ? (
                  <Link 
                    to={`/course/${course.id}`}
                    className="flex items-center space-x-2 text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Continue</span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => enroll(course.id)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};