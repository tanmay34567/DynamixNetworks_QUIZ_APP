import React, { useEffect, useState } from 'react';
import { useStore } from '../context/Store';
import { Mail, Shield, User } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateProfile({
        name,
        email,
        avatarUrl: avatarUrl || undefined,
      });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative">
             <div className="absolute -bottom-16 left-8">
                 <img src={user.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md" />
             </div>
        </div>
        
        <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                          placeholder="Full name"
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                          placeholder="Email address"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                      </>
                    )}
                </div>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100 capitalize">
                    {user.role} Account
                </span>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Contact Information</h3>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Mail className="text-gray-400 h-5 w-5" />
                        <div>
                            <p className="text-xs text-gray-400">Email Address</p>
                            {isEditing ? (
                              <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                              />
                            ) : (
                              <p className="text-gray-900 font-medium">{user.email}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Account Details</h3>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Shield className="text-gray-400 h-5 w-5" />
                        <div>
                            <p className="text-xs text-gray-400">Member ID</p>
                            <p className="text-gray-900 font-medium">{user.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <User className="text-gray-400 h-5 w-5" />
                        <div className="w-full">
                            <p className="text-xs text-gray-400">Avatar URL</p>
                            {isEditing ? (
                              <input
                                type="text"
                                value={avatarUrl}
                                onChange={e => setAvatarUrl(e.target.value)}
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                                placeholder="Optional image URL"
                              />
                            ) : (
                              <p className="text-gray-900 font-medium truncate">{user.avatarUrl || 'Default avatar'}</p>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            <div className="mt-8 border-t pt-8 space-y-4">
                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setError(null); setSuccess(null); if (user) { setName(user.name); setEmail(user.email); setAvatarUrl(user.avatarUrl || ''); } }}
                      className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={saving}
                      className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setIsEditing(true); setError(null); setSuccess(null); }}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Edit Profile
                  </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};