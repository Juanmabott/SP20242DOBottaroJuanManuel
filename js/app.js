// Array de personas (simulación de datos que ya existen)
let personas = [];
let vehiculos = []; // Definir la variable vehiculos

let personaEditada = null; // Para saber si estamos editando o agregando

// Función para cargar los datos en la tabla con opción de filtro
function cargarTabla(filtro = 'todos') {
    mostrarSpinner(); // Mostrar el spinner al comenzar a cargar la tabla

    const tbody = document.querySelector("#tabla-vehiculos tbody");
    const thead = document.querySelector("#tabla-vehiculos thead");

    // Verificar que tbody y thead existan
    if (!tbody || !thead) {
        console.error("El elemento tbody o thead no se encontró.");
        ocultarSpinner(); // Ocultar el spinner si hay un error
        return; // Salir si no se encuentran los elementos
    }

    tbody.innerHTML = ""; // Limpiar la tabla

    // Limpiar encabezados existentes
    thead.innerHTML = "<tr></tr>"; // Reinicia los encabezados

    // Obtener la visibilidad de las columnas
    const columnasVisibles = Array.from(document.querySelectorAll("#column-visibility input:checked"))
                                  .map(input => input.value);

    // Crear encabezados según las columnas visibles
    columnasVisibles.forEach(columna => {
        const th = document.createElement("th");
        const botonOrdenar = document.createElement("button");
        botonOrdenar.textContent = capitalizeFirstLetter(columna);
        botonOrdenar.classList.add("ordenar");
        botonOrdenar.id = columna;

        // Listener para ordenar al hacer clic en el botón
        botonOrdenar.addEventListener('click', function () {
            ordenarPorPropiedad(columna);
        });

        th.appendChild(botonOrdenar);
        thead.querySelector("tr").appendChild(th);
    });

    // Filtrar vehículos según el filtro seleccionado
    let vehiculosFiltrados = vehiculos;

    if (filtro === 'auto') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Auto);
    } else if (filtro === 'camion') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Camion);
    }

    // Cargar las filas en la tabla
    vehiculosFiltrados.forEach(vehiculo => {
        const fila = document.createElement("tr");

        // Crear celdas según las columnas visibles
        if (columnasVisibles.includes('id')) fila.appendChild(crearCelda(vehiculo.id));
        if (columnasVisibles.includes('modelo')) fila.appendChild(crearCelda(vehiculo.modelo));
        if (columnasVisibles.includes('anoFabricacion')) fila.appendChild(crearCelda(vehiculo.anoFabricacion));
        if (columnasVisibles.includes('velMax')) fila.appendChild(crearCelda(vehiculo.velMax));
        if (columnasVisibles.includes('cantidadPuertas')) fila.appendChild(crearCelda(vehiculo.cantidadPuertas || 'N/A'));
        if (columnasVisibles.includes('asientos')) fila.appendChild(crearCelda(vehiculo.asientos || 'N/A'));
        if (columnasVisibles.includes('capacidadCarga')) fila.appendChild(crearCelda(vehiculo.carga || 'N/A'));
        if (columnasVisibles.includes('autonomia')) fila.appendChild(crearCelda(vehiculo.autonomia || 'N/A'));

        // Agregar botón de eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("eliminar");
        btnEliminar.id = "eliminar";

        btnEliminar.addEventListener('click', () => eliminarVehiculo(vehiculo)); // Manejar el click para eliminar
        fila.appendChild(crearCelda(btnEliminar)); // Añadir botón a la fila

        // Agregar botón de modificar
        const btnModificar = document.createElement("button");
        btnModificar.textContent = "Modificar";
        btnModificar.classList.add("modificar");
        btnModificar.id = "modificar";

        btnModificar.addEventListener('click', () => editarVehiculo(vehiculo)); // Manejar el click para modificar
        fila.appendChild(crearCelda(btnModificar)); // Añadir botón a la fila

        // Doble clic para editar
        fila.addEventListener('dblclick', () => editarVehiculo(vehiculo));

        tbody.appendChild(fila);
    });

    ocultarSpinner(); // Ocultar el spinner después de cargar la tabla
}

