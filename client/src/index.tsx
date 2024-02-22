import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GameRoomNavigationWrapper from './customNav/gameRedir.navigation';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <GameRoomNavigationWrapper>
      <App />
    </GameRoomNavigationWrapper>
  </BrowserRouter>
);

reportWebVitals();
