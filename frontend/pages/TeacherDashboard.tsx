import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Plus, Trash2, Book, LayoutList, X, Save, Edit, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Course, Module, QuizQuestion } from '../types';

export const TeacherDashboard: React.FC = () => {
  const { user, courses, addCourse, updateCourse, deleteCourse, enrollments } = useStore();
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [courseForm, setCourseForm] = useState<{
      title: string;
      description: string;
      category: string;
      modules: Module[];
  }>({
      title: '',
      description: '',
      category: '',
      modules: []
  });

  // Filter courses created by this teacher
  const myCourses = courses.filter(c => c.instructorId === user?.id);

  // Analytics data: enrollments per course
  const analyticsData = myCourses.map(course => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
    students: enrollments.filter(e => e.courseId === course.id).length
  }));

  const resetForm = () => {
      setCourseForm({ title: '', description: '', category: '', modules: [] });
      setIsEditing(false);
      setEditingId(null);
      setShowForm(false);
  };

  const handleEditClick = (course: Course) => {
      setCourseForm({
          title: course.title,
          description: course.description,
          category: course.category,
          modules: JSON.parse(JSON.stringify(course.modules)) // Deep copy
      });
      setEditingId(course.id);
      setIsEditing(true);
      setShowForm(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
        if (isEditing && editingId) {
            const updated: Course = {
                id: editingId,
                instructorId: user.id,
                instructorName: user.name,
                thumbnailUrl: courses.find(c => c.id === editingId)?.thumbnailUrl || 'https://picsum.photos/400/250',
                ...courseForm
            };
            await updateCourse(updated);
        } else {
            // For new courses, we let backend generate ID but we need to pass strict type
            // The backend ignores the ID passed if we programmed it that way, or we generate a temp one.
            // Our store logic for addCourse expects a Course object.
            const newCourse: Course = {
                id: '', // Backend handles this
                instructorId: user.id,
                instructorName: user.name,
                thumbnailUrl: `https://picsum.photos/seed/${courseForm.title.replace(/\s/g, '')}/400/250`,
                ...courseForm
            };
            await addCourse(newCourse);
        }
        resetForm();
    } catch (err) {
        console.error("Error saving course", err);
        alert("Failed to save course");
    }
  };

  // Module Management
  const addModule = () => {
      const newId = `m-${Date.now()}`;
      setCourseForm(prev => ({
          ...prev,
          modules: [...prev.modules, { id: newId, title: 'New Module', content: 'Add content here...', quiz: [] }]
      }));
      setTimeout(() => {
          const el = document.getElementById(`module-${newId}`);
          if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }, 0);
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
      const newModules = [...courseForm.modules];
      newModules[index] = { ...newModules[index], [field]: value };
      setCourseForm(prev => ({ ...prev, modules: newModules }));
  };

  const removeModule = (index: number) => {
      const newModules = courseForm.modules.filter((_, i) => i !== index);
      setCourseForm(prev => ({ ...prev, modules: newModules }));
  };

  // Quiz Management
  const addQuizQuestion = (moduleIndex: number) => {
      const newModules = [...courseForm.modules];
      if (!newModules[moduleIndex].quiz) {
          newModules[moduleIndex].quiz = [];
      }
      newModules[moduleIndex].quiz!.push({
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0
      });
      const questionIndex = newModules[moduleIndex].quiz!.length - 1;
      setCourseForm({...courseForm, modules: newModules});
      setTimeout(() => {
          const el = document.getElementById(`question-${moduleIndex}-${questionIndex}`);
          if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }, 0);
  };

  const removeQuizQuestion = (moduleIndex: number, questionIndex: number) => {
      const newModules = [...courseForm.modules];
      if (newModules[moduleIndex].quiz) {
          newModules[moduleIndex].quiz = newModules[moduleIndex].quiz!.filter((_, i) => i !== questionIndex);
          setCourseForm({...courseForm, modules: newModules});
      }
  };

  const updateQuizQuestion = (moduleIndex: number, questionIndex: number, field: keyof QuizQuestion, value: any) => {
      const newModules = [...courseForm.modules];
      if (newModules[moduleIndex].quiz && newModules[moduleIndex].quiz![questionIndex]) {
          newModules[moduleIndex].quiz![questionIndex] = {
              ...newModules[moduleIndex].quiz![questionIndex],
              [field]: value
          };
          setCourseForm({...courseForm, modules: newModules});
      }
  };

  const updateQuizOption = (moduleIndex: number, questionIndex: number, optionIndex: number, value: string) => {
      const newModules = [...courseForm.modules];
      const quiz = newModules[moduleIndex].quiz;
      if (quiz && quiz[questionIndex]) {
          const newOptions = [...quiz[questionIndex].options];
          newOptions[optionIndex] = value;
          quiz[questionIndex].options = newOptions;
          setCourseForm({...courseForm, modules: newModules});
      }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
        {!showForm && (
            <button 
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
                <Plus className="h-5 w-5" /> <span>Create New Course</span>
            </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg animate-fade-in relative">
            <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-indigo-900">{isEditing ? 'Edit Course' : 'Create New Course'}</h2>
            
            <form onSubmit={handleSaveCourse} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Course Title</label>
                        <input 
                            type="text" 
                            required
                            value={courseForm.title}
                            onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Advanced JavaScript"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <input 
                            type="text" 
                            required
                            value={courseForm.category}
                            onChange={e => setCourseForm({...courseForm, category: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Development"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        required
                        value={courseForm.description}
                        onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                        placeholder="Brief overview of the course..."
                    />
                </div>

                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Modules</h3>
                        <button type="button" onClick={addModule} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                            <Plus className="h-4 w-4" /> Add Module
                        </button>
                    </div>

                    <div className="space-y-6">
                        {courseForm.modules.map((module, index) => (
                            <div key={module.id || index} id={`module-${module.id || index}`} className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Module {index + 1}</span>
                                    <button type="button" onClick={() => removeModule(index)} className="text-red-500 hover:text-red-700 p-1">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Module Title</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. Introduction to React"
                                            value={module.title}
                                            onChange={e => updateModule(index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:border-indigo-500 outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Content (Markdown supported)</label>
                                        <textarea 
                                            placeholder="Enter module content here..."
                                            value={module.content}
                                            onChange={e => updateModule(index, 'content', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:border-indigo-500 outline-none text-sm h-32"
                                        />
                                    </div>

                                    {/* Quiz Editor for this Module */}
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                                                <HelpCircle className="h-4 w-4" /> Quiz Questions
                                            </h4>
                                            <button 
                                                type="button" 
                                                onClick={() => addQuizQuestion(index)}
                                                className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded"
                                            >
                                                <Plus className="h-3 w-3" /> Add Question
                                            </button>
                                        </div>
                                        
                                        {module.quiz && module.quiz.length > 0 ? (
                                            <div className="space-y-4 pl-2">
                                                {module.quiz.map((q, qIndex) => (
                                                    <div key={qIndex} id={`question-${index}-${qIndex}`} className="bg-white border border-gray-200 p-4 rounded-lg relative">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeQuizQuestion(index, qIndex)} 
                                                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                        <div className="flex items-center gap-2 mb-3 pr-6">
                                                             <span className="text-xs font-bold text-gray-400">Q{qIndex + 1}</span>
                                                             <input 
                                                                type="text" 
                                                                className="flex-1 bg-white text-gray-900 border border-gray-300 rounded px-2 py-1 text-sm focus:border-indigo-500 outline-none"
                                                                placeholder="Enter question text..."
                                                                value={q.question}
                                                                onChange={(e) => updateQuizQuestion(index, qIndex, 'question', e.target.value)}
                                                             />
                                                        </div>
                                                        <div className="pl-6 space-y-2">
                                                            {q.options.map((opt, oIndex) => (
                                                                <div key={oIndex} className="flex items-center gap-2">
                                                                    <input 
                                                                        type="radio" 
                                                                        name={`correct-${index}-${qIndex}`}
                                                                        checked={q.correctAnswerIndex === oIndex}
                                                                        onChange={() => updateQuizQuestion(index, qIndex, 'correctAnswerIndex', oIndex)}
                                                                        className="h-4 w-4 accent-indigo-600 cursor-pointer"
                                                                        title="Select as correct answer"
                                                                    />
                                                                    <input 
                                                                        type="text"
                                                                        className={`flex-1 text-sm px-2 py-1 rounded border ${q.correctAnswerIndex === oIndex ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'} text-gray-900 outline-none focus:border-indigo-500`}
                                                                        value={opt}
                                                                        onChange={(e) => updateQuizOption(index, qIndex, oIndex, e.target.value)}
                                                                        placeholder={`Option ${oIndex + 1}`}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                                                <p className="text-xs text-gray-500">No questions added yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {courseForm.modules.length === 0 && (
                            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                <Book className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>No modules added. Click "Add Module" to start.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 sticky bottom-0 bg-white py-4 border-t mt-4 z-10">
                    <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200">
                        <Save className="h-4 w-4" /> Save Course
                    </button>
                </div>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course List */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Book className="h-5 w-5" /> My Courses
            </h2>
            {myCourses.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
                    <p className="text-gray-500">You haven't created any courses yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myCourses.map(course => (
                        <div key={course.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition">
                            <div>
                                <div className="h-32 w-full rounded-lg overflow-hidden mb-4 relative">
                                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                                    <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                        {course.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{course.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                                <p className="text-xs text-indigo-500 font-medium mt-2">{course.modules.length} Modules</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center gap-2">
                                <span className="text-xs text-gray-400">ID: {course.id}</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEditClick(course)}
                                        className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition"
                                        title="Edit Course"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => deleteCourse(course.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                                        title="Delete Course"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Analytics */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LayoutList className="h-5 w-5" /> Enrollment Analytics
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
                {analyticsData.length > 0 ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" hide />
                            <YAxis allowDecimals={false} />
                            <Tooltip cursor={{fill: '#EEF2FF'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="students" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data available</div>
                )}
            </div>
            <div className="bg-indigo-900 text-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Teacher's Guide</h3>
                <p className="text-indigo-200 text-sm mb-4">
                   Create courses manually using the form. Add modules with comprehensive content and quizzes.
                </p>
                <div className="text-xs text-indigo-300 bg-indigo-800 p-2 rounded">
                    <strong>Tip:</strong> You can now add multiple choice questions to each module. Use the "Quiz Questions" section within the module editor.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};