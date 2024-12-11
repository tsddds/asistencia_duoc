import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = 'http://192.168.104.19:3000'; // URL de la API REST
  private sessionKey = 'userSession'; // Clave para obtener datos del usuario de localStorage

  constructor(private http: HttpClient) {}

  // Método para obtener las asistencias del estudiante
  getStudentAttendance(): Observable<any[]> {
    let userSession;
    try {
      // Obtener datos del usuario desde localStorage
      userSession = JSON.parse(localStorage.getItem(this.sessionKey) || '{}');
    } catch (e) {
      console.error('Error al parsear los datos del usuario desde localStorage:', e);
      return of([]);
    }

    const studentId = userSession?.id;

    if (!studentId) {
      console.error('No se ha encontrado el ID del estudiante en localStorage.');
      return of([]);
    }

    // Usar forkJoin para hacer solicitudes a las asistencias y las clases simultáneamente
    return forkJoin({
      attendance: this.http.get<any[]>(`${this.apiUrl}/attendance`),
      classes: this.http.get<any[]>(`${this.apiUrl}/classes`),
    }).pipe(
      map(({ attendance, classes }) => {
        // Filtrar las asistencias del estudiante
        const studentAttendance = attendance.filter(
          (att) => att.studentId === studentId
        );

        // Asociar cada asistencia con el nombre de la clase
        return studentAttendance.map((att) => {
          const classInfo = classes.find((cl) => cl.id === att.classId);
          const fecha = new Date(att.timestamp).toLocaleString(); // Formatear la fecha
          return {
            fecha: fecha,
            presente: true, // Puedes ajustar esto si hay una lógica específica para determinar la asistencia
            subject: classInfo ? classInfo.subject : 'Clase desconocida',
          };
        });
      }),
      catchError((error) => {
        console.error('Error al obtener las asistencias del estudiante:', error);
        return of([]);
      })
    );
  }

  // Método para obtener detalles del usuario por su ID
  getUserDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener los detalles del usuario:', error);
        return of(null);
      })
    );
  }

  // Método para obtener las clases del usuario
  getClasses(): Observable<any[]> {
    let userSession;
    try {
      userSession = JSON.parse(localStorage.getItem(this.sessionKey) || '{}');
    } catch (e) {
      console.error('Error al parsear los datos del usuario desde localStorage:', e);
      return of([]);
    }

    const userId = userSession?.id;

    if (!userId) {
      console.error('No se ha encontrado el ID del usuario en localStorage.');
      return of([]);
    }

    return this.getUserDetails(userId).pipe(
      switchMap((user: any) => {
        if (!user || !user.classes || user.classes.length === 0) {
          console.error('El usuario no tiene clases asignadas.');
          return of([]);
        }

        const userClasses: string[] = user.classes;
        return this.http.get<any[]>(`${this.apiUrl}/classes`).pipe(
          map((classes: any[]) => classes.filter((cl) => userClasses.includes(cl.id))),
          catchError((error) => {
            console.error('Error al obtener las clases:', error);
            return of([]);
          })
        );
      }),
      catchError((error) => {
        console.error('Error al obtener los detalles del usuario:', error);
        return of([]);
      })
    );
  }
}
