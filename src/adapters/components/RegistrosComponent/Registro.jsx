import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import 'moment/locale/es';

moment.locale('es');

export default function Registro() {
  const [registros, setRegistros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("cliente"); // Default filter type
  const [selectedRegistro, setSelectedRegistro] = useState(null);

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    try {
      const response = await axios.get("http://localhost:8055/items/bascula");
      const sortedRegistros = response.data.data.sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
      setRegistros(sortedRegistros);
    } catch (error) {
      console.error("Error fetching registros:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleViewMore = (registro) => {
    setSelectedRegistro(registro);
    document.getElementById("my_modal_4").showModal();
  };

  const filteredRegistros = registros.filter((registro) => {
    if (filterType === "cliente") {
      return registro.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterType === "mes") {
      return moment(registro.fecha_entrada).format("MMMM").toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const groupedRegistros = filteredRegistros.reduce((acc, registro) => {
    const date = moment(registro.fecha_entrada).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(registro);
    return acc;
  }, {});

  return (
    <div className="flex-1 p-5">
      <div className="flex items-center mb-5">
        <select
          value={filterType}
          onChange={handleFilterTypeChange}
          className="py-2 px-4 rounded-lg border-2 border-black mr-4"
        >
          <option value="cliente">Filtrar por Cliente</option>
          <option value="mes">Filtrar por Mes</option>
        </select>
        <input
          type="text"
          placeholder="Buscar ..."
          className="flex-1 py-2 px-4 rounded-lg border-2 border-black"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="flex flex-col">
        {Object.keys(groupedRegistros).map((date) => (
          <div key={date} className="mb-5">
            <h3 className="text-lg font-bold mb-2">{moment(date).format("LL")}</h3>
            {groupedRegistros[date].map((registro) => (
              <div
                key={registro.id}
                className="bg-green-300 mb-2 mr-2 py-4 px-6 rounded-lg flex-1 flex flex-row justify-between"
              >
                <div className="mr-2">
                  <small>Cliente</small>
                  <div className="font-bold">{registro.cliente}</div>
                </div>
                <div className="mr-2">
                  <small>Matrícula</small>
                  <div className="font-bold">{registro.matricula}</div>
                </div>
                <div className="mr-2">
                  <small>Pesaje Total</small>
                  <div className="font-bold">{registro.pesaje_total}</div>
                </div>
                <div>
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded-lg mr-2 mt-1.5"
                    onClick={() => handleViewMore(registro)}
                  >
                    Ver más
                  </button>
                  <button
                    className="bg-green-900 text-white py-1 px-2 rounded-lg mr-2 mt-1.5"
                    onClick={() => handleViewMore(registro)}
                  >
                    Generar factura
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          {selectedRegistro && (
            <>
              <h3 className="font-bold text-lg">Detalles del Registro</h3>
              <div className="grid grid-cols-4 gap-4 py-4">
                <div>
                  <small>Cliente</small>
                  <div className="font-bold">{selectedRegistro.cliente}</div>
                </div>
                <div>
                  <small>Matrícula</small>
                  <div className="font-bold">{selectedRegistro.matricula}</div>
                </div>
                <div>
                  <small>Fecha de Entrada</small>
                  <div>{selectedRegistro.fecha_entrada}</div>
                </div>
                <div>
                  <small>Fecha de Salida</small>
                  <div>{selectedRegistro.fecha_salida}</div>
                </div>
                <div>
                  <small>Pesaje Inicial</small>
                  <div>{selectedRegistro.pesaje_inicial}</div>
                </div>
                <div>
                  <small>Pesaje Final</small>
                  <div>{selectedRegistro.pesaje_final}</div>
                </div>
                <div>
                  <small>Pesaje Total</small>
                  <div>{selectedRegistro.pesaje_total}</div>
                </div>
                <div>
                  <small>Residuo</small>
                  <div>{selectedRegistro.residuo}</div>
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-error">Cerrar</button>
                </form>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
