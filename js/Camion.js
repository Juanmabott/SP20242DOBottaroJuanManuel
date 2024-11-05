class Camion extends Vehiculo {
    constructor(id, modelo, anoFabricacion, velMax, carga, autonomia) {
        super(id, modelo, anoFabricacion, velMax);
        this.carga = carga;
        this.autonomia = autonomia;
    }

    toString() {
        return `${super.toString()}, Capacidad de Carga: ${this.carga}, Autonomía: ${this.autonomia}`;
    }

    toJson() {
        const vehiculoJson = JSON.parse(super.toJson());
        vehiculoJson.carga = this.carga;
        vehiculoJson.autonomia = this.autonomia;
        return JSON.stringify(vehiculoJson);
    }

    // Método estático para crear un Camion desde un objeto JSON
    static fromJson(json) {
        return new Camion(json.id, json.modelo, json.anoFabricacion, json.velMax, json.carga, json.autonomia);
    }
}

// Ejemplo de uso
