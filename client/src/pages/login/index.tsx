import React, { useState } from 'react';

interface Credentials {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function validateInput() {
    return username.length > 0 && password.length > 0;
  }

  function handleLogin() {
    if (validateInput()) {
      // Lógica para autenticar o usuário com as credenciais fornecidas
      console.log(`Username: ${username}, Password: ${password}`);
      setUsername('');
      setPassword('');
    } else {
      console.log('Please enter a valid username and password');
    }
  }

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username..."
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password..."
      />
      <button type="button" onClick={() => handleLogin()}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
