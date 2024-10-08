import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import moment from "moment";
import logo from "../../../assets/logo.png";
import regular from "../../../fonts/Poppins-Regular.ttf";
import bold from "../../../fonts/Poppins-Bold.ttf";

Font.register({
  family: "Poppins",
  fonts: [{ src: regular }, { src: bold, fontWeight: "bold" }],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  datosEmpresa: {
    textAlign: "left",
    fontSize: 12,
  },
  datosCliente: {
    textAlign: "right",
    fontSize: 12,
  },
  facturaNumero: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  summaryTable: {
    marginTop: 20,
    display: "table",
    width: "auto",
  },
  summaryTableRow: {
    flexDirection: "row",
  },
  summaryTableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  summaryTableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  totalCell: {
    fontWeight: "bold",
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 5,
  },
  pago: {
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  cuenta: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});

const getPricePerTon = (residuo) => {
  const prices = {
    "20 02 01 Residuos biodegradables": 0.055,
    "17 01 02 Material de construcción": 0.014,
    "20 01 39 Plástico": 0.17,
    "20 02 02 Tierra y piedras": 0.012,
    "20 03 01 Mezcla de residuos": 0.2,
    Compost: 0.035,
  };
  return prices[residuo] || 0;
};

const generateInvoiceNumber = () => {
  return Math.floor(Math.random() * 1000000).toString(); 
};

const MonthlyInvoice = ({ registros, cliente, month }) => {
  const invoiceNumber = generateInvoiceNumber();

  const registrosCliente = registros.filter(
    (registro) => registro.cliente === cliente
  );

  const totalPesaje = registrosCliente.reduce(
    (acc, registro) => acc + registro.pesaje_total,
    0
  );

  const totalPrices = registrosCliente.map((registro) => {
    const pricePerTon = getPricePerTon(registro.residuo);
    return registro.pesaje_total * pricePerTon;
  });

  const totalPrice = totalPrices.reduce((acc, price) => acc + price, 0);
  const iva = totalPrice * 0.21;
  const totalWithIva = totalPrice + iva;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.datosEmpresa}>
            <Image style={styles.logo} src={logo} />
            <Text>Cuesta del Espino 16</Text>
            <Text>Granada - Padul, CP: 18640</Text>
            <Text>wormtech.biomass@correo.es</Text>
            <Text>B-77393991</Text>
          </View>
          <View>
            <Text style={styles.facturaNumero}>
              Número de factura: {invoiceNumber}
            </Text>
            <View style={styles.datosCliente}>
              <Text>Fecha: {moment().format("LL")}</Text>
              <Text>Cliente: {cliente}</Text>
              <Text>Mes: {moment(month).format("MMMM YYYY")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Descripción</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Cantidad</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Precio</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total</Text>
            </View>
          </View>
          {registrosCliente.map((registro) => (
            <View style={styles.tableRow} key={registro.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{registro.residuo}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{registro.pesaje_total} Kg</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {getPricePerTon(registro.residuo)} €/Kg
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {(
                    registro.pesaje_total * getPricePerTon(registro.residuo)
                  ).toFixed(2)}{" "}
                  €
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryTable}>
          <View style={styles.summaryTableRow}>
            <View style={styles.summaryTableCol}>
              <Text style={styles.summaryTableCell}>Importe</Text>
            </View>
            <View style={styles.summaryTableCol}>
              <Text style={styles.summaryTableCell}>
                {totalPrice.toFixed(2)} €
              </Text>
            </View>
          </View>
          <View style={styles.summaryTableRow}>
            <View style={styles.summaryTableCol}>
              <Text style={styles.summaryTableCell}>IVA (21%)</Text>
            </View>
            <View style={styles.summaryTableCol}>
              <Text style={styles.summaryTableCell}>{iva.toFixed(2)} €</Text>
            </View>
          </View>
          <View style={styles.summaryTableRow}>
            <View style={styles.summaryTableCol}>
              <Text style={[styles.summaryTableCell, styles.totalCell]}>
                Total
              </Text>
            </View>
            <View style={styles.summaryTableCol}>
              <Text style={[styles.summaryTableCell, styles.totalCell]}>
                {totalWithIva.toFixed(2)} €
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MonthlyInvoice;
