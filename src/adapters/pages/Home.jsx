import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useParams, Link, useNavigate } from "react-router-dom";
import Bascula from "../components/BasculaComponent/Bascula";
import Clientes from "../components/ClienteComponent/Clientes";
import Registro from "../components/RegistrosComponent/Registro"; 
import Chat from "../components/ChatComponent/Chat"

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberMe");
        navigate("/login");
    };

    const { username } = useParams();
    const [dateTime, setDateTime] = useState(new Date());
    const [view, setView] = useState("clientes");

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="min-h-screen bg-green-100 flex">
            <div className="w-64 bg-white p-5">
                <div className="mb-10">
                    <div className="flex-1">
                        <Link to={`/home/${username}`} className="btn btn-ghost max-w-max">
                            <img className="h-auto" src={logo} alt="Logo" />
                        </Link>
                    </div>
                </div>
                <ul>
                    <li className="mb-2">
                        <button onClick={() => setView("bascula")} className="text-left w-full bg-green-200 py-2 px-4 rounded-lg">Báscula</button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => setView("clientes")} className="text-left w-full bg-green-200 py-2 px-4 rounded-lg">Clientes</button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => setView("registros")} className="text-left w-full bg-green-200 py-2 px-4 rounded-lg">Registros</button>
                    </li>
                </ul>
            </div>

            <div className="flex-1 p-5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-xl font-bold">
                        {view === "bascula" ? "Báscula" : view === "clientes" ? "Clientes" : "Registros"}
                    </h1>
                    <div className="flex items-center space-x-3">
                        <div className="text-black">{formatDate(dateTime)}</div>
                        <div className="bg-green-500 text-white rounded-lg py-1 px-2 flex items-center">
                            <img
                                alt="User Avatar"
                                src="https://cdn-icons-png.freepik.com/512/64/64572.png"
                                className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{username}</span>
                        </div>
                        <button className="bg-red-500 text-white rounded-lg py-1 px-2" onClick={handleLogout}>Cerrar sesión</button>
                    </div>
                </div>
                {view === "bascula" ? <Bascula /> : view === "clientes" ? <Clientes /> : <Registro />}
            </div>
            <Chat />
        </div>
    );
}