// Función para crear una celda
function crearCelda(contenido) {
    const celda = document.createElement("td");
    if (typeof contenido === 'object') {
        celda.appendChild(contenido); // Si es un botón, agrega el botón
    } else {
        celda.textContent = contenido; // Si es texto, agrega el texto
    }
    return celda;
}

// Función para capitalizar la primera letra de una palabra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para manejar el cambio de filtro
function manejarFiltro() {
    const filtro = document.getElementById('filtro').value;
    cargarTabla(filtro);
}

function manejarFiltroABM() {
    const filtro = document.getElementById('filtroABM').value;
    const autoFields = document.getElementById('auto-fields');
    const camionFields = document.getElementById('camion-fields');

    switch (filtro) {
        case 'vehiculo':
            autoFields.style.display = 'none';
            camionFields.style.display = 'none';
            break;
        case 'auto':
            autoFields.style.display = 'block';
            camionFields.style.display = 'none';
            break;
        case 'camion':
            autoFields.style.display = 'none';
            camionFields.style.display = 'block';
            break;
    }
}

// Evento para actualizar la tabla al cambiar la visibilidad de las columnas
document.querySelectorAll("#column-visibility input").forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        manejarFiltro(); // Recargar la tabla cuando cambie la selección de columnas
    });
});

let ordenAscendente = true; // Controla si se ordena de forma ascendente o descendente

// Función para ordenar por propiedad
function ordenarPorPropiedad(propiedad) {
    // Detectar si la propiedad es numérica para ordenar siempre de menor a mayor
    const esNumerico = typeof vehiculos[0][propiedad] === 'number';
    ordenAscendente = !ordenAscendente;

    // Ordenar directamente el array vehiculos
    vehiculos.sort((a, b) => {
        if (a[propiedad] > b[propiedad]) return esNumerico ? 1 : (ordenAscendente ? 1 : -1);
        if (a[propiedad] < b[propiedad]) return esNumerico ? -1 : (ordenAscendente ? -1 : 1);
        return 0;
    });

    cargarTabla(); // Recargar la tabla después de ordenar
}

document.addEventListener("DOMContentLoaded", function() {
    obtenerDatosDesdeAPI(); // Obtener datos desde la API al iniciar
    // Crear tabla y cargar datos
    cargarTabla();

    // Agregar eventos a los botones de ordenación
    document.querySelectorAll('.ordenar').forEach(boton => {
        boton.addEventListener('click', function() {
            const propiedad = this.id; // Obtener la propiedad del id del botón
            ordenarPorPropiedad(propiedad); // Llamar a la función de ordenación
        });
    });

    // Obtener datos desde la API
    // obtenerDatosDesdeAPI();
});

