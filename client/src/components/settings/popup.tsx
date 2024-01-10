// Popup.tsx
import React, { useState } from 'react';
import TwoFaService from '../../services/twoFa.service';
import './popup.css'
import AuthService from '../../services/auth.service';
import axios from 'axios';
interface PopupProps {
  buttonText: string;
  popupTitle: string;
  popupContent: string;
}

const Popup: React.FC<PopupProps> = ({ buttonText }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [code, setCode] = useState('');
  const [QrcodeImg, setQrCodeImg] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openPopup = () => {
    setPopupOpen(true);
	getQrCode()
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleClickToEnable = () => {
    TwoFaService.redirectToEnable2FA(code);
  }

  const getQrCode = () => {
    const authTokenQr = AuthService.getAuthToken();
    const localQr = localStorage.getItem("qrcode");

    if (localQr) {
      axios.get(localQr, { headers: authTokenQr, responseType: 'arraybuffer' })
        .then((response) => {
          if (response.data) {
            const imageBase64 = btoa(
              new Uint8Array(response.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const imgElement = document.createElement('img');
            imgElement.src = `data:image/png;base64,${imageBase64}`;
            setQrCodeImg(imgElement);
          } else {
            setError('No image data found.');
          }
        })
        .catch(error => {
          console.log(error);
          setError('Error fetching QR code.');
        });
    }
  }

  return (
    <div className="popup-container">
      <button onClick={openPopup}>{buttonText}</button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            {QrcodeImg ? (
              <img src={QrcodeImg.src} alt="" />
            ) : (
              <div>{error || 'Loading QR code...'}</div>
            )}
            <input type="text" placeholder='Enter Code' className='inputCode' onChange={(e) => setCode(e.target.value)}/>
            <button className='send' onClick={handleClickToEnable}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
