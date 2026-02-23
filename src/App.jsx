import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const App = () => {
  const [currentView, setCurrentView] = useState('login'); // Default to login

  return (
    <>
      {currentView === 'login' ? (
        <Login onNavigate={setCurrentView} />
      ) : (
        <SignUp onNavigate={setCurrentView} />
      )}
    </>
  );
};

export default App;
