const API_BASE_URL = 'http://localhost:8000/api';

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors || 'Ошибка регистрации');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка входа');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка выхода');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка получения профиля');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};