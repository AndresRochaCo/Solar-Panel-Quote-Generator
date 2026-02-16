

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
  updateTecDataTable();

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

    production = (systemSize * 1850)/1000;


    productionTable.textContent = production;


    const coverageTable = document.getElementById("coverageTable");

    coverageTable.textContent = (((production * 100)/ 0.5)/100);

    console.log("updateTecDataTable running");
}








