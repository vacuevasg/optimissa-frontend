export interface FormularioRequest {
  infoUsuario: {
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    curp: string;
    rfc: string;
  },
  domicilio: {
    codigoPostal: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    estado: string;
    delegacion: string;
    colonia: string;
  }
}