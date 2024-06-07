import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Clientes() {
  const [empresas, setEmpresas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [clientData, setClientData] = useState({
    cif: "",
    nombre: "",
    telefono: "",
    email: "",
  });

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get("http://localhost:8055/items/empresa");
      setEmpresas(response.data.data);
    } catch (error) {
      console.error("Error fetching empresas:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewMore = (empresa) => {
    setSelectedEmpresa(empresa);
    setShowViewModal(true);
  };

  const handleEdit = (empresa) => {
    setSelectedEmpresa(empresa);
    setClientData({
      cif: empresa.cif,
      nombre: empresa.nombre,
      telefono: empresa.telefono,
      email: empresa.email,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Eliminar?",
      text: "¿Deseas eliminar este cliente?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8055/items/empresa/${id}`);
          setEmpresas(empresas.filter((empresa) => empresa.id !== id));
          Swal.fire({
            title: "Eliminado",
            text: "El cliente ha sido eliminado.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting cliente:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el cliente.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleAddClient = () => {
    setClientData({
      cif: "",
      nombre: "",
      telefono: "",
      email: "",
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8055/items/empresa", clientData, {
        // headers: {
        //     'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        // }
      });
      setShowAddModal(false);
      fetchEmpresas(); // Refrescar la lista de empresas después de añadir una nueva

      Swal.fire({
        icon: "success",
        title: "¡Empresa añadida!",
        text: "La empresa se ha añadido correctamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al añadir cliente:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al añadir la empresa. Por favor, inténtalo de nuevo más tarde.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8055/items/empresa/${selectedEmpresa.id}`,
        clientData,
        {
          // headers: {
          //     'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          // }
        }
      );
      setShowEditModal(false);
      fetchEmpresas(); // Refrescar la lista de empresas después de actualizar una

      Swal.fire({
        icon: "success",
        title: "¡Empresa actualizada!",
        text: "La empresa se ha actualizado correctamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al actualizar cliente:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la empresa. Por favor, inténtalo de nuevo más tarde.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-5">
      <div className="flex justify-between items-center mb-5">
        <button
          className="bg-green-500 text-white rounded-lg py-2 px-4 ml-0 mr-3"
          onClick={handleAddClient}
        >
          Añadir Cliente
        </button>

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
          <div
            key={empresa.id}
            className="bg-green-300 mb-2 py-4 px-6 rounded-lg flex items-center justify-between"
          >
            <strong>
              <span>{empresa.nombre}</span>
            </strong>
            <div>
              <button
                className="bg-green-500 text-white py-1 px-2 rounded-lg mr-2"
                onClick={() => handleViewMore(empresa)}
              >
                Ver más
              </button>
              <button
                className="bg-green-900 text-white py-1 px-2 rounded-lg mr-2"
                onClick={() => handleEdit(empresa)}
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

      {showAddModal && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">Añadir Nuevo Cliente</h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-4 py-4"
            >
              <div>
                <label className="block">
                  <span className="text-gray-400">CIF</span>
                  <input
                    type="text"
                    name="cif"
                    value={clientData.cif}
                    onChange={handleChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Nombre</span>
                  <input
                    type="text"
                    name="nombre"
                    value={clientData.nombre}
                    onChange={handleChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Teléfono</span>
                  <input
                    type="text"
                    name="telefono"
                    value={clientData.telefono}
                    onChange={handleChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={clientData.email}
                    onChange={handleChange}
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

      {showEditModal && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">Editar Cliente</h3>
            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-2 gap-4 py-4"
            >
              <div>
                <label className="block">
                  <span className="text-gray-400">CIF</span>
                  <input
                    type="text"
                    name="cif"
                    value={clientData.cif}
                    onChange={handleChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Nombre</span>
                  <input
                    type="text"
                    name="nombre"
                    value={clientData.nombre}
                    onChange={handleChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Teléfono</span>
                  <input
                    type="text"
                    name="telefono"
                    value={clientData.telefono}
                    onChange={handleChange}
                    className="input input-bordered input-sm w-full max-w-xs mt-1 block"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-400">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={clientData.email}
                    onChange={handleChange}
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
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {showViewModal && selectedEmpresa && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">Detalles del Cliente</h3>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <small>CIF</small>
                <div className="font-bold">{selectedEmpresa.cif}</div>
              </div>
              <div>
                <small>Nombre</small>
                <div className="font-bold">{selectedEmpresa.nombre}</div>
              </div>
              <div>
                <small>Teléfono</small>
                <div className="font-bold">{selectedEmpresa.telefono}</div>
              </div>
              <div>
                <small>Email</small>
                <div className="font-bold">
                  <a
                    href={`mailto:${selectedEmpresa.email}`}
                    className="font-bold"
                  >
                    {selectedEmpresa.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
