export const isCyrillic = (text) => {
  const cyrillicRegex = /^[а-яА-ЯёЁ\s-]+$/;
  return cyrillicRegex.test(text);
};

export const isLatin = (text) => {
  const latinRegex = /^[a-zA-Z0-9_]+$/;
  return latinRegex.test(text);
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password) => {
  return password.length >= 6;
};

export const formatValidationErrors = (errors) => {
  const fieldNames = {
    username: 'Логин',
    nickname: 'Никнейм',
    first_name: 'Имя',
    last_name: 'Фамилия',
    middle_name: 'Отчество',
    email: 'Email',
    phone: 'Телефон',
    password: 'Пароль',
    confirmPassword: 'Подтверждение пароля',
    agreements: 'Согласия',
  };

  return Object.entries(errors).map(([field, message]) => ({
    field: fieldNames[field] || field,
    message: Array.isArray(message) ? message[0] : message
  }));
};