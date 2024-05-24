import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Clientes() {
    const [empresas, setEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        try {
            const response = await axios.get("http://localhost:8055/items/companys");
            console.log("Response data:", response.data); // Agrega este log
            setEmpresas(response.data.data);
        } catch (error) {
            console.error("Error fetching empresas:", error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleViewMore = (id) => {
        console.log(`Ver más detalles de la empresa con ID: ${id}`);
    };

    const handleEdit = (id) => {
        console.log(`Editar la empresa con ID: ${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8055/items/companys/${id}`);
            setEmpresas(empresas.filter(empresa => empresa.id !== id));
        } catch (error) {
            console.error("Error deleting empresa:", error);
        }
    };

    const filteredEmpresas = empresas.filter(empresa =>
        empresa.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 p-5">
            <div className="flex items-center mb-5">
                <input
                    type="text"
                    placeholder="Buscar ..."
                    className="flex-1 py-2 px-4 rounded-lg border-2 border-black"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div>
                {filteredEmpresas.map((empresa) => (
                    <div key={empresa.id} className="bg-green-300 mb-2 py-4 px-6 rounded-lg flex items-center justify-between">
                        <span>{empresa.name}</span>
                        <div>
                            <button
                                className="bg-blue-500 text-white py-1 px-2 rounded-lg mr-2"
                                onClick={() => handleViewMore(empresa.id)}
                            >
                                Ver más
                            </button>
                            <button
                                className="bg-yellow-500 text-white py-1 px-2 rounded-lg mr-2"
                                onClick={() => handleEdit(empresa.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-2 rounded-lg"
                                onClick={() => handleDelete(empresa.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