// Función para mostrar el formulario ABM con datos de un vehículo
function editarVehiculo(vehiculo) {
    document.getElementById('form-datos').style.display = 'none';
    document.getElementById('form-abm').style.display = 'block';
    document.getElementById('form-abm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('form-abm-header').textContent = 'Modificar Vehículo';

    // Llenar los campos del formulario
    document.getElementById('idABM').value = vehiculo.id;
    document.getElementById('modeloABM').value = vehiculo.modelo;
    document.getElementById('anoFabricacionABM').value = vehiculo.anoFabricacion;
    document.getElementById('velMaxABM').value = vehiculo.velMax;

    // Limpiar los campos de auto y camion
    document.getElementById('cantidadPuertasABM').value = '';
    document.getElementById('asientosABM').value = '';
    document.getElementById('capacidadCargaABM').value = '';
    document.getElementById('autonomiaABM').value = '';

    // Ajustar la visibilidad de los campos dependiendo de la clase del vehículo
    if (vehiculo instanceof Auto) {
        document.getElementById('cantidadPuertasABM').value = vehiculo.cantidadPuertas || '';
        document.getElementById('asientosABM').value = vehiculo.asientos || '';
        document.getElementById('auto-fields').style.display = 'block';
        document.getElementById('camion-fields').style.display = 'none';
        document.getElementById('filtroABM').value = 'auto';
    } else if (vehiculo instanceof Camion) {
        document.getElementById('capacidadCargaABM').value = vehiculo.carga || '';
        document.getElementById('autonomiaABM').value = vehiculo.autonomia || '';
        document.getElementById('auto-fields').style.display = 'none';
        document.getElementById('camion-fields').style.display = 'block';
        document.getElementById('filtroABM').value = 'camion';
    } else {
        document.getElementById('auto-fields').style.display = 'none';
        document.getElementById('camion-fields').style.display = 'none';
        document.getElementById('filtroABM').value = 'vehiculo';
    }

    // Set the filter automatically depending on the class
    if (vehiculo instanceof Auto) {
        document.getElementById('filtro').value = 'auto';
    } else if (vehiculo instanceof Camion) {
        document.getElementById('filtro').value = 'camion';
    } else {
        document.getElementById('filtro').value = 'todos';
    }

    vehiculoEditado = vehiculo; // Guarda el vehículo que se está editando
}

// Función para guardar los datos de un nuevo vehículo o actualizar uno existente
async function altaVehiculo() {
    const modelo = document.getElementById('modeloABM').value;
    const anoFabricacion = parseInt(document.getElementById('anoFabricacionABM').value, 10);
    const velMax = parseInt(document.getElementById('velMaxABM').value, 10);

    let cantidadPuertas = null;
    let asientos = null;
    let capacidadCarga = null;
    let autonomia = null;

    if (!modelo) {
        alert("Modelo no puede estar vacío");
        return;
    }
    if (isNaN(anoFabricacion) || anoFabricacion < 1985) {
        alert("Año de fabricación debe ser mayor o igual a 1985");
        return;
    }
    if (isNaN(velMax) || velMax <= 0) {
        alert("Velocidad máxima debe ser mayor a 0");
        return;
    }

    let nuevoVehiculo = null;

    if (document.getElementById('auto-fields').style.display !== 'none') {
        cantidadPuertas = document.getElementById('cantidadPuertasABM').value ? parseInt(document.getElementById('cantidadPuertasABM').value, 10) : null;
        asientos = document.getElementById('asientosABM').value ? parseInt(document.getElementById('asientosABM').value, 10) : null;
        if (isNaN(cantidadPuertas) || cantidadPuertas <= 2) {
            alert("Cantidad de puertas debe ser mayor a 2");
            return;
        }
        if (isNaN(asientos) || asientos <= 2) {
            alert("Cantidad de asientos debe ser mayor a 2");
            return;
        }
        nuevoVehiculo = new Auto(null, modelo, anoFabricacion, velMax, cantidadPuertas, asientos);
    }

    if (document.getElementById('camion-fields').style.display !== 'none') {
        capacidadCarga = document.getElementById('capacidadCargaABM').value ? parseInt(document.getElementById('capacidadCargaABM').value, 10) : null;
        autonomia = document.getElementById('autonomiaABM').value ? parseInt(document.getElementById('autonomiaABM').value, 10) : null;
        if (isNaN(capacidadCarga) || capacidadCarga <= 0) {
            alert("Capacidad de carga debe ser mayor a 0");
            return;
        }
        if (isNaN(autonomia) || autonomia <= 0) {
            alert("Autonomía debe ser mayor a 0");
            return;
        }
        nuevoVehiculo = new Camion(null, modelo, anoFabricacion, velMax, capacidadCarga, autonomia);
    }

    if (!nuevoVehiculo) {
        alert("Debe seleccionar un tipo de vehículo.");
        return;
    }

    // Generate a new ID based on the highest existing ID
    const maxId = vehiculos.length > 0 ? Math.max(...vehiculos.map(v => v.id)) : 0;
    nuevoVehiculo.id = maxId + 1;

    mostrarSpinner();

    // Create a copy of the vehicle object without the id property
    const { id, ...vehiculoSinId } = nuevoVehiculo;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehiculoSinId)
    };

    try {
        const response = await fetch('https://examenesutn.vercel.app/api/VehiculoAutoCamion', requestOptions);
        ocultarSpinner();
        if (response.ok) {
            const data = await response.json();
            if (data.id) {
                nuevoVehiculo.id = data.id;
            }
            vehiculos.push(nuevoVehiculo);
            cargarTabla();
            cancelarEdicion();

            // Set the filter automatically depending on the class
            if (nuevoVehiculo instanceof Auto) {
                document.getElementById('filtro').value = 'auto';
            } else if (nuevoVehiculo instanceof Camion) {
                document.getElementById('filtro').value = 'camion';
            } else {
                document.getElementById('filtro').value = 'todos';
            }
        } else {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'No se pudo realizar la operación');
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'No se pudo realizar la operación');
            }
        }
    } catch (error) {
        alert(error.message);
        cancelarEdicion();
    }
}

