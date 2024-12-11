import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-clases-a-cargo',
  templateUrl: './clases-a-cargo.page.html',
  styleUrls: ['./clases-a-cargo.page.scss'],
})
export class ClasesACargoPage implements OnInit {
  private apiUrl = 'http://192.168.104.19:3000/classes';
  clases: any = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getAsignaturasACargo().subscribe(res => {
      this.clases = res;
    });
  }

  getAsignaturasACargo() {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const professorId = userSession?.id;

    if (!professorId) {
      console.error('No se ha encontrado el ID del profesor en localStorage.');
      return of([]);
    }

    return this.http.get<any[]>(this.apiUrl).pipe(
      map(classes => {
        // Filtrar las clases que corresponden al profesor
        return classes.filter(cl => cl.professorId === professorId);
      }),
      catchError(error => {
        console.error('Error fetching classes', error);
        return of([]);
      })
    );
  }
}