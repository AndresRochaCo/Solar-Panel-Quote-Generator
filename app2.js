
const monthInput = document.getElementById("month");
const kwhInput = document.getElementById("kwh");
const addBtn = document.getElementById("addConsumption");




let consumptions = [];

addBtn.addEventListener("click", () => {
const month = monthInput.value;
const kwh = parseFloat(kwhInput.value);
if (!month || !kwh) return;
const newEntry = {
id: Date.now(),
month,
kwh
};
consumptions.push(newEntry);
renderConsumptions();
monthInput.value = "";
kwhInput.value = "";
});




const listContainer = document.getElementById("consumptionList");
const totalDisplay = document.getElementById("totalKwh");



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




//Select Logic 

const solarPanels = [
    { id: "jam710", name: "Panel JA 710W", watts: 710 },
    { id: "yl710",  name: "Panel Yingli 710W", watts: 710 },
    { id: "jam625", name: "Panel JA 625W", watts: 625 }
  ];

const panelSelect = document.getElementById("solarPanelSelect");


  solarPanels.forEach(panel => {
    const option = document.createElement("option");
    option.value = panel.id;          // Use the ID as the value
    option.textContent = panel.name;  // Display name in dropdown
    option.dataset.watts = panel.watts; // Store watts for calculations later
    select.appendChild(option);
  });

  // Example: Get selected panel data
  select.addEventListener("change", () => {
    const selectedOption = select.options[select.selectedIndex];
    console.log("Selected Panel ID:", selectedOption.value);
    console.log("Selected Panel Name:", selectedOption.textContent);
    console.log("Watts:", selectedOption.dataset.watts);
  });





function calculatePanelsNeeded() {
  const totalConsumption = getTotalConsumption();

  const selectedOption = panelSelect.options[panelSelect.selectedIndex];
  const panelWatts = parseFloat(selectedOption.dataset.watts);

  if (!panelWatts || totalConsumption === 0) return 0;

  const panels = ((totalConsumption / 1850) * 1000) / panelWatts;

  return Math.ceil(panels);
}



addBtn.addEventListener("click", () => {
  const month = monthInput.value;
  const kwh = parseFloat(kwhInput.value);
  if (!month || isNaN(kwh)) return;

  const newEntry = {
    id: Date.now(),
    month,
    kwh
  };

  consumptions.push(newEntry);
  renderConsumptions();
  updateSystemSize(); // 👈 ADD THIS

  monthInput.value = "";
  kwhInput.value = "";
});


const panelsDisplay = document.getElementById("panelsNeeded");

function updateSystemSize() {
  const panels = calculatePanelsNeeded();
  panelsDisplay.textContent = panels;


  
}

