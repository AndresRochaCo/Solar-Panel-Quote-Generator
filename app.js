
// ===============================
// GLOBAL VARIABLES 
// ===============================



let degradationRate = 0;
let initialTarifa = 0;
let inflationRate = 0;
let costoWp = 0;

// ===============================
// INPUT VARIABLES
// ===============================



function updateFinancialInputs() {
  costoWp = parseFloat(
    document.getElementById("costWP").value
  ) || 0;




  initialTarifa = parseFloat(
    document.getElementById("tarifaInput").value
  ) || 0;


  
  inflationRate = parseFloat(
    document.getElementById("incrementoInput").value
  ) / 100 || 0;

 
}








// ===============================
// CONSUMPTION LOGIC
// ===============================

const monthInput = document.getElementById("month");
const kwhInput = document.getElementById("kwh");
const addBtn = document.getElementById("addConsumption");
const listContainer = document.getElementById("consumptionList");
const totalDisplay = document.getElementById("totalKwh");

let consumptions = [];

addBtn.addEventListener("click", () => {
  const month = monthInput.value.trim();
  const kwh = parseFloat(kwhInput.value);

  if (!month || isNaN(kwh)) return;

  const newEntry = {
    id: Date.now(),
    month,
    kwh
  };

  consumptions.push(newEntry);

  renderConsumptions();
  updateSystemSize();
 updateFinancialInputs();


  const { production } = updateTecDataTable();



generateProjection(
  production,
  
);



  

  monthInput.value = "";
  kwhInput.value = "";
});

function getTotalConsumption() {
  return consumptions.reduce((sum, c) => sum + c.kwh, 0);
}

function renderConsumptions() {
  listContainer.innerHTML = "";
  const total = getTotalConsumption();

  for (const consumption of consumptions) {
    const div = document.createElement("div");
    div.className = "ticket";
    div.textContent = `${consumption.month} - ${consumption.kwh} kWh`;
    listContainer.appendChild(div);
  }

  totalDisplay.textContent = total.toFixed(2);
}

// ===============================
// PANEL SELECT LOGIC
// ===============================

const solarPanels = [
  { id: "jam710", name: "Panel JA 710W", watts: 710 },
  { id: "yl710",  name: "Panel Yingli 710W", watts: 710 },
  { id: "jam625", name: "Panel JA 625W", watts: 625 }
];

const panelSelect = document.getElementById("solarPanelSelect");
const panelsDisplay = document.getElementById("panelsNeeded");

solarPanels.forEach(panel => {
  const option = document.createElement("option");
  option.value = panel.id;
  option.textContent = panel.name;
  option.dataset.watts = panel.watts;
  panelSelect.appendChild(option);
});


// ===============================
// CALCULATION LOGIC
// ===============================

function calculatePanelsNeeded() {
  const totalConsumption = getTotalConsumption();

  const selectedOption = panelSelect.options[panelSelect.selectedIndex];
  const panelWatts = parseFloat(selectedOption.dataset.watts);

  if (!panelWatts || totalConsumption === 0) return 0;

  const panels = ((totalConsumption / 1850) * 1000) / panelWatts;

  return Math.ceil(panels);
}

function updateSystemSize() {
  const panels = calculatePanelsNeeded();
  panelsDisplay.textContent = panels;


}




// ===============================
// POPULATING TABLE
// ===============================


    

    panelSelect.addEventListener("change", () => {
    updateSystemSize();
    updateTecDataTable();
});


function updateTecDataTable(){



    

    const systemSizeTableData = document.getElementById("systemSizeTable");
    const panels = calculatePanelsNeeded();
    
    const selectedOption = panelSelect.options[panelSelect.selectedIndex];
  const panelWatts = parseFloat(selectedOption.dataset.watts);

    const systemSize = panels * panelWatts;
    systemSizeTableData.textContent = systemSize;

    
    const wattsPanelTable = document.getElementById("wattsPanelTable");
    wattsPanelTable.textContent = panelWatts;

    const penelsNumberTable = document.getElementById("panelsNumberTable");
    penelsNumberTable.textContent = panels;


    const productionTable = document.getElementById("productionTable");

    const production = (systemSize * 1850)/1000;


    productionTable.textContent = production;


    const coverageTable = document.getElementById("coverageTable");

    

    coverageTable.textContent =
  ((production / getTotalConsumption()) * 100).toFixed(2);


    console.log("updateTecDataTable running");


    return{
      production: production,
      systemSize: systemSize
    };
}


function updateFinancialDataTable(systemSize){
  const costoSistema = systemSize * costoWp;

  document.getElementById("costoSistemaTable").textContent =
    costoSistema.toFixed(2);
}



// ===============================
// POPULATING TABLE
// ===============================



function generateProjection(production, degradationRate, initialTarifa, inflationRate) {

  




    const tableBody = document.getElementById("projectionTable");
    tableBody.innerHTML = "";

    let energy = production;          // start with original
    let retornoAcumulado = 0;
    let tarifa = initialTarifa;

    let rows = "";

    for (let year = 1; year <= 25; year++) {

        if (year > 1) {
            energy *= (1 - degradationRate);   // degrade production
            tarifa *= (1 + inflationRate);     // increase tarifa
        }

        const ahorro = energy * tarifa;
        retornoAcumulado += ahorro;

        rows += `
            <tr>
                <td>${year}</td>
                <td>${energy.toFixed(0)}</td>
                <td>${tarifa.toFixed(4)}</td>
                <td>$${ahorro.toFixed(2)}</td>
                <td>$${retornoAcumulado.toFixed(2)}</td>
            </tr>
        `;
    }

    tableBody.innerHTML = rows;
    console.log(tableBody);

}








