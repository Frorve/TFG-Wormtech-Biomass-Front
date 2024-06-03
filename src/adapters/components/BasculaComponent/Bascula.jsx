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
  const [entradaRegistrada, setEntradaRegistrada] = useState(false);
  const [salidaRegistrada, setSalidaRegistrada] = useState(false);
  const [id, setId] = useState(null); // Nueva variable de estado para almacenar el ID de la operación de bascula

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

  useEffect(() => {
    // Calcula el pesaje total
    const inicial = parseFloat(bascuPesajeInicial);
    const final = parseFloat(bascuPesajeFinal);
    if (!isNaN(inicial) && !isNaN(final)) {
      setBascuPesajeTotal(inicial - final);
    } else {
      setBascuPesajeTotal("");
    }
  }, [bascuPesajeInicial, bascuPesajeFinal]);

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
    setEntradaRegistrada(false);
    setSalidaRegistrada(false);
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

  const handleRegistroEntrada = async () => {
    try {
      const basculaInfo = {
        matricula: bascuMatricula,
        cliente: bascuCliente,
        fecha_entrada: bascuFechaEntrada,
        pesaje_inicial: bascuPesajeInicial,
        parking: bascuParking,
        residuo: bascuResiduo,
      };

      const response = await axios.post("http://localhost:8055/items/bascula", basculaInfo);
      if (response.status === 200) {
        setEntradaRegistrada(true);
        setId(response.data.data.id); // Almacena el ID de la operación de bascula
        console.log(response.data.data.id);
        console.log("Entrada registrada con éxito.");
      }
    } catch (error) {
      console.error("Error al registrar la entrada:", error);
    }
  };

  const handleRegistroSalida = async () => {
    try {
      const basculaInfo = {
        matricula: bascuMatricula,
        cliente: bascuCliente,
        fecha_salida: bascuFechaSalida,
        pesaje_final: bascuPesajeFinal,
        pesaje_total: bascuPesajeTotal,
      };

      const response = await axios.patch(`http://localhost:8055/items/bascula/${id}`, basculaInfo);
      if (response.status === 200) {
        setSalidaRegistrada(true);
        console.log("Salida registrada con éxito.");
      }
    } catch (error) {
      console.error("Error al registrar la salida:", error);
    }
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
              disabled={!entradaRegistrada || salidaRegistrada} // Deshabilitar si no se ha registrado la entrada o ya se registró la salida
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
              disabled={!entradaRegistrada || salidaRegistrada} // Deshabilitar si no se ha registrado la entrada o ya se registró la salida
            />
          </div>
          <div className="flex flex-col">
            <label>Pesaje total:</label>
            <input
              type="number"
              value={bascuPesajeTotal}
              readOnly
              className="mb-2 p-2 border rounded bg-gray-200"
            />
          </div>
          {bascuResiduo !== "Compost" && (
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
          )}
          <div className="flex flex-col">
            <label>Tipo de residuo:</label>
            <select
              value={bascuResiduo}
              onChange={handleResiduoChange}
              className="mb-2 p-2 border rounded"
              required
            >
              <option value="RResiduo 1 - Restos vegetales">Residuo 1 - Restos vegetales</option>
              <option value="Residuo 2 - Material de construcción">Residuo 2 - Material de construcción</option>
              <option value="Residuo 3 - Plástico">Residuo 3 - Plástico</option>
              <option value="Residuo 4 - Tierra">Residuo 4 - Tierra</option>
              <option value="Residuo 5 - Mezcla de residuos">Residuo 5 - Mezcla de residuos</option>
              <option value="Compost">Compost</option>
            </select>
          </div>
          <div className="flex items-end space-x-5 col-span-3">
            <button
              onClick={handleRegistroEntrada}
              className="bg-green-500 text-white rounded py-2 px-4"
            >
              Registrar Entrada
            </button>
            <button
              onClick={handleRegistroSalida}
              className="bg-green-900 text-white rounded py-2 px-4"
              disabled={!entradaRegistrada || salidaRegistrada} // Deshabilitar si no se ha registrado la entrada o ya se registró la salida
            >
              Registrar Salida
            </button>
            <button
              onClick={handleReset}
              className="bg-red-500 text-white rounded py-2 px-4"
            >
              Resetear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
