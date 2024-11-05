class Auto extends Vehiculo {
    constructor(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos) {
        super(id, modelo, anoFabricacion, velMax);
        this.cantidadPuertas = cantidadPuertas;
        this.asientos = asientos;
    }

    toString() {
        return `${super.toString()}, Cantidad de Puertas: ${this.cantidadPuertas}, Asientos: ${this.asientos}`;
    }

    toJson() {
        const vehiculoJson = JSON.parse(super.toJson());
        vehiculoJson.cantidadPuertas = this.cantidadPuertas;
        vehiculoJson.asientos = this.asientos;
        return JSON.stringify(vehiculoJson);
    }

    // Método estático para crear un Auto desde un objeto JSON
    static fromJson(json) {
        return new Auto(json.id, json.modelo, json.anoFabricacion, json.velMax, json.cantidadPuertas, json.asientos);
    }
}

// Ejemplo de uso
