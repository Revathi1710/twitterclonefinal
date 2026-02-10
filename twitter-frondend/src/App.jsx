import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import React from 'react';

// Components & Pages
import Homepage from './pages/Home/Homepage';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  // This query checks if the user is authenticated on page load
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        
        // If there's an error or the response isn't OK, we treat it as "not logged in"
        if (data.error || !res.ok) return null;
        
        return data;
      } catch (error) {
        return null; // Return null so authUser becomes null
      }
    },
    retry: false, // Don't keep retrying if the user isn't logged in
  });

  // Show a full-screen spinner while checking authentication status
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className="flex max-w-8xl mx-auto">
      {/* Sidebar only shows if user is logged in */}
      {authUser && <Sidebar />}

      <Routes>
        {/* Protected Routes: Redirect to login if not authenticated */}
        <Route 
          path="/" 
          element={authUser ? <Homepage /> : <Navigate to='/login' />} 
        />
        <Route 
          path="/notifications" 
          element={authUser ? <NotificationPage /> : <Navigate to='/login' />} 
        />
        <Route 
          path="/profile/:username" 
          element={authUser ? <ProfilePage /> : <Navigate to='/login' />} 
        />

        {/* Auth Routes: Redirect to home if already authenticated */}
        <Route 
          path="/signup" 
          element={!authUser ? <Signup /> : <Navigate to='/' />} 
        />
        <Route 
          path="/login" 
          element={!authUser ? <Login /> : <Navigate to='/' />} 
        />
      </Routes>

      {/* RightPanel only shows if user is logged in */}
      {authUser && <RightPanel />}
      
      {/* Global Toast notifications */}
      <Toaster />
    </div>
  );
}

export default App;