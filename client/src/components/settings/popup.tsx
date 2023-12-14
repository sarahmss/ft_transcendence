// Popup.tsx
import React, { useState } from 'react';
import TwoFaService from '../../services/twoFa.service';
import './popup.css'
import authService from '../../services/auth.service';

interface PopupProps {
  buttonText: string;
  popupTitle: string;
  popupContent: string;
}

const Popup: React.FC<PopupProps> = ({ buttonText }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [code, setCode] = useState('');

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleClickToEnable = () => {
    TwoFaService.redirectToEnable2FA(code);
  }

  return (
    <div className="popup-container">
      <button onClick={openPopup}>{buttonText}</button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>

            <img src={TwoFaService.getQrCode()} alt="" />


            <input type="text" placeholder='Enter Code' className='inputCode' onChange={(e) => setCode(e.target.value)}/>
            <button className='send' onClick={handleClickToEnable}>Send</button>
            {/* COLOCAR O USERID E O CODE */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
