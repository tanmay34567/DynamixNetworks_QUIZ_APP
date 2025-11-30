import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../context/Store';
import { CheckCircle, Circle, ChevronRight, GraduationCap } from 'lucide-react';
import { QuizQuestion } from '../types';

export const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, enrollments, updateProgress, user } = useStore();
  
  const course = courses.find(c => c.id === courseId);
  const enrollment = enrollments.find(e => e.courseId === courseId && e.userId === user?.id);
  
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!course || !enrollment) return <div className="p-8">Course not found or not enrolled.</div>;

  const currentModule = course.modules[activeModuleIndex];
  const isModuleCompleted = enrollment.completedModuleIds.includes(currentModule.id);
  const quizData: QuizQuestion[] | undefined = currentModule.quiz;

  const handleComplete = () => {
    updateProgress(course.id, currentModule.id);
    if (activeModuleIndex < course.modules.length - 1) {
        setActiveModuleIndex(prev => prev + 1);
        resetQuizState();
    }
  };

  const resetQuizState = () => {
      setQuizAnswers([]);
      setQuizSubmitted(false);
  }

  const submitQuiz = () => {
      setQuizSubmitted(true);
      // Logic could be added here to require passing score before marking complete
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Sidebar: Module List */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-gray-800">{course.title}</h2>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${enrollment.progress}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">{enrollment.progress}% Completed</p>
        </div>
        <div className="flex-1 p-2 space-y-1">
            {course.modules.map((module, idx) => {
                const isCompleted = enrollment.completedModuleIds.includes(module.id);
                const isActive = idx === activeModuleIndex;
                return (
                    <button 
                        key={module.id}
                        onClick={() => { setActiveModuleIndex(idx); resetQuizState(); }}
                        className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        {isCompleted ? <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" /> : <Circle className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />}
                        <span className={`text-sm font-medium ${isCompleted ? 'line-through opacity-75' : ''}`}>{idx + 1}. {module.title}</span>
                    </button>
                )
            })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto relative flex flex-col">
        <div className="p-8 flex-1 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentModule.title}</h1>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {currentModule.content}
            </div>

            {/* Quiz Section - Only shows if hardcoded quiz data exists */}
            {quizData && quizData.length > 0 && (
                <div className="mt-12 border-t pt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-800"><GraduationCap/> Module Quiz</h3>
                    <div className="space-y-6">
                        {quizData.map((q, qIdx) => (
                            <div key={qIdx} className="bg-gray-50 p-6 rounded-lg">
                                <p className="font-medium text-gray-800 mb-4">{qIdx + 1}. {q.question}</p>
                                <div className="space-y-2">
                                    {q.options.map((opt, oIdx) => {
                                        let btnClass = "w-full text-left p-3 rounded border bg-white hover:bg-gray-50 transition";
                                        if (quizSubmitted) {
                                            if (oIdx === q.correctAnswerIndex) btnClass = "w-full text-left p-3 rounded border bg-emerald-100 border-emerald-500 text-emerald-800 font-medium";
                                            else if (quizAnswers[qIdx] === oIdx) btnClass = "w-full text-left p-3 rounded border bg-red-100 border-red-500 text-red-800";
                                        } else if (quizAnswers[qIdx] === oIdx) {
                                            btnClass = "w-full text-left p-3 rounded border bg-indigo-50 border-indigo-500 text-indigo-800";
                                        }

                                        return (
                                            <button 
                                                key={oIdx}
                                                disabled={quizSubmitted}
                                                onClick={() => {
                                                    const newAns = [...quizAnswers];
                                                    newAns[qIdx] = oIdx;
                                                    setQuizAnswers(newAns);
                                                }}
                                                className={btnClass}
                                            >
                                                {opt}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    {!quizSubmitted && (
                        <button onClick={submitQuiz} className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Submit Quiz</button>
                    )}
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center sticky bottom-0">
             <button 
                onClick={() => setActiveModuleIndex(Math.max(0, activeModuleIndex - 1))}
                disabled={activeModuleIndex === 0}
                className="text-gray-500 hover:text-gray-900 disabled:opacity-30 font-medium"
             >
                Previous
             </button>

             {!isModuleCompleted ? (
                 <button 
                    onClick={handleComplete}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl transition-all flex items-center gap-2 font-medium"
                 >
                    <CheckCircle className="h-5 w-5" /> Mark as Complete
                 </button>
             ) : (
                <button 
                    onClick={() => {
                        if (activeModuleIndex < course.modules.length - 1) {
                            setActiveModuleIndex(prev => prev + 1);
                            resetQuizState();
                        }
                    }}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium"
                >
                    Next Lesson <ChevronRight className="h-5 w-5" />
                </button>
             )}
        </div>
      </div>
    </div>
  );
};