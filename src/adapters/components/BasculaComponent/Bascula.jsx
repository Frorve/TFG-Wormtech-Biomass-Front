import React from "react";

export default function Bascula() {
    return (
        <div className="min-h-screen bg-green-100 flex">
            <div className="flex-1 p-5">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label>Matrícula:</label>
                        <input type="text" className="mb-2 p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label>Cliente:</label>
                        <input type="text" className="mb-2 p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label>Fecha de entrada:</label>
                        <input type="datetime-local" className="mb-2 p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label>Fecha de salida:</label>
                        <input type="datetime-local" className="mb-2 p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label>Pesaje inicial:</label>
                        <input type="number" className="mb-2 p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label>Pesaje final:</label>
                        <input type="number" className="mb-2 p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label>Pesaje total:</label>
                        <input type="number" className="mb-2 p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label>Tipo de residuo:</label>
                        <select className="mb-2 p-2 border rounded">
                            <option>Residuo 1</option>
                            <option>Residuo 2</option>
                            <option>Residuo 3</option>
                        </select>
                    </div>
                    <div className="flex items-end space-x-2">
                        <button className="bg-green-500 text-white rounded py-2 px-4">Guardar</button>
                        <button className="bg-red-500 text-white rounded py-2 px-4">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
