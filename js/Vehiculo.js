class Vehiculo {
    constructor(id, modelo, anoFabricacion, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFabricacion = anoFabricacion;
        this.velMax = velMax;
    }

    // Método para obtener la descripción del vehículo
    toString() {
        return `ID: ${this.id}, Modelo: ${this.modelo}, Año de Fabricación: ${this.anoFabricacion}, Velocidad Máxima: ${this.velMax}`;
    }

    // Método para obtener la representación JSON del vehículo
    toJson() {
        return JSON.stringify({
            id: this.id,
            modelo: this.modelo,
            anoFabricacion: this.anoFabricacion,
            velMax: this.velMax
        });
    }

    // Método estático para crear un Vehiculo desde un objeto JSON
    static fromJson(json) {
        return new Vehiculo(json.id, json.modelo, json.anoFabricacion, json.velMax);
    }
}

