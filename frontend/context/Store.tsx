import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, Enrollment, UserRole } from '../types';

const API_URL = 'http://localhost:5000/api';

interface StoreContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  courses: Course[];
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  enrollments: Enrollment[];
  enroll: (courseId: string) => Promise<void>;
  updateProgress: (courseId: string, moduleId: string) => Promise<void>;
  updateProfile: (updates: { name: string; email: string; avatarUrl?: string }) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  // Initial Load
  useEffect(() => {
    // Restore session from local storage (just the user object for simplicity in this demo)
    const savedUser = localStorage.getItem('dynamix_user');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        fetchEnrollments(parsedUser.id);
    }
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
        const res = await fetch(`${API_URL}/courses`);
        if(res.ok) {
            const data = await res.json();
            setCourses(data);
        }
    } catch (e) {
        console.error("Failed to fetch courses", e);
    }
  };

  const fetchEnrollments = async (userId: string) => {
    try {
        const res = await fetch(`${API_URL}/enrollments?userId=${userId}`);
        if(res.ok) {
            const data = await res.json();
            setEnrollments(data);
        }
    } catch (e) {
        console.error("Failed to fetch enrollments", e);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
    }

    const userData = await res.json();
    setUser(userData);
    localStorage.setItem('dynamix_user', JSON.stringify(userData));
    fetchEnrollments(userData.id);
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
    }

    const userData = await res.json();
    setUser(userData);
    localStorage.setItem('dynamix_user', JSON.stringify(userData));
    fetchEnrollments(userData.id);
  };

  const logout = () => {
    setUser(null);
    setEnrollments([]);
    localStorage.removeItem('dynamix_user');
  };

  const addCourse = async (course: Course) => {
    const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    if (res.ok) {
        const newCourse = await res.json();
        setCourses(prev => [...prev, newCourse]);
    }
  };
  
  const updateCourse = async (updatedCourse: Course) => {
    const res = await fetch(`${API_URL}/courses/${updatedCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse)
    });
    if (res.ok) {
        const savedCourse = await res.json();
        setCourses(prev => prev.map(c => c.id === savedCourse.id ? savedCourse : c));
    }
  };

  const deleteCourse = async (id: string) => {
      const res = await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCourses(prev => prev.filter(c => c.id !== id));
      }
  }

  const enroll = async (courseId: string) => {
    if (!user) return;
    const res = await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId })
    });
    if (res.ok) {
        const newEnrollment = await res.json();
        setEnrollments(prev => [...prev, newEnrollment]);
    }
  };

  const updateProgress = async (courseId: string, moduleId: string) => {
    if (!user) return;
    const res = await fetch(`${API_URL}/enrollments/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId, moduleId })
    });
    if (res.ok) {
        const updatedEnrollment = await res.json();
        setEnrollments(prev => prev.map(e => e.courseId === courseId && e.userId === user.id ? updatedEnrollment : e));
    }
  };

  const updateProfile = async (updates: { name: string; email: string; avatarUrl?: string }) => {
    if (!user) return;
    const res = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      let err: any = {};
      try {
        err = await res.json();
      } catch (_) {}
      throw new Error(err.message || 'Failed to update profile');
    }

    const updatedUser: User = await res.json();
    setUser(updatedUser);
    localStorage.setItem('dynamix_user', JSON.stringify(updatedUser));
  };

  return (
    <StoreContext.Provider value={{ user, login, register, logout, courses, addCourse, updateCourse, deleteCourse, enrollments, enroll, updateProgress, updateProfile }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};