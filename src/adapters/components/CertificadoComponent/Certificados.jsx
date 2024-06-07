import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PDFDownloadLink, BlobProvider, pdf } from "@react-pdf/renderer";
import Certificate from "./Certificate";
import moment from "moment";

export default function Certificados() {
  const [certificados, setCertificados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("expediente");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCertificado, setSelectedCertificado] = useState(null);
  const [showPDF, setShowPDF] = useState(null);

  const handleViewMore = (certificado) => {
    setSelectedCertificado(certificado);
    document.getElementById("my_modal_4").showModal();
  };

  const [formData, setFormData] = useState({
    expediente: "",
    municipio: "",
    localizacion: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    nombre_promotor: "",
    cif_promotor: "",
    direccion_promotor: "",
    cp_promotor: "",
    municipio_promotor: "",
    provincia_promotor: "",
    nombre_constructor: "",
    cif_constructor: "",
    direccion_constructor: "",
    cp_constructor: "",
    municipio_constructor: "",
    provincia_constructor: "",
    nombre_transportista: "",
    cif_transportista: "",
    direccion_transportista: "",
    cp_transportista: "",
    municipio_transportista: "",
    provincia_transportista: "",
  });

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8055/items/certificado"
      );
      setCertificados(response.data.data);
    } catch (error) {
      console.error("Error fetching certificados:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const handleAddCertificado = () => {
    setFormData({
      expediente: "",
      municipio: "",
      localizacion: "",
      fecha_inicio: "",
      fecha_finalizacion: "",
      nombre_promotor: "",
      cif_promotor: "",
      direccion_promotor: "",
      cp_promotor: "",
      municipio_promotor: "",
      provincia_promotor: "",
      nombre_constructor: "",
      cif_constructor: "",
      direccion_constructor: "",
      cp_constructor: "",
      municipio_constructor: "",
      provincia_constructor: "",
      nombre_transportista: "",
      cif_transportista: "",
      direccion_transportista: "",
      cp_transportista: "",
      municipio_transportista: "",
      provincia_transportista: "",
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedCertificado(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8055/items/certificado", formData);
      setShowAddModal(false);
      fetchCertificados();

      Swal.fire({
        icon: "success",
        title: "¡Certificado guardado!",
        text: "El certificado se ha guardado correctamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el formulario. Por favor, inténtalo de nuevo más tarde.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const filteredCertificados = certificados.filter((certificado) =>
    certificado[searchField].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateCertificado = async (certificado) => {
    console.log("Generando certificado para:", certificado);
    setShowPDF(certificado);

    try {
      const { url } = await new Promise((resolve, reject) => {
        <BlobProvider document={<Certificate certificado={certificado} />}>
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
        `Certificado_${certificado.expediente}.pdf`,
        { type: "application/pdf" }
      );

      console.log("PDF generado y preparado para subir:", file);
    } catch (error) {
      console.error("Error al generar la certificacion:", error);
    }
  };

  return (
    <div className="flex-1 p-5">
      <div className="flex justify-between items-center mb-5">
        <button
          className="bg-green-500 text-white rounded-lg py-2 px-4 ml-0 mr-3"
          onClick={handleAddCertificado}
        >
          Crear Certificado
        </button>

        <select
          className="py-2 px-4 rounded-lg border-2 border-black mr-3"
          value={searchField}
          onChange={handleSearchFieldChange}
        >
          <option value="expediente">Expediente</option>
          <option value="nombre_promotor">Promotor</option>
          <option value="nombre_transportista">Transportista</option>
          <option value="municipio">Municipio</option>
        </select>

        <input
          type="text"
          placeholder="Buscar ..."
          className="flex-1 py-2 px-4 rounded-lg border-2 border-black"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div>
        {filteredCertificados.map((certificado) => (
          <div
            key={certificado.id}
            className="bg-green-300 mb-2 py-4 px-6 rounded-lg flex items-center justify-between"
          >
            <div className="flex-1 min-w-[150px] mr-2">
              <small>Nº Expediente</small>
              <div className="font-bold truncate">{certificado.expediente}</div>
            </div>
            <div className="flex-1 min-w-[150px] mr-2">
              <small>Promotor</small>
              <div className="font-bold truncate">
                {certificado.nombre_promotor}
              </div>
            </div>
            <div className="flex-1 min-w-[150px] mr-2">
              <small>Constructor</small>
              <div className="font-bold truncate">
                {certificado.nombre_constructor}
              </div>
            </div>
            <div className="flex-1 min-w-[150px] mr-2">
              <small>Transportista</small>
              <div className="font-bold truncate">
                {certificado.nombre_transportista}
              </div>
            </div>
            <div className="flex-none">
              <button
                className="bg-green-500 text-white py-1 px-2 rounded-lg mr-2 mt-1.5"
                onClick={() => handleViewMore(certificado)}
              >
                Ver más
              </button>
              {showPDF === certificado ? (
                <PDFDownloadLink
                  document={<Certificate certificado={certificado} />}
                  fileName={`Certificado_${certificado.expediente}.pdf`}
                  className="bg-green-900 text-white py-1 px-2 rounded-lg"
                >
                  Descargar PDF
                </PDFDownloadLink>
              ) : (
                <button
                  className="bg-green-900 text-white py-1 px-2 rounded-lg"
                  onClick={() => handleGenerateCertificado(certificado)}
                >
                  Generar Certificado
                </button>
              )}
            </div>
            <div></div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">Añadir Nuevo Certificado</h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-4 py-4"
            >
              <div>
                <label className="block">
                  <span className="text-gray-400">Expediente</span>
                  <input
                    type="text"
                    name="expediente"
                    value={formData.expediente}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Municipio</span>
                  <input
                    type="text"
                    name="municipio"
                    value={formData.municipio}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Localización</span>
                  <input
                    type="text"
                    name="localizacion"
                    value={formData.localizacion}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Fecha de Inicio</span>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Fecha de Finalización</span>
                  <input
                    type="date"
                    name="fecha_finalizacion"
                    value={formData.fecha_finalizacion}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              {/* Datos del Promotor */}
              <div>
                <label className="block">
                  <span className="text-gray-400">Nombre del Promotor</span>
                  <input
                    type="text"
                    name="nombre_promotor"
                    value={formData.nombre_promotor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">CIF del Promotor</span>
                  <input
                    type="text"
                    name="cif_promotor"
                    value={formData.cif_promotor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Dirección del Promotor</span>
                  <input
                    type="text"
                    name="direccion_promotor"
                    value={formData.direccion_promotor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">CP del Promotor</span>
                  <input
                    type="text"
                    name="cp_promotor"
                    value={formData.cp_promotor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Municipio del Promotor</span>
                  <input
                    type="text"
                    name="municipio_promotor"
                    value={formData.municipio_promotor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Provincia del Promotor</span>
                  <input
                    type="text"
                    name="provincia_promotor"
                    value={formData.provincia_promotor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              {/* Datos del Constructor */}
              <div>
                <label className="block">
                  <span className="text-gray-400">Nombre del Constructor</span>
                  <input
                    type="text"
                    name="nombre_constructor"
                    value={formData.nombre_constructor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">CIF del Constructor</span>
                  <input
                    type="text"
                    name="cif_constructor"
                    value={formData.cif_constructor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">
                    Dirección del Constructor
                  </span>
                  <input
                    type="text"
                    name="direccion_constructor"
                    value={formData.direccion_constructor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">CP del Constructor</span>
                  <input
                    type="text"
                    name="cp_constructor"
                    value={formData.cp_constructor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">
                    Municipio del Constructor
                  </span>
                  <input
                    type="text"
                    name="municipio_constructor"
                    value={formData.municipio_constructor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">
                    Provincia del Constructor
                  </span>
                  <input
                    type="text"
                    name="provincia_constructor"
                    value={formData.provincia_constructor}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              {/* Datos del Transportista */}
              <div>
                <label className="block">
                  <span className="text-gray-400">
                    Nombre del Transportista
                  </span>
                  <input
                    type="text"
                    name="nombre_transportista"
                    value={formData.nombre_transportista}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">CIF del Transportista</span>
                  <input
                    type="text"
                    name="cif_transportista"
                    value={formData.cif_transportista}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">
                    Dirección del Transportista
                  </span>
                  <input
                    type="text"
                    name="direccion_transportista"
                    value={formData.direccion_transportista}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">CP del Transportista</span>
                  <input
                    type="text"
                    name="cp_transportista"
                    value={formData.cp_transportista}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">
                    Municipio del Transportista
                  </span>
                  <input
                    type="text"
                    name="municipio_transportista"
                    value={formData.municipio_transportista}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">
                    Provincia del Transportista
                  </span>
                  <input
                    type="text"
                    name="provincia_transportista"
                    value={formData.provincia_transportista}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div className="modal-action col-span-2">
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
                <button type="submit" className="btn btn-success">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          {selectedCertificado && (
            <>
              <h3 className="font-bold text-lg">Detalles del Certificado</h3>
              <div className="grid grid-cols-4 gap-4 py-4">
                <div>
                  <small>Nº Expediente</small>
                  <div className="font-bold">
                    {selectedCertificado.expediente}
                  </div>
                </div>
                <div>
                  <small>Municipio</small>
                  <div className="font-bold">
                    {selectedCertificado.municipio}
                  </div>
                </div>
                <div>
                  <small>Localizacion</small>
                  <div className="font-bold">
                    {selectedCertificado.localizacion}
                  </div>
                </div>
                <div>
                  <small>Fecha Inicio</small>
                  <div>{selectedCertificado.fecha_inicio}</div>
                </div>
                <div>
                  <small>Fecha Finalizacion</small>
                  <div>{selectedCertificado.fecha_finalizacion}</div>
                </div>
                <div>
                  <small>Nombre Promotor</small>
                  <div className="font-bold">
                    {selectedCertificado.nombre_promotor}
                  </div>
                </div>
                <div>
                  <small>CIF Promotor</small>
                  <div>{selectedCertificado.cif_promotor}</div>
                </div>
                <div>
                  <small>Direccion Promotor</small>
                  <div>{selectedCertificado.direccion_promotor}</div>
                </div>
                <div>
                  <small>CP Promotor</small>
                  <div>{selectedCertificado.cp_promotor}</div>
                </div>
                <div>
                  <small>Municipio Promotor</small>
                  <div>{selectedCertificado.municipio_promotor}</div>
                </div>
                <div>
                  <small>Provincia Promotor</small>
                  <div>{selectedCertificado.provincia_promotor}</div>
                </div>
                <div>
                  <small>Nombre Constructor</small>
                  <div className="font-bold">
                    {selectedCertificado.nombre_constructor}
                  </div>
                </div>
                <div>
                  <small>CIF Constructor</small>
                  <div>{selectedCertificado.cif_constructor}</div>
                </div>
                <div>
                  <small>Direccion Constructor</small>
                  <div>{selectedCertificado.direccion_constructor}</div>
                </div>
                <div>
                  <small>CP Constructor</small>
                  <div>{selectedCertificado.cp_constructor}</div>
                </div>
                <div>
                  <small>Municipio Constructor</small>
                  <div>{selectedCertificado.municipio_constructor}</div>
                </div>
                <div>
                  <small>Provincia Constructor</small>
                  <div>{selectedCertificado.provincia_constructor}</div>
                </div>
                <div>
                  <small>Nombre Transportista</small>
                  <div className="font-bold">
                    {selectedCertificado.nombre_transportista}
                  </div>
                </div>
                <div>
                  <small>CIF Transportista</small>
                  <div>{selectedCertificado.cif_transportista}</div>
                </div>
                <div>
                  <small>Direccion Transportista</small>
                  <div>{selectedCertificado.direccion_transportista}</div>
                </div>
                <div>
                  <small>CP Transportista</small>
                  <div>{selectedCertificado.cp_transportista}</div>
                </div>
                <div>
                  <small>Municipio Transportista</small>
                  <div>{selectedCertificado.municipio_transportista}</div>
                </div>
                <div>
                  <small>Provincia Transportista</small>
                  <div>{selectedCertificado.provincia_transportista}</div>
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