// Función para mostrar el formulario ABM con datos de un vehículo para 
function eliminarVehiculo(vehiculo) {
    document.getElementById('form-datos').style.display = 'none';
    document.getElementById('form-abm').style.display = 'block';
    document.getElementById('form-abm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('form-abm-header').textContent = 'Eliminar Vehículo';

    // Llenar los campos del formulario
    document.getElementById('idABM').value = vehiculo.id;
    document.getElementById('modeloABM').value = vehiculo.modelo;
    document.getElementById('anoFabricacionABM').value = vehiculo.anoFabricacion;
    document.getElementById('velMaxABM').value = vehiculo.velMax;

    // Limpiar los campos de auto y camion
    document.getElementById('cantidadPuertasABM').value = '';
    document.getElementById('asientosABM').value = '';
    document.getElementById('capacidadCargaABM').value = '';
    document.getElementById('autonomiaABM').value = '';

    // Ajustar la visibilidad de los campos dependiendo de la clase del vehículo
    if (vehiculo instanceof Auto) {
        document.getElementById('cantidadPuertasABM').value = vehiculo.cantidadPuertas || '';
        document.getElementById('asientosABM').value = vehiculo.asientos || '';
        document.getElementById('auto-fields').style.display = 'block';
        document.getElementById('camion-fields').style.display = 'none';
        document.getElementById('filtroABM').value = 'auto';
    } else if (vehiculo instanceof Camion) {
        document.getElementById('capacidadCargaABM').value = vehiculo.carga || '';
        document.getElementById('autonomiaABM').value = vehiculo.autonomia || '';
        document.getElementById('auto-fields').style.display = 'none';
        document.getElementById('camion-fields').style.display = 'block';
        document.getElementById('filtroABM').value = 'camion';
    } else {
        document.getElementById('auto-fields').style.display = 'none';
        document.getElementById('camion-fields').style.display = 'none';
        document.getElementById('filtroABM').value = 'vehiculo';
    }

    document.getElementById('idABM').disabled = true;
    document.getElementById('modeloABM').disabled = true;
    document.getElementById('anoFabricacionABM').disabled = true;
    document.getElementById('velMaxABM').disabled = true;
    document.getElementById('cantidadPuertasABM').disabled = true;
    document.getElementById('asientosABM').disabled = true;
    document.getElementById('capacidadCargaABM').disabled = true;
    document.getElementById('autonomiaABM').disabled = true;

    vehiculoEditado = vehiculo; 
}

function confirmarEliminacion() {
    if (!vehiculoEditado) {
        alert("No hay vehículo seleccionado para eliminar.");
        return;
    }

    mostrarSpinner();

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: vehiculoEditado.id })
    };

    fetch('https://examenesutn.vercel.app/api/VehiculoAutoCamion', requestOptions)
        .then(response => {
            ocultarSpinner();
            if (response.ok) {
                vehiculos = vehiculos.filter(v => v.id !== vehiculoEditado.id);
                cargarTabla();
                cancelarEdicion();
                document.getElementById('form-abm').style.display = 'none';
                document.getElementById('form-datos').style.display = 'block';
            } else {
                throw new Error('No se pudo realizar la operación');
            }
        })
        .catch(error => {
            ocultarSpinner();
            cancelarEdicion();
            document.getElementById('form-abm').style.display = 'none';
            document.getElementById('form-datos').style.display = 'block';
            alert(error.message);
        });
}

