import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import logo from "../../assets/logo.png";

const Forget = () => {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userCreatedMessage, setUserCreatedMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: username,
            cargo: "Staff",
            correoElectronico: mail,
          }),
        }
      );

      if (response.ok) {
        console.log("Usuario creado exitosamente");
        setUsername("");
        setMail("");
        setUserCreatedMessage("Usuario creado correctamente");
        setTimeout(() => setUserCreatedMessage(""), 5000);
      } else {
        setErrorMessage("Error");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Error");
        console.error("Error al crear usuario:", error.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="wrapper">
        <img className="logo" src={logo} alt="" />
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl text-center">Recuperar contraseña</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={handleUsernameChange}
              maxLength={30}
              required
              className="w-full h-full bg-transparent border-2 border-black/20 outline-none rounded-full text-black px-8"
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={mail}
              onChange={handleMailChange}
              maxLength={30}
              required
              className="w-full h-full bg-transparent border-2 border-black/20 outline-none rounded-full text-black px-8"
            />
            <GrMail className="icon" />
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
          {userCreatedMessage && (
            <div className="alert alert-success" role="alert">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{userCreatedMessage}</span>
            </div>
          )}
          <br />
          <button
            type="submit"
            className="w-full h-12 bg-black text-white rounded-full font-bold shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            Recuperar cuenta
          </button>

          <div className="register-link text-center">
            <p>
              ¿Tienes ya una cuenta creada?{" "}
              <Link to="/login" className="text-black font-semibold">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forget;
