import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap, shareReplay } from 'rxjs/operators';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  classes: string[];
}

interface Class {
  id: string;
  name: string;
  subject: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  professorId: string;
  qrCode: string;
}

interface Attendance {
  id: string;
  classId: string;
  studentId: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = 'http://192.168.1.110:3000'; // URL de la API REST
  private sessionKey = 'userSession'; // Clave para obtener datos del usuario de localStorage
  private userCache$: Observable<User> | null = null;

  constructor(private http: HttpClient) {}

  // Método para obtener los detalles del usuario, incluyendo las clases que tiene asignadas, con cache
  getUserDetails(userId: string): Observable<User> {
    if (!this.userCache$) {
      this.userCache$ = this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
        shareReplay(1),
        catchError((error) => {
          console.error('Error al obtener los detalles del usuario:', error);
          this.userCache$ = null;
          return of(null as any);
        })
      );
    }
    return this.userCache$;
  }

  // Método para obtener las clases del usuario usando su ID
  getClasses(): Observable<Class[]> {
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

    // Obtener los detalles del usuario, incluyendo las clases que tiene asignadas
    return this.getUserDetails(userId).pipe(
      switchMap((user: User) => {
        if (!user || !user.classes || user.classes.length === 0) {
          console.error('El usuario no tiene clases asignadas.');
          return of([]);
        }

        const userClasses: string[] = user.classes;
        return this.http.get<Class[]>(`${this.apiUrl}/classes`).pipe(
          map((classes: Class[]) =>
            classes.filter((cl) => userClasses.includes(cl.id))
          ),
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

  // Método para obtener las asistencias del usuario si es un alumno
  getAttendance(): Observable<Attendance[]> {
    let userSession;
    try {
      userSession = JSON.parse(localStorage.getItem(this.sessionKey) || '{}');
    } catch (e) {
      console.error('Error al parsear los datos del usuario desde localStorage:', e);
      return of([]);
    }

    const userId = userSession?.id;

    if (!userId || userSession.role !== 'alumno') {
      console.error('El usuario no tiene permisos para ver las asistencias o no es un alumno.');
      return of([]);
    }

    if (!Array.isArray(userSession.classes)) {
      console.error('Las clases del usuario no están en el formato correcto.');
      return of([]);
    }

    return this.http.get<Attendance[]>(`${this.apiUrl}/attendance`).pipe(
      map((attendances: Attendance[]) =>
        attendances.filter((att) => userSession.classes.includes(att.classId))
      ),
      catchError((error) => {
        console.error('Error al obtener las asistencias:', error);
        return of([]);
      })
    );
  }
}