// Función para cancelar la edición o eliminación
function cancelarEdicion() {
    vehiculoEditado = null;
    document.getElementById('abm-form').reset();
    document.getElementById('form-abm').style.display = 'none';
    document.getElementById('form-datos').style.display = 'block';
}

// Función para generar un nuevo ID único
function generarNuevoId() {
    return vehiculos.length > 0 ? Math.max(...vehiculos.map(v => v.id)) + 1 : 1;
}

// Función para cancelar la edición o agregar una nueva persona
function cancelarEdicion() {
    vehiculoEditado = null;
    document.getElementById('abm-form').reset();
    document.getElementById('form-abm').style.display = 'none';
    document.getElementById('form-datos').style.display = 'block';
}

// Función para agregar un nuevo vehículo (limpia el formulario)
function agregarVehiculo() {
    document.getElementById('form-datos').style.display = 'none';
    document.getElementById('form-abm').style.display = 'block';
    document.getElementById('abm-form').reset();
    document.getElementById('form-abm-header').textContent = 'Agregar Vehículo'; // Set the header to 'Agregar Vehículo'
    document.getElementById('idABM').disabled = true;
    document.getElementById('modeloABM').disabled = false;
    document.getElementById('anoFabricacionABM').disabled = false;
    document.getElementById('velMaxABM').disabled = false;
    document.getElementById('cantidadPuertasABM').disabled = false;
    document.getElementById('asientosABM').disabled = false;
    document.getElementById('capacidadCargaABM').disabled = false;
    document.getElementById('autonomiaABM').disabled = false;
    vehiculoEditado = null;
}

function calcularVelMaxPromedio() {
    const filtro = document.getElementById('filtro').value; // Función que debes implementar para obtener el filtro seleccionado
    let vehiculosFiltrados = vehiculos;

    if (filtro === 'auto') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Auto);
    } else if (filtro === 'camion') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Camion);
    }

    const velMaxPromedio = vehiculosFiltrados
        .map(vehiculo => vehiculo.velMax) // Extraer las velocidades máximas
        .reduce((suma, velMax) => suma + velMax, 0) / (vehiculosFiltrados.length || 1); // Calcular el promedio

    // Mostrar el resultado
    document.getElementById('velMax-promedio').innerText = `Velocidad máxima promedio: ${velMaxPromedio}`;
}

function mostrarSpinner() {
    document.getElementById('spinner-container').style.display = 'flex';
}

// Función para ocultar el spinner
function ocultarSpinner() {
    document.getElementById('spinner-container').style.display = 'none';
}

// Función para obtener datos desde la API
function obtenerDatosDesdeAPI() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://examenesutn.vercel.app/api/VehiculoAutoCamion", true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const datos = JSON.parse(xhr.responseText);
                    console.log("Datos recibidos de la API:", datos); // Log the received data
                    datos.forEach(item => {
                        let vehiculo;
                        if (item.cantidadPuertas !== undefined && item.asientos !== undefined) {
                            vehiculo = new Auto(item.id, item.modelo, item.anoFabricacion, item.velMax, item.cantidadPuertas, item.asientos);
                        } else if (item.carga !== undefined && item.autonomia !== undefined) {
                            vehiculo = new Camion(item.id, item.modelo, item.anoFabricacion, item.velMax, item.carga, item.autonomia);
                        } else {
                            vehiculo = new Vehiculo(item.id, item.modelo, item.anoFabricacion, item.velMax);
                        }
                        vehiculos.push(vehiculo);
                    });
                    cargarTabla();
                    document.getElementById('form-datos').style.display = 'block'; // Mostrar el formulario lista
                } catch (e) {
                    console.error("Error al procesar los datos de la API:", e); // Log the error
                    alert("Error al procesar los datos de la API.");
                }
            } else {
                alert("Error al obtener datos desde la API.");
            }
        }
    };
    xhr.send();
}

document.getElementById('agregar').addEventListener('click', (e) => {
    e.preventDefault();
    agregarVehiculo();
});

