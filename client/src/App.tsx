import React from 'react';
import Chat from './pages/chat';
import GlobalStyle from './styles/global';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Chat />
    </>
  );
};

export default App;
