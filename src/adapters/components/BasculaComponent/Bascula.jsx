import React, { useState } from "react";
import axios from "axios";

export default function Bascula() {
    const [formData, setFormData] = useState({
        matricula: "",
        id_cliente: "",
        fecha_entrada: "",
        fecha_salida: "",
        pesaje_inicial: "",
        pesaje_final: "",
        pesaje_total: "",
        residuo: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8055/items/bascula", { data: formData });
            console.log("Response:", response.data);
            // Opcional: manejar la respuesta, por ejemplo, mostrar un mensaje de éxito
        } catch (error) {
            console.error("Error al guardar los datos:", error);
        }
    };

    const handleReset = () => {
        setFormData({
            matricula: "",
            id_cliente: "",
            fecha_entrada: "",
            fecha_salida: "",
            pesaje_inicial: "",
            pesaje_final: "",
            pesaje_total: "",
            residuo: ""
        });
    };

    return (
        <div className="min-h-screen bg-green-100 flex">
            <div className="flex-1 p-5">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label>Matrícula:</label>
                        <input
                            type="text"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleChange}
                            className="mb-2 p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Cliente:</label>
                        <input
                            type="text"
                            name="id_cliente"
                            value={formData.id_cliente}
                            onChange={handleChange}
                            className="mb-2 p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Fecha de entrada:</label>
                        <input
                            type="datetime-local"
                            name="fecha_entrada"
                            value={formData.fecha_entrada}
                            onChange={handleChange}
                            className="mb-2 p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Fecha de salida:</label>
                        <input
                            type="datetime-local"
                            name="fecha_salida"
                            value={formData.fecha_salida}
                            onChange={handleChange}
                            className="mb-2 p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Pesaje inicial:</label>
                        <input
                            type="number"
                            name="pesaje_inicial"
                            value={formData.pesaje_inicial}
                            onChange={handleChange}
                            className="mb-2 p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Pesaje final:</label>
                        <input
                            type="number"
                            name="pesaje_final"
                            value={formData.pesaje_final}
                            onChange={handleChange}
                            className="mb-2 p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Pesaje total:</label>
                        <input
                            type="number"
                            name="pesaje_total"
                            value={formData.pesaje_total}
                            onChange={handleChange}
                            className="mb-2 p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Tipo de residuo:</label>
                        <select
                            name="residuo"
                            value={formData.residuo}
                            onChange={handleChange}
                            className="mb-2 p-2 border rounded"
                        >
                            <option value="Residuo 1">Residuo 1</option>
                            <option value="Residuo 2">Residuo 2</option>
                            <option value="Residuo 3">Residuo 3</option>
                        </select>
                    </div>
                    <div className="flex items-end space-x-5">
                        <button onClick={handleSubmit} className="bg-green-500 text-white rounded py-2 px-4">
                            Guardar
                        </button>
                        <button onClick={() => window.history.back()} className="bg-red-500 text-white rounded py-2 px-4">
                            Cancelar
                        </button>
                        <button onClick={handleReset} className="bg-orange-500 text-white rounded py-2 px-4">
                            Resetear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
