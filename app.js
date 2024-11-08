// buscamos el elemento de formulario

document.getElementById("apiForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const params = {
        baseUrl: document.getElementById("baseUrl").value,
        getAllEndpoint: document.getElementById("getAllEndpoint").value,
        insertEndpoint: document.getElementById("insertEndpoint").value,
        editEndpoint: document.getElementById("editEndpoint").value,
        deleteEndpoint: document.getElementById("deleteEndpoint").value,
    };

    // Intentamos obtener todos los productos
    const apiUrl = `${params.baseUrl}${params.getAllEndpoint}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        const data = await response.json();
        displayData(data, params);  // Mostrar productos en la tabla
    } catch (error) {
        alert("Error al obtener los datos: " + error.message);
    }
});

function displayData(data, params) {
    const apiResponse = document.getElementById("apiResponse");
    apiResponse.innerHTML = ""; // Limpiar la respuesta anterior

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    // Crear encabezados de la tabla
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // Agregar encabezados para los botones de acción
    ["Editar", "Borrar"].forEach(action => {
        const th = document.createElement("th");
        th.textContent = action;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // Crear filas de datos
    data.forEach(item => {
        const row = document.createElement("tr");

        Object.values(item).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        // Botón de editar
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.onclick = () => {
            const newName = prompt("Nuevo nombre del producto:", item.name);
            const newPrice = prompt("Nuevo precio del producto:", item.price);

            if (newName && newPrice) {
                editProduct(item.id, params, row, newName, newPrice);
            }
        };
        const editTd = document.createElement("td");
        editTd.appendChild(editButton);
        row.appendChild(editTd);

        // Botón de borrar
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Borrar";
        deleteButton.onclick = async () => {
            deleteProduct(item.id, params, row);
        };
        const deleteTd = document.createElement("td");
        deleteTd.appendChild(deleteButton);
        row.appendChild(deleteTd);

        table.appendChild(row);
    });

    apiResponse.appendChild(table);
}

// Función para insertar un nuevo producto
async function insertProduct() {
    const params = getParams();
    const apiUrl = `${params.baseUrl}${params.insertEndpoint}`;
    const newName = document.getElementById("newName").value;
    const newPrice = document.getElementById("newPrice").value;

    if (newName && newPrice) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, price: parseFloat(newPrice) })
            });
            
            if (response.ok) {
                alert("Producto insertado exitosamente.");
                // Opcionalmente recargar la lista de productos aquí
            } else {
                throw new Error("Error al insertar el producto");
            }
        } catch (error) {
            alert("Error al insertar el producto: " + error);
        }
    } else {
        alert("Por favor, rellena todos los campos.");
    }
}

// Función para editar un producto
async function editProduct(id, params, row, newName, newPrice) {
    const editUrl = `${params.baseUrl}${params.editEndpoint.replace("{id}", id)}`;
    try {
        const response = await fetch(editUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, price: parseFloat(newPrice) })
        });

        if (response.ok) {
            alert("Producto modificado exitosamente.");
            // Actualizar la tabla visualmente
            row.children[0].textContent = newName;
            row.children[1].textContent = newPrice;
        } else {
            alert("Producto no encontrado o error al modificar.");
        }
    } catch (error) {
        alert("Error al editar el producto: " + error);
    }
}

// Función para eliminar un producto
async function deleteProduct(id, params, row) {
    const deleteUrl = `${params.baseUrl}${params.deleteEndpoint.replace("{id}", id)}`;
    try {
        const response = await fetch(deleteUrl, { method: 'DELETE' });
        
        if (response.ok) {
            alert("Producto eliminado exitosamente.");
            row.remove();  // Eliminar la fila de la tabla visualmente
        } else {
            alert("Producto no encontrado o error al eliminar.");
        }
    } catch (error) {
        alert("Error al eliminar el producto: " + error);
    }
}

// Función auxiliar para obtener los parámetros del formulario de configuración
function getParams() {
    return {
        baseUrl: document.getElementById("baseUrl").value,
        getAllEndpoint: document.getElementById("getAllEndpoint").value,
        insertEndpoint: document.getElementById("insertEndpoint").value,
        editEndpoint: document.getElementById("editEndpoint").value,
        deleteEndpoint: document.getElementById("deleteEndpoint").value,
    };
}
