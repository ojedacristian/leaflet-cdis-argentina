import { icons } from './components/icons.js'
import { loadControls } from './components/controls/controls.js'

const parentGroup = L.markerClusterGroup();
const CDI = L.featureGroup.subGroup(parentGroup);
const CDR = L.featureGroup.subGroup(parentGroup);
const CIC = L.featureGroup.subGroup(parentGroup);
const HUE = L.featureGroup.subGroup(parentGroup);
const IM = L.featureGroup.subGroup(parentGroup);
const MAY = L.featureGroup.subGroup(parentGroup);
const ANP = L.featureGroup.subGroup(parentGroup);
const MDC = L.featureGroup.subGroup(parentGroup);
const CDIN = L.featureGroup.subGroup(parentGroup);
const subGroups = [CDI, CDR, CIC, HUE, IM, MAY, ANP, MDC, CDIN,]

const spreadsheetIDMDS = "1gBBlBkU2nMio5MV_qadALPZSRR-SSLQ6zWPNRNTj5ms";
const spreadsheetIDSSPIN = "1YwWUH_qOs0ZS6lyOuMzIapvVNhZxe9sSXh66zkxIzTA";
const query = encodeURIComponent(
  " Select * where N = 'CDIN' "  //  "Select * where N = 'CIC' OR N= 'CDI' OR N= 'CDR' OR N='CDIN' "
);
const url = `https://docs.google.com/spreadsheets/d/${spreadsheetIDSSPIN}/gviz/tq? ${'&tq=' + query}`

// Buscamos los datos Json de Google
fetch(url)
  .then((res) => res.text())
  .then((rep) => {
    const data = JSON.parse(rep.substr(47).slice(0, -2));
    console.log(data);
    const entry = data.table.rows;
    const amount = entry.length;
    let i;
    for (i = 0; i < amount; i++) {
      // console.log("Latitud", entry[i].c[9]?.v || "null");
      let lat = entry[i].c[9]?.v || "";
      let lon = entry[i].c[10]?.v || "";
      //let titulo = entry[i]["gsx$titulo"]["$t"];
      let categoria = entry[i].c[1]?.v || "";
      let articulador = entry[i].c[2]?.v || "";
      //let provincia = entry[i]["gsx$provincia"]["$t"];
      //let localidad = entry[i]["gsx$localidad"]["$t"];
      let dir = entry[i].c[3]?.v || "";
      let email = entry[i].c[6]?.v || "";
      let tel = entry[i].c[4]?.v || "";
      let web = entry[i].c[12]?.v || "";
      let cat = entry[i].c[13]?.v || "";
      let expte = entry[i].c[14]?.v || "";
      let btnWeb =
        web === ""
          ? ""
          : '<a target="_blank" href="' + web + '">Conocé más</a>';
      L.marker([lat, lon], { icon: icons[cat] })
        .bindPopup(`
        <p>${categoria}</p> 
          <h4>${articulador}</h4> 
          <p> ${dir}</p> 
          <p> ${email}</p> 
          <p> ${tel}</p> 
          <p> ${expte}</p> 
          ${btnWeb} 
          <p><a target="_blank" href="https://www.argentina.gob.ar/desarrollosocial/sumainformacion">Sumá información</a></p>
        `
        )
        .addTo(eval(cat));
    }
  });

// Estilos
/* var mapboxUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3Jpc3RpYW5vamVkYSIsImEiOiJjazVzNWRnczcwa2c0M2ttcXpzNzl6aGV1In0.weNfOTYnFN4OOCj0pye69g";
var streets = L.tileLayer(mapboxUrl, {
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1
});
var satellite = L.tileLayer(mapboxUrl, {
  id: "cristianojeda/ck5wlrbjg042x1in6xgq6dop9",
  tileSize: 512,
  zoomOffset: -1
});
*/
const mapa = L.tileLayer("https://gis.argentina.gob.ar/osm/{z}/{x}/{y}.png", {
  attribution:
    '&copy; Contribuidores <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const map = L.map("map", { layers: [mapa, CDI] }).setView([-40.44, -63.59], 4.5);
parentGroup.addTo(map);
subGroups.map(sub => sub.addTo(map))

const baseMaps = {
  Mapa: mapa
};

const overlayMaps = {
  //"Centros de Desarrollo Infantil": CDI,
  //"Centros de Referencia": CDR,
  //"Centros Integradores Comunitarios": CIC,
  "Centros Nuevos": CDIN
};

loadControls(subGroups) // MostrarOcultar Todos - Ampliar - Ubicacion

L.control.ubicacion({ position: "bottomright" }).addTo(map);
L.control.ampliar({ position: "bottomright" }).addTo(map);
L.control.mostrar({ position: "topright" }).addTo(map);

L.control
  .layers(baseMaps, overlayMaps, {
    collapsed: window.screen.width < 800 ? true : false,
    hideSingleBase: true
  })
  .addTo(map);
