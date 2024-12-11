import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistecia.service';

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
  asistenciasPorAsignatura: { [key: string]: Asistencia[] } = {}; 
//'PGY4121': [ { fecha: '2024-03-20', presente: true, subject: 'PGY4121' }]
  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    
    this.loadAsistencias();
  }

  // Función para cargar y organizar las asistencias por asignatura
  loadAsistencias() {
    this.asistenciaService.getStudentAttendance().subscribe(
      (asistencias) => {
        this.organizeAsistencias(asistencias);
      },
      (error) => {
        console.error('Error al cargar las asistencias:', error);
      }
    );
  }

  // Función para organizar las asistencias por asignatura
  organizeAsistencias(asistencias: Asistencia[]) {
    
    this.asistenciasPorAsignatura = asistencias.reduce((acc, asistencia) => {
      const subject = asistencia.subject;
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(asistencia);
      return acc;
    }, {} as { [key: string]: Asistencia[] });
  }
/*organizeAsistencias(asistencias: Asistencia[]) {
  this.asistenciasPorAsignatura = {
    'TODAS': asistencias
  };
}
  
// No agrupar correctamente y poner todas las asistencias en un solo grupo
organizeAsistencias(asistencias: Asistencia[]) {
  this.asistenciasPorAsignatura = {
    'PGY4121': asistencias,  
    'BDD4121': []           
  };
}


if (asistencias.length === 0) {
    this.asistenciasPorAsignatura = {
      'SIN_DATOS': []  // Esto hará que length sea 1 en vez de 0
    };
    return;
  }

*/ 


  // Método para obtener las asignaturas
  getSubjects(): string[] {
    return Object.keys(this.asistenciasPorAsignatura);
  }
}
