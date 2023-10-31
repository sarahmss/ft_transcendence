import React from 'react';
import Chat from './pages/chat';
import LoginPage from './pages/login';
import GlobalStyle from './styles/global';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <LoginPage />
    </>
  );
};

export default App;
