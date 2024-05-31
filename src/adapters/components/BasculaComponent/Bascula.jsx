import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Bascula() {
  const [bascuCliente, setBascuCliente] = useState("");
  const [bascuMatricula, setBascuMatricula] = useState("");
  const [bascuFechaEntrada, setBascuFechaEntrada] = useState("");
  const [bascuFechaSalida, setBascuFechaSalida] = useState("");
  const [bascuPesajeInicial, setBascuPesajeInicial] = useState("");
  const [bascuPesajeFinal, setBascuPesajeFinal] = useState("");
  const [bascuPesajeTotal, setBascuPesajeTotal] = useState("");
  const [bascuParking, setBascuParking] = useState("");
  const [bascuResiduo, setBascuResiduo] = useState("");
  const [clientes, setClientes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:8055/items/empresa");
        setClientes(response.data.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleClienteChange = (event) => {
    const value = event.target.value;
    setBascuCliente(value);
    if (value) {
      const filteredSuggestions = clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setBascuCliente(suggestion.nombre);
    setSuggestions([]);
  };

  const handleMatriculaChange = (event) => {
    setBascuMatricula(event.target.value);
  };

  const handleFechaEntradaChange = (event) => {
    setBascuFechaEntrada(event.target.value);
  };

  const handleFechaSalidaChange = (event) => {
    setBascuFechaSalida(event.target.value);
  };

  const handlePesajeInicialChange = (event) => {
    setBascuPesajeInicial(event.target.value);
  };

  const handlePesajeFinalChange = (event) => {
    setBascuPesajeFinal(event.target.value);
  };

  const handlePesajeTotalChange = (event) => {
    setBascuPesajeTotal(event.target.value);
  };

  const handleParkingChange = (event) => {
    setBascuParking(event.target.value);
  };

  const handleResiduoChange = (event) => {
    setBascuResiduo(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const basculaInfo = {
        matricula: bascuMatricula,
        cliente: bascuCliente,
        fecha_entrada: bascuFechaEntrada,
        fecha_salida: bascuFechaSalida,
        pesaje_inicial: bascuPesajeInicial,
        pesaje_final: bascuPesajeFinal,
        pesaje_total: bascuPesajeTotal,
        parking: bascuParking,
        residuo: bascuResiduo,
      };

      const response = await fetch(
        "http://localhost:8055/items/bascula",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(basculaInfo),
        }
      );
      if (response.ok) {
        console.log("Response:", response.data);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.errors[0].message || "Error al crear proyecto"
        );
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const handleReset = () => {
    setBascuCliente("");
    setBascuMatricula("");
    setBascuFechaEntrada("");
    setBascuFechaSalida("");
    setBascuPesajeInicial("");
    setBascuPesajeFinal("");
    setBascuPesajeTotal("");
    setBascuParking("");
    setBascuResiduo("");
  };

  return (
    <div className="min-h-screen bg-green-100 flex">
      <div className="flex-1 p-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label>Matrícula:</label>
            <input
              type="text"
              value={bascuMatricula}
              onChange={handleMatriculaChange}
              className="mb-2 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Cliente:</label>
            <input
              type="text"
              value={bascuCliente}
              onChange={handleClienteChange}
              className="mb-2 p-2 border rounded"
              required
            />
            {suggestions.length > 0 && (
              <div className="border rounded bg-white shadow-md">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label>Fecha de entrada:</label>
            <input
              type="datetime-local"
              value={bascuFechaEntrada}
              onChange={handleFechaEntradaChange}
              className="mb-2 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Fecha de salida:</label>
            <input
              type="datetime-local"
              value={bascuFechaSalida}
              onChange={handleFechaSalidaChange}
              className="mb-2 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Pesaje inicial:</label>
            <input
              type="number"
              value={bascuPesajeInicial}
              onChange={handlePesajeInicialChange}
              className="mb-2 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Pesaje final:</label>
            <input
              type="number"
              value={bascuPesajeFinal}
              onChange={handlePesajeFinalChange}
              className="mb-2 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Pesaje total:</label>
            <input
              type="number"
              value={bascuPesajeTotal}
              onChange={handlePesajeTotalChange}
              className="mb-2 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Parking asignado:</label>
            <select
              value={bascuParking}
              onChange={handleParkingChange}
              className="mb-2 p-2 border rounded"
              required
            >
              <option value="Parking 1">Parking 1</option>
              <option value="Parking 2">Parking 2</option>
              <option value="Parking 3">Parking 3</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label>Tipo de residuo:</label>
            <select
              value={bascuResiduo}
              onChange={handleResiduoChange}
              className="mb-2 p-2 border rounded"
              required
            >
              <option value="Residuo 1">Residuo 1</option>
              <option value="Residuo 2">Residuo 2</option>
              <option value="Residuo 3">Residuo 3</option>
            </select>
          </div>
          <div className="flex items-end space-x-5 col-span-3">
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white rounded py-2 px-4"
            >
              Guardar
            </button>
            <button
              onClick={handleReset}
              className="bg-orange-400 text-white rounded py-2 px-4"
            >
              Resetear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
