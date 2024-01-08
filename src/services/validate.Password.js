export const validateUsername = (username) => {
    if (!username || username.trim() === '') {
      return 'Username is required';
    }
    // Add more specific validation rules for username if needed
    return ''; // No error
  };
  
  export const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      return 'Password is required';
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{3,}$/.test(password)) {
      return 'Password should be at least 3 characters long and contain at least one uppercase and one lowercase letter';
    }
    return ''; // No error
  };
  
  
  export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword || confirmPassword.trim() === '') {
      return 'Confirm Password is required';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return ''; // No error
  };
  