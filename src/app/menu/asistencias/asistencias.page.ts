// Modificación del componente AsistenciasPage
import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistecia.service';
import { forkJoin } from 'rxjs';

interface Asistencia {
  fecha: string;
  presente: boolean;
  subject: string;
}

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {
  asistencias: Asistencia[] = [];

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    // Utilizar forkJoin para obtener las clases y asistencias del estudiante logueado simultáneamente
    forkJoin({
      classes: this.asistenciaService.getClasses(),
      attendanceData: this.asistenciaService.getAttendance(),
    }).subscribe(({ classes, attendanceData }) => {
      // Combinar las asistencias con la información de la clase (subject)
      this.asistencias = attendanceData.map((att) => {
        const clase = classes.find((c) => c.id === att.classId);
        return {
          fecha: new Date(att.timestamp).toLocaleDateString(),
          presente: true,
          subject: clase ? clase.subject : 'Clase desconocida',
        };
      });
    });
  }
}
