import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import Invoice from "./Invoice";
import { PDFDownloadLink, BlobProvider, pdf } from "@react-pdf/renderer";
import MonthlyInvoice from "./MonthlyInvoice";

moment.locale("es");

export default function Registro() {
  const [registros, setRegistros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("cliente");
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [showPDF, setShowPDF] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    try {
      const response = await axios.get(`http://localhost:8055/items/bascula`);
      const sortedRegistros = response.data.data.sort(
        (a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada)
      );
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
    if (event.target.value !== "cliente") {
      setFilterMonth("");
    }
  };

  const handleFilterMonthChange = (event) => {
    setFilterMonth(event.target.value);
  };

  const handleViewMore = (registro) => {
    setSelectedRegistro(registro);
    document.getElementById("my_modal_4").showModal();
  };

  const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8055/files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.id; // Devuelve el ID del archivo subido
    } catch (error) {
      console.error("Error al subir el archivo PDF:", error);
      throw error;
    }
  };

  const updateRegistroEstado = async (registro) => {
    try {
      console.log("Actualizando estado del registro:", registro);
      const response = await axios.patch(
        `http://localhost:8055/items/bascula/${registro.id}`,
        { estado: "Facturado" }
      );

      setTimeout(() => {
        setRegistros((prevRegistros) =>
          prevRegistros.map((reg) =>
            reg.id === registro.id ? { ...reg, estado: "Facturado" } : reg
          )
        );
      }, 5000);
    } catch (error) {
      console.error("Error al actualizar el estado del registro:", error);
    }
  };

  const handleGenerateFactura = async (registro) => {
    console.log("Generando factura para:", registro);
    setShowPDF(registro);

    await updateRegistroEstado(registro);

    try {
      // Usar BlobProvider para obtener el blob del PDF
      const { url } = await new Promise((resolve, reject) => {
        <BlobProvider document={<Invoice registro={registro} />}>
          {({ blob, url, loading, error }) => {
            if (loading) return;
            if (error) reject(error);
            resolve({ blob, url });
          }}
        </BlobProvider>;
      });

      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `Factura_${registro.cliente}_${moment(registro.fecha_entrada).format(
          "YYYYMMDD"
        )}.pdf`,
        { type: "application/pdf" }
      );

      console.log("PDF generado y preparado para subir:", file);

      // Subir el archivo PDF a Directus y obtener el ID del archivo
      const fileId = await uploadPDF(file);

      console.log("ID del archivo subido:", fileId);

      // Guardar la factura en Directus
      await saveFactura(registro, fileId);

      // Actualizar el estado del registro en la base de datos
      await updateRegistroEstado(registro);

      console.log("Factura generada y estado actualizado");
    } catch (error) {
      console.error("Error al generar la factura:", error);
    }
  };

  const saveFactura = async (registro, fileId) => {
    try {
      const facturaData = {
        estado: "No pagada", // Puedes ajustar esto según tu lógica
        factura: fileId, // Guardar el ID del archivo PDF generado
        empresa: registro.cliente,
        fecha: new Date().toISOString(),
      };

      const response = await axios.post(
        "http://localhost:8055/items/factura",
        facturaData
      );
      console.log("Factura guardada:", response.data);
    } catch (error) {
      console.error("Error al guardar la factura:", error);
    }
  };

  const filteredRegistros = registros.filter((registro) => {
    if (!registro.pesaje_total) {
      return false;
    }
    if (filterType === "cliente") {
      const clienteMatch = registro.cliente.toLowerCase().includes(searchTerm.toLowerCase());
      const monthMatch = filterMonth ? moment(registro.fecha_entrada).format("YYYY-MM") === filterMonth : true;
      return clienteMatch && monthMatch;
    } else if (filterType === "mes") {
      return moment(registro.fecha_entrada)
        .format("MMMM")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (filterType === "residuo") {
      return registro.residuo.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const filteredSearchRegistros = registros.filter((registro) => {
    if (!registro.pesaje_total) {
      return false;
    }
    if (filterType === "cliente") {
      const clienteMatch = registro.cliente.toLowerCase().includes(searchTerm.toLowerCase());
      const monthMatch = moment(registro.fecha_entrada).format("YYYY-MM") === filterMonth;
      return clienteMatch && monthMatch;
    }
    return true;
  });
  

  // Paginación de registros filtrados
  const paginatedRegistros = filteredRegistros.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const groupedRegistros = paginatedRegistros.reduce((acc, registro) => {
    const date = moment(registro.fecha_entrada).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(registro);
    return acc;
  }, {});

  const handleGenerateMonthlyFactura = async (cliente, month) => {
    const registrosCliente = registros.filter(
      (registro) => registro.cliente === cliente && moment(registro.fecha_entrada).format("YYYY-MM") === month
    );

    if (registrosCliente.length === 0) {
      console.warn("No hay registros para este cliente en el mes seleccionado.");
      return;
    }

    setShowPDF({ cliente, month, registros: registrosCliente });

    try {
      const { url } = await new Promise((resolve, reject) => {
        const blob = pdf(
          <MonthlyInvoice registros={registrosCliente} cliente={cliente} month={month} />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        resolve({ url });
      });

      const link = document.createElement("a");
      link.href = url;
      link.download = `Factura_Mensual_${cliente}_${month}.pdf`;
      link.click();
    } catch (error) {
      console.error("Error al generar la factura mensual:", error);
    }
  };

  const totalPages = Math.ceil(filteredRegistros.length / pageSize);

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
          <option value="residuo">Filtrar por Residuo</option>
          </select>
        <input
          type="text"
          placeholder="Buscar ..."
          className="flex-1 py-2 px-4 rounded-lg border-2 border-black"
          value={searchTerm}
          onChange={handleSearch}
        />
        {filterType === "cliente" && (
          <input
            type="month"
            placeholder="Mes"
            className="py-2 px-4 rounded-lg border-2 border-black ml-4"
            value={filterMonth}
            onChange={handleFilterMonthChange}
          />
        )}
        {filterType === "cliente" && (
          <button
            onClick={() => handleGenerateMonthlyFactura(searchTerm, filterMonth)}
            className="py-2 px-4 bg-green-900 text-white rounded-lg ml-4"
          >
            Generar Factura Mensual
          </button>
        )}
      </div>
      <div className="flex flex-col">
        {Object.keys(groupedRegistros).map((date) => (
          <div key={date} className="mb-5">
            <h3 className="text-lg font-bold mb-2">
              {moment(date).format("LL")}
            </h3>
            {groupedRegistros[date].map((registro) => (
              <div
                key={registro.id}
                className="bg-green-300 mb-2 mr-2 py-4 px-6 rounded-lg flex-1 flex flex-row justify-between"
              >
                <div className="flex-1 min-w-[150px] mr-2">
                  <small>Cliente</small>
                  <div className="font-bold truncate">{registro.cliente}</div>
                </div>
                <div className="flex-1 min-w-[150px] mr-2">
                  <small>Matrícula</small>
                  <div className="font-bold truncate">{registro.matricula}</div>
                </div>
                <div className="flex-1 min-w-[150px] mr-2">
                  <small>Pesaje Total</small>
                  <div className="font-bold truncate">
                    {registro.pesaje_total}
                  </div>
                </div>
                <div className="flex-1 min-w-[150px] mr-2">
                  <small>Estado</small>
                  <div className="font-bold truncate">{registro.estado}</div>
                </div>
                <div className="flex-none">
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded-lg mr-2 mt-1.5"
                    onClick={() => handleViewMore(registro)}
                  >
                    Ver más
                  </button>
                  {showPDF === registro ? (
                    <PDFDownloadLink
                      document={<Invoice registro={registro} />}
                      fileName={`Factura_${registro.cliente}_${moment(
                        registro.fecha_entrada
                      ).format("YYYYMMDD")}.pdf`}
                      className="bg-green-900 text-white py-1 px-2 rounded-lg"
                    >
                      Descargar PDF
                    </PDFDownloadLink>
                  ) : (
                    <button
                      className="bg-green-900 text-white py-1 px-2 rounded-lg"
                      onClick={() => handleGenerateFactura(registro)}
                    >
                      Generar Factura
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <button
            className="bg-green-700 text-white py-1 px-2 rounded-lg ml-20"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>
          <div>
            Página {page} de {totalPages}
          </div>
          <button
            className="bg-green-700 text-white py-1 px-2 rounded-lg mr-20"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
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
                <div>
                  <small>Parking</small>
                  <div>{selectedRegistro.parking}</div>
                </div>
                <div>
                  <small>Estado</small>
                  <div>{selectedRegistro.estado}</div>
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
