import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

interface User {
  id?: number;
  email: string;
  password: string;
  role: string; 
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.1.110:3000/users'; // URL de la API REST
  private sessionKey = 'userSession'; // Clave para almacenar el usuario en localStorage

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          // Guardar el rol y otros datos del usuario en localStorage
          localStorage.setItem(this.sessionKey, JSON.stringify({ id: user.id, email: user.email, role: user.role }));
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
  // Método para registrar un usuario
  register(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        if (users.length > 0) {
          throw new Error('El correo ya está registrado');
        }
        return false;
      }),
      tap(() => {
        const newUser: User = { email, password, role: '' };
        this.http.post(this.apiUrl, newUser).subscribe();
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  // Método para cambiar la contraseña
  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    const userSession = JSON.parse(localStorage.getItem(this.sessionKey) || '{}');
    const userId = userSession?.id;

    if (!userId) {
      return of(false); // No hay usuario autenticado
    }

    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      switchMap(user => {
        if (user.password !== oldPassword) {
          throw new Error('La contraseña actual es incorrecta');
        }
        // Actualizar la contraseña en el servidor
        const updatedUser = { ...user, password: newPassword };
        return this.http.put<User>(`${this.apiUrl}/${userId}`, updatedUser).pipe(
          map(() => true),
          catchError(() => of(false))
        );
      }),
      catchError(() => of(false))
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.sessionKey) !== null;
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }
}
