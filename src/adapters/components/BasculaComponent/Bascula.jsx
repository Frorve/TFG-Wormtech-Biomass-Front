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
  const [id, setId] = useState(null);

  const [registrosPendientes, setRegistrosPendientes] = useState(() => {
    const storedPendientes = localStorage.getItem("registrosPendientes");
    return storedPendientes ? JSON.parse(storedPendientes) : [];
  });

  const updateLocalStorage = () => {
    const currentData = localStorage.getItem("registrosPendientes");
    const newData = JSON.stringify(registrosPendientes);

    if (currentData !== newData) {
      localStorage.setItem("registrosPendientes", newData);
    }
  };

  function getCurrentTimeInSpain() {
    const now = new Date();
    const offset = 2;
    now.setHours(now.getHours() + offset);
    return now.toISOString();
  }

  useEffect(() => {
    const fetchRegistrosBascula = async () => {
      try {
        const response = await axios.get("http://localhost:8055/items/bascula");
        const basculaRecords = response.data.data;

        // Filtra los registros pendientes (sin fecha de salida)
        const pendingRecords = basculaRecords.filter(
          (record) => !record.fecha_salida
        );
        setRegistrosPendientes(pendingRecords);
      } catch (error) {
        console.error("Error al obtener los registros de báscula:", error);
      }
    };

    fetchRegistrosBascula();
  }, []);

  useEffect(() => {
  }, [registrosPendientes]);

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
    setId(null);
  };

  const handleSuggestionClick = (suggestion) => {
    setBascuCliente(suggestion.nombre);
    setSuggestions([]);
  };

  const handleMatriculaChange = (event) => {
    setBascuMatricula(event.target.value);
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
    const fechaActual = getCurrentTimeInSpain();
    try {
      const basculaInfo = {
        matricula: bascuMatricula,
        cliente: bascuCliente,
        fecha_entrada: fechaActual,
        pesaje_inicial: bascuPesajeInicial,
        parking: bascuParking,
        residuo: bascuResiduo,
      };

      const response = await axios.post(
        "http://localhost:8055/items/bascula",
        basculaInfo
      );
      if (response.status === 200) {
        setEntradaRegistrada(true);
        setId(response.data.data.id);
        const updatedPendingRecords = registrosPendientes.filter(
          (record) => record.id !== id
        );
        setRegistrosPendientes(updatedPendingRecords);
        updateLocalStorage();
        handleReset();
        console.log("Entrada registrada con éxito.");
      }
    } catch (error) {
      console.error("Error al registrar la entrada:", error);
    }
  };

  const handleRegistroSalida = async () => {
    const fechaActual = getCurrentTimeInSpain();
    try {
      const basculaInfo = {
        matricula: bascuMatricula,
        cliente: bascuCliente,
        fecha_salida: fechaActual,
        pesaje_final: bascuPesajeFinal,
        pesaje_total: bascuPesajeTotal,
      };

      const response = await axios.patch(
        `http://localhost:8055/items/bascula/${id}`,
        basculaInfo
      );
      if (response.status === 200) {
        setSalidaRegistrada(true);
        setRegistrosPendientes(
          registrosPendientes.filter((registro) => registro.id !== id)
        );
        const updatedPendingRecords = registrosPendientes.filter(
          (record) => record.id !== id
        );
        setRegistrosPendientes(updatedPendingRecords);
        handleReset();
        console.log("Salida registrada con éxito.");
      }
    } catch (error) {
      console.error("Error al registrar la salida:", error);
    }
  };
  const handleRegistroPendienteClick = (registro) => {
    setBascuCliente(registro.cliente);
    setBascuMatricula(registro.matricula);
    setBascuFechaEntrada(registro.fecha_entrada);
    setBascuPesajeInicial(registro.pesaje_inicial);
    setBascuParking(registro.parking);
    setBascuResiduo(registro.residuo);
    setId(registro.id);
    setEntradaRegistrada(true);
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
              disabled={!entradaRegistrada || salidaRegistrada}
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
              <option value="Residuo 1 - Restos vegetales">
                Residuo 1 - Restos vegetales
              </option>
              <option value="Residuo 2 - Material de construcción">
                Residuo 2 - Material de construcción
              </option>
              <option value="Residuo 3 - Plástico">Residuo 3 - Plástico</option>
              <option value="Residuo 4 - Tierra">Residuo 4 - Tierra</option>
              <option value="Residuo 5 - Mezcla de residuos">
                Residuo 5 - Mezcla de residuos
              </option>
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
              disabled={!entradaRegistrada || salidaRegistrada}
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
        <div className="mt-6">
          <h2 className="bg-green-600 text-white rounded py-2 px-4 text-center">
            <strong>Registros Pendientes</strong>
          </h2>
          <ul className="mt-2">
            {registrosPendientes.map((registro) => (
              <li
                key={registro.id}
                onClick={() => handleRegistroPendienteClick(registro)}
                className="cursor-pointer bg-green-300 mb-2 py-4 px-6 rounded-lg flex items-center justify-between"
              >
                <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                  Matrícula:
                </span>
                <strong>{registro.matricula}</strong>
                <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                  Cliente:
                </span>
                <strong>{registro.cliente}</strong>
                <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                  Fecha de entrada:
                </span>
                <strong>{registro.fecha_entrada}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
