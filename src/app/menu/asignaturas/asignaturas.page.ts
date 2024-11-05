import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistecia.service';

interface Asignatura {
  id: string;
  nombre: string;
  codigo: string;
  seccion: string;
}

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {
  asignaturas: Asignatura[] = [];

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    this.cargarAsignaturas();
  }

  cargarAsignaturas() {
    this.asistenciaService.getClasses().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.asignaturas = data.map((cl) => ({
            id: cl.id,
            nombre: cl.name,
            codigo: cl.subject,
            seccion: cl.section,
          }));
        } else {
          console.error('No se encontraron asignaturas.');
        }
      },
      (error) => {
        console.error('Error al cargar asignaturas:', error);
      }
    );
  }
}
