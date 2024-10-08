const login = async (loginData) => {
    const response = await fetch(
      `http://localhost:8055/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );
    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }
    return response.json();
  };
  
  const getUserInfo = async (token) => {
    const response = await fetch(
      `http://localhost:8055/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener información del usuario");
    }
    return response.json();
  };
  
  export { login, getUserInfo };