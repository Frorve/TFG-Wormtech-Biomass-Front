import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function Reports() {
  const [registros, setRegistros] = useState([]);
  const [selectedReportType, setSelectedReportType] = useState("daily");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchRegistros();
  }, []);

  useEffect(() => {
    generateReport();
  }, [selectedReportType, registros]);

  const fetchRegistros = async () => {
    try {
      const response = await axios.get("http://localhost:8055/items/bascula");
      setRegistros(response.data.data);
    } catch (error) {
      console.error("Error fetching registros:", error);
    }
  };

  const generateReport = () => {
    let report = [];
    const formatMap = {
      daily: "YYYY-MM-DD",
      monthly: "YYYY-MM",
      yearly: "YYYY",
    };
    const format = formatMap[selectedReportType];

    const groupedData = registros.reduce((acc, registro) => {
      const date = moment(registro.fecha_entrada).format(format);
      if (!acc[date]) {
        acc[date] = { totalKilos: 0, residuos: {} };
      }
      acc[date].totalKilos += registro.pesaje_total;
      if (!acc[date].residuos[registro.residuo]) {
        acc[date].residuos[registro.residuo] = 0;
      }
      acc[date].residuos[registro.residuo] += registro.pesaje_total;
      return acc;
    }, {});

    for (const [date, data] of Object.entries(groupedData)) {
      const mostDepositedResiduo = Object.entries(data.residuos).reduce(
        (max, [residuo, kilos]) => (kilos > max.kilos ? { residuo, kilos } : max),
        { residuo: "", kilos: 0 }
      );
      report.push({
        date,
        totalKilos: data.totalKilos,
        mostDepositedResiduo: mostDepositedResiduo.residuo,
        kilosResiduo: mostDepositedResiduo.kilos,
      });
    }

    setReportData(report);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Informes de Registros</h1>
      <div className="mb-5">
        <select
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
          className="py-2 px-4 rounded-lg border-2 border-black"
        >
          <option value="daily">Informe Diario</option>
          <option value="monthly">Informe Mensual</option>
          <option value="yearly">Informe Anual</option>
        </select>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Fecha</th>
            <th className="py-2 px-4 border-b">Total Kilos</th>
            <th className="py-2 px-4 border-b">Residuo Más Depositado</th>
            <th className="py-2 px-4 border-b">Kilos de Residuo</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((report, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{report.date}</td>
              <td className="py-2 px-4 border-b">{report.totalKilos}</td>
              <td className="py-2 px-4 border-b">{report.mostDepositedResiduo}</td>
              <td className="py-2 px-4 border-b">{report.kilosResiduo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
