import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-generate',
  templateUrl: './qr-generate.page.html',
  styleUrls: ['./qr-generate.page.scss'],
})
export class QrGeneratePage implements OnInit {
  id:any;
  findid:any;
  nombre:any;
  siglas:any;
  seccion:any;
  qrCodel:any;

  clases: any = [];

  private apiUrl = 'http://192.168.1.110:3000/classes';

  constructor(private activateRoute:ActivatedRoute, private http:HttpClient) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get("id")
    this.findid = this.id -1;
    this.getAsignaturasACargo().subscribe(res => {
      this.clases = res;
      this.nombre = this.clases[this.findid].name;
      this.siglas = this.clases[this.findid].subject;
      this.seccion = this.clases[this.findid].section;
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