document.getElementById('guardar').addEventListener('click', (e) => {
    e.preventDefault();
    if (document.getElementById('form-abm-header').textContent === 'Eliminar Vehículo') {
        confirmarEliminacion();
    } else if (vehiculoEditado) {
        modificarVehiculo();
    } else {
        altaVehiculo();
    }
});
document.getElementById('cancelar').addEventListener('click', (e) => {
    e.preventDefault();
    cancelarEdicion();
});

document.getElementById('filtro').addEventListener('change', manejarFiltro);
document.getElementById('filtroABM').addEventListener('change', manejarFiltroABM);

document.getElementById("calcular").addEventListener("click", calcularVelMaxPromedio);

document.addEventListener("DOMContentLoaded", function() {
    cargarTabla(); // Cargar la tabla con datos al iniciar
});

function modificarVehiculo() {
    const modelo = document.getElementById('modeloABM').value;
    const anoFabricacion = parseInt(document.getElementById('anoFabricacionABM').value, 10);
    const velMax = parseInt(document.getElementById('velMaxABM').value, 10);

    let cantidadPuertas = null;
    let asientos = null;
    let capacidadCarga = null;
    let autonomia = null;

    if (!modelo) {
        alert("Modelo no puede estar vacío");
        return;
    }
    if (isNaN(anoFabricacion) || anoFabricacion < 1985) {
        alert("Año de fabricación debe ser mayor o igual a 1985");
        return;
    }
    if (isNaN(velMax) || velMax <= 0) {
        alert("Velocidad máxima debe ser mayor a 0");
        return;
    }

    let vehiculoModificado;

    if (document.getElementById('auto-fields').style.display !== 'none') {
        cantidadPuertas = document.getElementById('cantidadPuertasABM').value ? parseInt(document.getElementById('cantidadPuertasABM').value, 10) : null;
        asientos = document.getElementById('asientosABM').value ? parseInt(document.getElementById('asientosABM').value, 10) : null;
        if (isNaN(cantidadPuertas) || cantidadPuertas <= 2) {
            alert("Cantidad de puertas debe ser mayor a 2");
            return;
        }
        if (isNaN(asientos) || asientos <= 2) {
            alert("Cantidad de asientos debe ser mayor a 2");
            return;
        }
        vehiculoModificado = new Auto(vehiculoEditado.id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos);
    }

    if (document.getElementById('camion-fields').style.display !== 'none') {
        capacidadCarga = document.getElementById('capacidadCargaABM').value ? parseInt(document.getElementById('capacidadCargaABM').value, 10) : null;
        autonomia = document.getElementById('autonomiaABM').value ? parseInt(document.getElementById('autonomiaABM').value, 10) : null;
        if (isNaN(capacidadCarga) || capacidadCarga <= 0) {
            alert("Capacidad de carga debe ser mayor a 0");
            return;
        }
        if (isNaN(autonomia) || autonomia <= 0) {
            alert("Autonomía debe ser mayor a 0");
            return;
        }
        vehiculoModificado = new Camion(vehiculoEditado.id, modelo, anoFabricacion, velMax, capacidadCarga, autonomia);
    }

    mostrarSpinner();

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehiculoModificado) // Include the id in the request body
    };

    fetch('https://examenesutn.vercel.app/api/VehiculoAutoCamion', requestOptions)
        .then(response => {
            ocultarSpinner();
            if (response.ok) {
                const index = vehiculos.findIndex(v => v.id === vehiculoEditado.id);
                vehiculos[index] = vehiculoModificado;
                cargarTabla(); // Refresh the table with the new data
                cancelarEdicion();
                document.getElementById('form-abm').style.display = 'none';
                document.getElementById('form-datos').style.display = 'block';
            } else {
                throw new Error('No se pudo realizar la operación');
            }
        })
        .catch(error => {
            ocultarSpinner();
            cancelarEdicion();
            document.getElementById('form-abm').style.display = 'none';
            document.getElementById('form-datos').style.display = 'block';
            alert(error.message);
        });
}