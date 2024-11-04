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
  private apiUrl = 'http://localhost:3000/classes';
  clases: any = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getAsignaturasACargo().subscribe(res => {
      this.clases = res;
    });
  }

  getAsignaturasACargo() {
    return this.http.get(this.apiUrl).pipe(
      map(res => {
        return res; // Solo devuelve res para verificar su contenido
      }),
      catchError(error => {
        console.error('Error fetching classes', error);
        return of([]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }
 
}