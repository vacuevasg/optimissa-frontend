// formulario/formulario.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormularioRequest } from '../../models/formulario';
import * as L from 'leaflet';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {
  usuarios: any[] = [];
  form: FormGroup;
  map: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      primerApellido: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      segundoApellido: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      curp: ['', [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9]{2}$')]],
      rfc: ['', [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$')]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      calle: ['', Validators.required],
      numeroExterior: ['', [Validators.required, Validators.pattern('^[0-9]{1,5}$')]],
      numeroInterior: ['', [Validators.pattern('^[A-Za-z0-9]{1,10}$')]],
      estado: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      delegacion: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      colonia: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]]
    });
  }


  ngOnInit(): void {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe((data) => {
        this.usuarios = data;
      });
  }


  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([19.4326, -99.1332], 5); // vista inicial CDMX

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  // Ejemplo: agregar marcador dinámico
  marcar(lat: number, lng: number): void {
    L.marker([lat, lng]).addTo(this.map)
      .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
      .openPopup();

    this.map.setView([lat, lng], 12);
  }

  // En tu función verCoordenadas(usuario) puedes hacer:
  verCoordenadas(usuario: any) {
    const lat = parseFloat(usuario.address.geo.lat);
    const lng = parseFloat(usuario.address.geo.lng);
    this.marcar(lat, lng);
  }
  validarCampos() {
    if (this.form.invalid) {
      alert('Existen campos por validar');
      this.form.markAllAsTouched();
      return;
    }

    alert('Campos validados correctamente');

    const datos: FormularioRequest = {
      infoUsuario: {
        nombre: this.form.value.nombre,
        primerApellido: this.form.value.primerApellido,
        segundoApellido: this.form.value.segundoApellido,
        curp: this.form.value.curp,
        rfc: this.form.value.rfc
      },
      domicilio: {
        codigoPostal: this.form.value.codigoPostal,
        calle: this.form.value.calle,
        numeroExterior: this.form.value.numeroExterior,
        numeroInterior: this.form.value.numeroInterior,
        estado: this.form.value.estado,
        delegacion: this.form.value.delegacion,
        colonia: this.form.value.colonia
      }
    };

    this.http.post('http://httpbin.org/post', datos).subscribe(response => {
      console.log('Formulario enviado correctamente', response);
    });


  }
}
