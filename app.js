const inventoryTable = document.querySelector("#inventoryTable tbody");
const searchBar = document.querySelector("#searchBar");
const form = document.querySelector("#inventoryForm");

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let editIndex = null;

// Agregar o actualizar accesorio
if (form) {
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
        saveInventory();
        renderTable();
    });
}

// Renderizar la tabla
function renderTable(filter = "") {
    inventoryTable.innerHTML = "";
    inventory
        .filter(item => item.model.toLowerCase().includes(filter.toLowerCase()))
        .forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td data-label="Tipo">${item.productType}</td>
                <td data-label="Modelo">${item.model}</td>
                <td data-label="Accesorio">${item.accessoryType}</td>
                <td data-label="Diseño">${item.design}</td>
                <td data-label="Cantidad">${item.quantity}</td>
                ${form ? `
                <td>
                    <button onclick="editAccessory(${index})">Editar</button>
                    <button onclick="deleteAccessory(${index})">Eliminar</button>
                </td>` : ""}
            `;
            inventoryTable.appendChild(row);
        });
}

// Guardar inventario en localStorage
function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Editar accesorio
function editAccessory(index) {
    const item = inventory[index];
    document.querySelector("#productType").value = item.productType;
    document.querySelector("#model").value = item.model;
    document.querySelector("#accessoryType").value = item.accessoryType;
    document.querySelector("#design").value = item.design;
    document.querySelector("#quantity").value = item.quantity;
    editIndex = index;
}

// Eliminar accesorio
function deleteAccessory(index) {
    inventory.splice(index, 1);
    saveInventory();
    renderTable();
}

// Filtrar resultados
if (searchBar) {
    searchBar.addEventListener("input", e => {
        renderTable(e.target.value);
    });
}

// Renderizar tabla al cargar
renderTable();
