const inventoryTable = document.querySelector("#inventoryTable tbody");
const form = document.querySelector("#inventoryForm");
const searchBar = document.querySelector("#searchBar");
const addEditSection = document.querySelector(".add-edit-section");
const searchSection = document.querySelector(".search-section");
const addEditPageButton = document.querySelector("#addEditPageButton");
const searchPageButton = document.querySelector("#searchPageButton");
const saveToFileButton = document.querySelector("#saveToFileButton");
const loadFileInput = document.querySelector("#loadFileInput");

let inventory = [];
let editIndex = null;

// Cambiar entre páginas
function switchPage(targetPage) {
    if (targetPage === "addEdit") {
        addEditSection.classList.remove("hidden");
        searchSection.classList.add("hidden");
    } else if (targetPage === "search") {
        addEditSection.classList.add("hidden");
        searchSection.classList.remove("hidden");
    }
}

// Agregar o actualizar accesorio
document.querySelector("#addButton").addEventListener("click", () => {
    const productType = document.querySelector("#productType").value;
    const model = document.querySelector("#model").value.trim();
    const accessoryType = document.querySelector("#accessoryType").value;
    const design = document.querySelector("#design").value;
    const quantity = parseInt(document.querySelector("#quantity").value);

    if (!model || isNaN(quantity)) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const accessory = { productType, model, accessoryType, design, quantity };

    if (editIndex !== null) {
        inventory[editIndex] = accessory;
        editIndex = null;
    } else {
        inventory.push(accessory);
    }

    form.reset();
    renderTable();

    // Redirigir a la página de búsqueda
    switchPage("search");
});

// Renderizar la tabla
function renderTable() {
    inventoryTable.innerHTML = "";
    inventory.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.productType}</td>
            <td>${item.model}</td>
            <td>${item.accessoryType}</td>
            <td>${item.design}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="action-btn edit" onclick="editAccessory(${index})">Editar</button>
                <button class="action-btn delete" onclick="deleteAccessory(${index})">Eliminar</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });
}

// Editar accesorio
window.editAccessory = (index) => {
    const item = inventory[index];
    document.querySelector("#productType").value = item.productType;
    document.querySelector("#model").value = item.model;
    document.querySelector("#accessoryType").value = item.accessoryType;
    document.querySelector("#design").value = item.design;
    document.querySelector("#quantity").value = item.quantity;
    editIndex = index;

    // Cambiar a la página de agregar/editar
    switchPage("addEdit");
};

// Eliminar accesorio
window.deleteAccessory = (index) => {
    inventory.splice(index, 1);
    renderTable();
};

// Filtrar accesorios
searchBar.addEventListener("input", () => {
    const searchText = searchBar.value.toLowerCase();
    inventoryTable.innerHTML = "";
    inventory
        .filter(item => item.model.toLowerCase().includes(searchText))
        .forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.productType}</td>
                <td>${item.model}</td>
                <td>${item.accessoryType}</td>
                <td>${item.design}</td>
                <td>${item.quantity}</td>
                <td>
                    <button class="action-btn edit" onclick="editAccessory(${index})">Editar</button>
                    <button class="action-btn delete" onclick="deleteAccessory(${index})">Eliminar</button>
                </td>
            `;
            inventoryTable.appendChild(row);
        });
});

// Guardar inventario en archivo
saveToFileButton.addEventListener("click", () => {
    const data = inventory.map(item => `${item.productType},${item.model},${item.accessoryType},${item.design},${item.quantity}`).join("\n");
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" }); // UTF-8
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
});

// Leer archivo de inventario
loadFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const lines = event.target.result.split("\n");
        inventory = lines.map(line => {
            const [productType, model, accessoryType, design, quantity] = line.split(",");
            return { productType, model, accessoryType, design, quantity: parseInt(quantity) };
        });
        renderTable();
    };
    reader.readAsText(file, "utf-8"); // UTF-8
});

// Cambiar entre páginas con botones del menú
addEditPageButton.addEventListener("click", () => switchPage("addEdit"));
searchPageButton.addEventListener("click", () => switchPage("search"));

// Inicializar en la página de búsqueda
switchPage("search");
