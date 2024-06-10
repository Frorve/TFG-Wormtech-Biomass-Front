import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useParams, Link, useNavigate } from "react-router-dom";
import Bascula from "../components/BasculaComponent/Bascula";
import Clientes from "../components/ClienteComponent/Clientes";
import Registro from "../components/RegistrosComponent/Registro";
import Chat from "../components/ChatComponent/Chat";
import Certificado from "../components/CertificadoComponent/Certificados";
import Reports from "../components/ReportComponent/Reports";

export default function Home() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [dateTime, setDateTime] = useState(new Date());
  const [view, setView] = useState("bascula");

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await handleUpdateSalida();
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("operarioId");
      navigate("/login");
    }
  };

  const handleUnload = async (event) => {
    event.preventDefault();
    await handleUpdateSalida();
  };

  const handleUpdateSalida = async () => {
    const operarioId = localStorage.getItem("operarioId");
    if (operarioId) {
      const token = localStorage.getItem("authToken");
      const salida = new Date().toISOString();
      await fetch(`http://localhost:8055/items/operario/${operarioId}`, {
        method: "PATCH",
        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${token}`,
        // },
        body: JSON.stringify({ salida }),
      });
    }
  };

  const handleLogoClick = () => {
    setView("bascula");
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-green-100 flex">
      <div className="w-64 bg-white p-5">
        <div className="mb-10">
          <div className="flex-1">
            <Link
              to={`/home/${username}`}
              className="btn btn-ghost max-w-max h-20"
            >
              <img
                className="h-auto"
                src={logo}
                alt="Logo"
                onClick={handleLogoClick}
              />
            </Link>
          </div>
        </div>
        <ul>
          <li className="mb-2">
            <button
              onClick={() => setView("bascula")}
              className="text-left w-full bg-green-200 py-2 px-4 rounded-lg"
            >
              Báscula
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setView("clientes")}
              className="text-left w-full bg-green-200 py-2 px-4 rounded-lg"
            >
              Clientes
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setView("registros")}
              className="text-left w-full bg-green-200 py-2 px-4 rounded-lg"
            >
              Registros
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setView("certificados")}
              className="text-left w-full bg-green-200 py-2 px-4 rounded-lg"
            >
              Certificados
            </button>
          </li>
          {/* <li className="mb-2">
            <button
              onClick={() => setView("reports")}
              className="text-left w-full bg-green-200 py-2 px-4 rounded-lg"
            >
              Informes
            </button>
          </li> */}
        </ul>
      </div>
      <div className="flex-1 p-5">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold">
            {view === "bascula"
              ? "Báscula"
              : view === "clientes"
              ? "Clientes"
              : view === "certificados"
              ? "Certificados"
              : view === "reports"
              ? "Reports"
              : "Registros"}
          </h1>
          <div className="flex items-center space-x-3">
            <div className="text-black">{formatDate(dateTime)}</div>
            <a
              href="mailto:central@wormtechbiomass.com?subject=Notificación de operario"
              className="bg-green-700 text-white rounded-lg py-1 px-2"
            >
              Notificar a central
            </a>
            <div className="bg-green-500 text-white rounded-lg py-1 px-2 flex items-center">
              <img
                alt="User Avatar"
                src="https://cdn-icons-png.freepik.com/512/64/64572.png"
                className="w-6 h-6 rounded-full mr-2"
              />
              <span>{username}</span>
            </div>
            <button
              className="bg-red-500 text-white rounded-lg py-1 px-2"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        {view === "bascula" ? (
          <Bascula />
        ) : view === "clientes" ? (
          <Clientes />
        ) : view === "certificados" ? (
          <Certificado />
        ) : view === "reports" ? (
          <Reports />
        ) : (
          <Registro />
        )}
      </div>
      <Chat />
    </div>
  );
}
