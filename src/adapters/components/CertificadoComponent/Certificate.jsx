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
import regular from "../../../fonts/Poppins-Regular.ttf";
import bold from "../../../fonts/Poppins-Bold.ttf";
import logo from "../../../assets/logo.png";

Font.register({
  family: "Poppins",
  fonts: [
    { src: regular }, 
    { src: bold, fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 15,
  },
  titulo: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Poppins",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  info: {
    fontSize: 8,
  },
});

const Certificate = ({ certificado }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Image style={styles.logo} src={logo} />
        </View>
        <View style={styles.header}>
          <Text style={styles.titulo}>
            CERTIFICADO DE VALORACIÓN DE RESIDUOS
          </Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Datos de la Obra</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Expediente: {certificado.expediente}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Municipio: {certificado.municipio}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Localización: {certificado.localizacion}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Periodo del Certificado</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Fecha de Inicio:{" "}
                  {moment(certificado.fecha_inicio).format("LL")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Fecha de Finalización:{" "}
                  {moment(certificado.fecha_finalizacion).format("LL")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Datos del Promotor</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Nombre: {certificado.nombre_promotor}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  CIF: {certificado.cif_promotor}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Dirección: {certificado.direccion_promotor}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  CP: {certificado.cp_promotor}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Municipio: {certificado.municipio_promotor}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Provincia: {certificado.provincia_promotor}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Datos del Constructor</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Nombre: {certificado.nombre_constructor}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  CIF: {certificado.cif_constructor}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Dirección: {certificado.direccion_constructor}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  CP: {certificado.cp_constructor}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Municipio: {certificado.municipio_constructor}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Provincia: {certificado.provincia_constructor}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Datos del Transportista</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Nombre: {certificado.nombre_transportista}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  CIF: {certificado.cif_transportista}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Dirección: {certificado.direccion_transportista}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  CP: {certificado.cp_transportista}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Municipio: {certificado.municipio_transportista}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  Provincia: {certificado.provincia_transportista}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.info}>
            Los escombros y restos de obra procedentes de la citada empresa han
            sido tratados en las instalaciones de Wormtech Biomass S. L.,
            siguiendo los principios básicos de la correcta gestión ambiental de
            los residuos (recuperación, reutilización y reciclaje), contenidos
            en las distintas disposiciones normativas establec¡das al efecto,
            Básicamente: Ley 2212011, de 28 de Julio, de residuos y suelos
            contaminados; Ley 7/2OO7, de 9 de Julio, de gestión integrada de la
            calidad ambiental (GICA); Real Decreto 105/2008, de 1 de Febrero,
            por el que se regula la producción y gestión de los residuos de
            construcción y demolición; Orden MAM 30412002, de 8 de Febrero, por
            la que se publican las operaciones de valorización y eliminación de
            residuos y la lista europea de residuos; Plan Estatal marco de
            Gestión de Residuos (PEMAR) 2016-2022, Decreto 73/2012, de 20 de
            Marzo, por el que se aprueba el Reglamento de Residuos de Andalucía
            y Decreto 3971/2010, de 2 de Noviembre, por el que se aprueba el
            Plan Director Territorial de Residuos No Peligrosos de Andalucía
            2010-2019
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Certificate;
