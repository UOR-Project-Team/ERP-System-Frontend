import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigateTo = useNavigate();

  return (
    <div>
      <button onClick={() => navigateTo('/home')}>click to dashboard</button>
    </div>
  );
}

export default Login;