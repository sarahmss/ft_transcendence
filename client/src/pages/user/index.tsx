import React, { useState } from 'react';

const UserPage: React.FC = () => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  function validateInput() {
    return name.length > 0 && text.length > 0;
  }

  function sendMessage() {
    if (validateInput()) {
      console.log(`Name: ${name}, Message: ${text}`);
      setText('');
    }
  }

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name..."
      />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter message..."
      />
      <button type="button" onClick={() => sendMessage()}>
        Send
      </button>
    </div>
  );
};

export default UserPage;
