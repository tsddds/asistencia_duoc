import { Component, OnInit } from '@angular/core';

interface Asistencia {
  fecha: string;
  presente: boolean;
}

interface Asignatura {
  nombre: string;
  asistencias: Asistencia[];
}


@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {

  asistenciasData: Asignatura[] = [
    {
      nombre: "PGY4121",
      asistencias: [
        { fecha: "02/07/2024", presente: true },
        { fecha: "03/07/2024", presente: false },
      ],
    },
    {
      nombre: "PGY2121",
      asistencias: [
        { fecha: "02/07/2024", presente: true },
      ],
    },
    {
      nombre: "mdy3101",
      asistencias: [
        { fecha: "02/07/2024", presente: false },
        { fecha: "03/07/2024", presente: true },
      ],
    },
  ]
  
  constructor() { }

  ngOnInit() {
  }


}
