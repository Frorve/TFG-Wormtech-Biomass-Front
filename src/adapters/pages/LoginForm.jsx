import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import * as api from "../api/api";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("rememberedUsername");
    const storedPassword = localStorage.getItem("rememberedPassword");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedUsername && storedPassword && storedRememberMe === "true") {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.loginUser(username, password);

      if (response.status === 200) {
        console.log("Inicio de sesión exitoso");
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }
        localStorage.setItem("token", response.data.token);
        navigate(`/main/${username}`);
      } else {
        setErrorMessage("Credenciales incorrectas");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="wrapper bg-white p-8 rounded-lg shadow-lg">
        <img className="mx-auto mb-8" src={logo} alt="Logo" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-center text-3xl">Login</h1>
          <br />
          <div>
            <label className="block mb-2 text-sm" htmlFor="username">Usuario</label>
            <input
              id="username"
              className="w-full rounded border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={handleUsernameChange}
              maxLength={30}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm" htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="w-full rounded border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
              maxLength={20}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="mr-2"
              />
              Recuérdame
            </label>
            <Link to="/recuperar" className="text-sm text-black">¿Olvidaste la contraseña?</Link>
          </div>

          {errorMessage && (
            <div className="alert alert-error" role="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <button type="submit" className="w-full py-2 bg-green-500 text-white rounded focus:outline-none focus:ring focus:ring-pink-400">
            Iniciar Sesión
          </button>

          <div className="text-center text-sm">
            <p>¿No tienes una cuenta? <Link to="/register" className="text-black font-semibold">Regístrate</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
