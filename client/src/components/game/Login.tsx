import React, { useState, FormEvent } from 'react';
import { login } from '../../contexts/GameContext';

const Login: React.FC = () => {
  const [name, setName] = useState<string>('');

  const onLogin = (e: FormEvent) => {
    e.preventDefault();
    login(name);
  };

  return (
    <main>
      <section>
        <form onSubmit={onLogin}>
          <div className="input-group">
            <label>Name: </label>
            <input
              placeholder="Login to enter the game"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button>Login</button>
        </form>
      </section>
    </main>
  );
};

export default Login;
