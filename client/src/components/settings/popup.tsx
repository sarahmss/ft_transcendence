// Popup.tsx
import React, { useState } from 'react';
import TwoFaService from '../../services/twoFa.service';
import './popup.css'
import image from './transcendence.png'

interface PopupProps {
  buttonText: string;
  popupTitle: string;
  popupContent: string;
}

const Popup: React.FC<PopupProps> = ({ buttonText }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className="popup-container">
      <button onClick={openPopup}>{buttonText}</button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <img src={image} alt="" />
            <input type="text" placeholder='Enter Code' className='inputCode'/>
            <button className='send' onClick={TwoFaService.redirectToEnable2FA()}>Send</button>
            {/* COLOCAR O USERID E O CODE */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
