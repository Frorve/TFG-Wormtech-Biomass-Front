import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Clientes() {
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/company");
            setEmpresas(response.data);
        } catch (error) {
            console.error("Error fetching empresas:", error);
        }
    };

    return (
        <div className="flex-1 p-5">
            <div className="flex items-center mb-5">
                <input type="text" placeholder="Buscar ..." className="flex-1 py-2 px-4 rounded-lg border-2 border-purple-300" />
            </div>
            <div>
                {empresas.map((empresa) => (
                    <div key={empresa.id} className="bg-green-300 mb-2 py-4 px-6 rounded-lg">
                        {empresa.nombre}
                    </div>
                ))}
            </div>
        </div>
    );
}
