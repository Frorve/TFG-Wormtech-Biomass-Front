import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";


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
  const [userCreatedMessage, setUserCreatedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    fetchRegistrosBascula();
  }, []);

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
      if (bascuResiduo === "Compost") {
        setBascuPesajeTotal(final - inicial);
      } else {
        setBascuPesajeTotal(inicial - final);
      }
    } else {
      setBascuPesajeTotal("");
    }
  }, [bascuPesajeInicial, bascuPesajeFinal, bascuResiduo]);

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

  const validateForm = () => {
    if (bascuResiduo === "") {
      setErrorMessage("Por favor, seleccione una opción válida para residuo.");
      setTimeout(() => setErrorMessage(""), 3000);
      return false;
    }
    if (bascuResiduo !== "Compost" && bascuParking === "") {
      setErrorMessage("Por favor, seleccione una opción válida para parking.");
      setTimeout(() => setErrorMessage(""), 3000);
      return false;
    }
    return true;
  };

  const handleRegistroEntrada = async () => {
    if (!validateForm()) return;
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

      if (bascuMatricula.trim() === "") {
        Swal.fire({
          title: "Error",
          text: "Por favor, completa el campo de Matrícula.",
          icon: "error",
        });
        return;
      } else if (bascuCliente.trim() === "") {
        Swal.fire({
          title: "Error",
          text: "Por favor, completa el campo de Cliente.",
          icon: "error",
        });
        return;
      } else if (bascuPesajeInicial.trim() === "") {
        Swal.fire({
          title: "Error",
          text: "Por favor, completa el campo de Pesaje Inicial.",
          icon: "error",
        });
        return;
      }

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
        fetchRegistrosBascula();
        handleReset();
        setUserCreatedMessage("Registro de entrada creado correctamente");
        setTimeout(() => setUserCreatedMessage(""), 2000);
        console.log("Entrada registrada con éxito.");
      }
    } catch (error) {
      console.error("Error al registrar la entrada:", error);
      setErrorMessage("Error al crear el registro de entrada");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  const handleRegistroSalida = async () => {
    if (!validateForm()) return;
    if (bascuPesajeTotal < 0) {
      setErrorMessage("El pesaje total no puede ser negativo.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    const fechaActual = getCurrentTimeInSpain();
    try {
      const basculaInfo = {
        matricula: bascuMatricula,
        cliente: bascuCliente,
        fecha_salida: fechaActual,
        pesaje_final: bascuPesajeFinal,
        pesaje_total: bascuPesajeTotal,
        parking: bascuParking,
        residuo: bascuResiduo,
      };

      if (bascuMatricula.trim() === "") {
        Swal.fire({
          title: "Error",
          text: "Por favor, completa el campo de Matrícula.",
          icon: "error",
        });
        return;
      } else if (bascuCliente.trim() === "") {
        Swal.fire({
          title: "Error",
          text: "Por favor, completa el campo de Cliente.",
          icon: "error",
        });
        return;
      } else if (bascuPesajeInicial.trim() === "") {
        Swal.fire({
          title: "Error",
          text: "Por favor, completa el campo de Pesaje Inicial.",
          icon: "error",
        });
        return;
      } else if (bascuPesajeFinal.trim() === "") {
        Swal.fire({
          title: "Error",
          text: "Por favor, completa el campo de Pesaje Salida.",
          icon: "error",
        });
        return;
      }

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
        fetchRegistrosBascula();
        handleReset();
        setUserCreatedMessage("Registro de salida creado correctamente");
        setTimeout(() => setUserCreatedMessage(""), 2000);
        console.log("Salida registrada con éxito.");
      }
    } catch (error) {
      console.error("Error al registrar la salida:", error);
      setErrorMessage("Error al crear el registro de salida");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  const handleRegistroPendienteClick = (registro) => {
    setBascuCliente(registro.cliente);
    setBascuMatricula(registro.matricula);
    setBascuFechaEntrada(registro.fecha_entrada);
    setBascuPesajeInicial(registro.pesaje_inicial);
    setBascuParking(registro.parking);
    setBascuResiduo(registro.residuo);
    setEntradaRegistrada(true);
    setId(registro.id);
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
            <label>Pesaje salida:</label>
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
                <option value="">Seleccionar...</option>
                <option value="Parking 1 Residuos biodegradables">
                  Parking 1 - Residuos biodegradables
                </option>
                <option value="Parking 2 Material de construcción">
                  Parking 2 - Material de construcción
                </option>
                <option value="Parking 3 Plástico">Parking 3 - Plástico</option>
                <option value="Parking 4 Tierra y piedras">
                  Parking 4 - Tierra y piedras
                </option>
                <option value="Parking 5 Mezcla de residuos">
                  Parking 5 - Mezcla de residuos
                </option>
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
              <option value="">Seleccionar...</option>
              <option value="20 02 01 Residuos biodegradables">
                20 02 01 Residuos biodegradables
              </option>
              <option value="17 01 02 Material de construcción">
                17 01 02 Material de construcción
              </option>
              <option value="20 01 39 Plástico">20 01 39 Plástico</option>
              <option value="20 02 02 Tierra y piedras">
                20 02 02 Tierra y piedras
              </option>
              <option value="20 03 01 Mezcla de residuos">
                20 03 01 Mezcla de residuos
              </option>
              <option value="Compost">Compost</option>
            </select>
          </div>
          <div className="flex items-end space-x-5 col-span-3">
            {!entradaRegistrada && !salidaRegistrada && (
              <button
                onClick={handleRegistroEntrada}
                className="bg-green-500 text-white rounded py-2 px-4"
              >
                Registrar Entrada
              </button>
            )}
            {entradaRegistrada && !salidaRegistrada && (
              <button
                onClick={handleRegistroSalida}
                className="bg-green-900 text-white rounded py-2 px-4"
              >
                Registrar Salida
              </button>
            )}
            <button
              onClick={handleReset}
              className="bg-red-500 text-white rounded py-2 px-4"
            >
              Resetear
            </button>
          </div>
        </div>

        {userCreatedMessage && (
          <div role="alert" className="alert alert-success mt-5">
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

        {errorMessage && (
          <div role="alert" className="alert alert-error mt-5">
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

        <div className="mt-6">
          <h2 className="bg-green-600 text-white rounded py-2 px-4 text-center mb-6">
            <strong>Registros Pendientes</strong>
          </h2>
          <ul className="mt-2">
            {registrosPendientes.map((registro, index) => (
              <li
                key={registro.id}
                onClick={() => handleRegistroPendienteClick(registro)}
                className="cursor-pointer bg-green-300 mb-2 py-4 px-6 rounded-lg flex items-center justify-between"
              >
                <div className="flex-1 min-w-[100px] mr-2">
                  <span className="text-xs font-normal">N°:</span>
                  <strong className="block truncate">{index + 1}</strong>
                </div>
                <div className="flex-1 min-w-[100px] mr-2">
                  <span className="text-xs font-normal">Matrícula:</span>
                  <strong className="block truncate">
                    {registro.matricula}{" "}
                  </strong>
                </div>
                <div className="flex-1 min-w-[100px] mr-2">
                  <span className="text-xs font-normal">Cliente:</span>
                  <strong className="block truncate">{registro.cliente}</strong>
                </div>
                <div className="flex-1 min-w-[100px] mr-2">
                  <span className="text-xs font-normal">Fecha de entrada:</span>
                  <strong className="block truncate">
                    {registro.fecha_entrada}{" "}
                  </strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
