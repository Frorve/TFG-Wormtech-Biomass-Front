import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import * as api from "../api/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userCreatedMessage, setUserCreatedMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.registerUser(username, mail, password);

      if (response.status === 200) {
        console.log("Usuario creado exitosamente");
        setUsername("");
        setMail("");
        setPassword("");
        setUserCreatedMessage("Usuario creado correctamente");
        setTimeout(() => setUserCreatedMessage(""), 5000);
      } else {
        setErrorMessage(
          "El nombre de usuario o correo electrónico ya están en uso"
        );
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(
          "El nombre de usuario o correo electrónico ya están en uso"
        );
        console.error("Error al crear usuario:", error.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <img className="mx-auto mb-8" src={logo} alt="Logo" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-center text-3xl">Crear Cuenta</h1>
          <br />
          <div>
          <label className="block mb-2 text-sm" htmlFor="username">Nombre de Usuario</label>
            <input
              type="text"
              className="w-full rounded border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
              placeholder="Usuario"
              value={username}
              onChange={handleUsernameChange}
              maxLength={30}
              required
            />
          </div>

          <div>
          <label className="block mb-2 text-sm" htmlFor="mail">Correo electrónico</label>
            <input
              type="email"
              className="w-full rounded border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
              placeholder="Correo electrónico"
              value={mail}
              onChange={handleMailChange}
              maxLength={30}
              required
            />
          </div>

          <div>
          <label className="block mb-2 text-sm" htmlFor="password">Contraseña</label>
            <input
              type="password"
              className="w-full rounded border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
              maxLength={20}
              required
            />
          </div>

          {errorMessage && (
            <div role="alert" className="alert alert-error">
              <span>{errorMessage}</span>
            </div>
          )}

          {userCreatedMessage && (
            <div role="alert" className="alert alert-success">
              <span>{userCreatedMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded focus:outline-none focus:ring focus:ring-pink-400"
          >
            Crear Usuario
          </button>

          <div className="text-center text-sm">
            <p>¿Tienes ya una cuenta creada?{" "}<Link to="/login" className="text-black font-semibold">Iniciar Sesión</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
