import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {
  asignaturas = [
    {codigo: "PGY4121", seccion: "001D", nombre: "matematicas"},
    {codigo: "PGY2121", seccion: "003D", nombre: "lenguaje"},
    {codigo: "mdy3101", seccion: "001D", nombre: "historia"},
    {codigo: "ghj9234", seccion: "004D", nombre: "quimica"},
    {codigo: "dwd4636", seccion: "001D", nombre: "fisica"},
    {codigo: "frt1233", seccion: "002D", nombre: "biologia"},
    {codigo: "fse4234", seccion: "002D", nombre: "artes"},
    {codigo: "ffd3123", seccion: "001D", nombre: "filosofia"},
  ]

  constructor() { }

  ngOnInit() {
  }

}
