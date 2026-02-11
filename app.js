const addEntryBtn = document.getElementById("addEntryBtn");
const input = document.getElementById("consumptionInput");
const ticket = document.getElementById("ticket");

let entries = [];


let totalConsumption = 0;

function renderTicket() {
  const total = entries.reduce((a, b) => a + b, 0);

  let output = "";
  output += "+---------------------------+\n";
  output += "|        CONSUMO(kWh)        |\n";
  output += "+---------------------------+\n";

  entries.forEach(v => {
    output += `|          ${v.toFixed(2).padStart(6)}            |\n`;
  });

  output += "+---------------------------+\n";
  output += `| TOTAL:${total.toFixed(2).padStart(10)} kwh/año   |\n`;
  output += "+---------------------------+\n";

  ticket.textContent = output;
  totalConsumption = total;
  return total;
}



const solarPanels = [
  { id: "jam710", name: "Panel JA 710W", watts: 710 },
  { id: "yl710",  name: "Panel Yingli 710W", watts: 710 },
  { id: "jam625", name: "Panel JA 625W", watts: 625 }
];

const solarSelect = document.getElementById("solarPanel");

// Populate select
solarPanels.forEach(panel => {
  const option = document.createElement("option");
  option.value = panel.id;
  option.textContent = panel.name;
  solarSelect.appendChild(option);
});



solarSelect.addEventListener("change", () => {
  const selectedId = solarSelect.value;
  if (!selectedId) return;

  const selectedPanel = solarPanels.find(panel => panel.id === selectedId);

  if (totalConsumption > 0) {
    const panelsNeeded = numberOfSolarPanels(totalConsumption, selectedPanel.watts);
    console.log("Panels needed:", panelsNeeded);

     document.getElementById("panelsNeededDisplay").textContent = `Se necesitan ${panelsNeeded} paneles`;

  }
});



addEntryBtn.addEventListener("click", () => {
  const value = parseFloat(input.value);
  if (isNaN(value) || value <= 0) return;

  entries.push(value);
  input.value = "";

  renderTicket();

  // Recalculate panels if a panel is already selected
  const selectedId = solarSelect.value;
  if (selectedId) {
    const selectedPanel = solarPanels.find(panel => panel.id === selectedId);
    const panelsNeeded = numberOfSolarPanels(totalConsumption, selectedPanel.watts);
    document.getElementById("panelsNeededDisplay").textContent = `Se necesitan ${panelsNeeded} paneles`;
  }
});





function numberOfSolarPanels(totalConsumption, wattsPerPanel, annualSunHours = 1850) {
    // Calculate kWh produced by 1 panel per year
    const panelProduction = (wattsPerPanel * annualSunHours) / 1000; // kWh/year per panel
    return Math.ceil(totalConsumption / panelProduction);

   
}



console.log(numberOfSolarPanels);









 const financialData = [
    { label: "Costo Wp", id: "costWp", value: 3897.60, step: 0.01, unit: "$" },
    { label: "Costo del sistema", id: "systemCost", value: 3897.60, step: 0.01, unit: "$" },
    { label: "TIR", id: "tir", value: 0.195, step: 0.001, unit: "$/kWh" },
    { label: "Retorno", id: "retorno", value: 0.195, step: 0.001, unit: "$/kWh" },
    { label: "Tarifa inicial CFE", id: "initialRate", value: 0.195, step: 0.001, unit: "$/kWh" },
    { label: "Incremento anual tarifa", id: "rateIncrease", value: 25, step: 1, unit: "%" },
    { label: "Consumo", id: "consumo", value: 0.195, step: 0.001, unit: "$/kWh" }
  ];


  const solarData = [
    { label: "# de paneles", id: "numPanels", value: 7, step: 1, unit: "pzas" },
    { label: "Watts por panel", id: "wattsPanel", value: 320, step: 1, unit: "W" },
    { label: "Tamaño del sistema", id: "systemSize", value: 2240, step: 1, unit: "W" },
    { label: "Horas de sol anuales", id: "annualSunHours", value: 1850, step: 1, unit: "h" },
    { label: "Degradación anual", id: "annualDegradation", value: 0.5, step: 0.1, unit: "%" },
    { label: "Producción anual", id: "annualProduction", value: 4592, step: 1, unit: "kWh" },
    { label: "Cubre el", id: "coverage", value: 109, step: 1, unit: "%" },
  ];