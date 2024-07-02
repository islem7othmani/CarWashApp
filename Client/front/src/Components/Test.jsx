import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Navbar from './Navbar';

const socket = io('http://localhost:5000');

function Test() {
  const [username, setUsername] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('new-notification', (msg) => {
      console.log('New notification:', msg);
      setMessage2(msg)
    });

    return () => {
      socket.off('new-notification');
    };
  }, []);

  const registerUser = () => {
    if (username.trim() !== '') {
      socket.emit('register', username);
      setLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '' && targetUser.trim() !== '') {
      socket.emit('send-notification', { to: targetUser, message });
      setMessage('');
    }
  };

  return (
    <div style={styles.app}>
        <Navbar message2={message2} />
      <h1>Notification System</h1>
      {!loggedIn ? (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <button onClick={registerUser} style={styles.button}>
            Register
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Send to (username)"
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send Notification
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    margin: '50px',
  },
  input: {
    width: '300px',
    height: '30px',
    marginBottom: '10px',
  },
  button: {
    height: '36px',
    padding: '0 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
  },
};

export default Test;
