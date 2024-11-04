import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  username: string = '';
  isLoggedIn: boolean = false;
  isProfessor: boolean = false; // Variable para determinar si el usuario es profesor

  constructor(private router: Router) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.checkLoginStatus();
  }

  // Verificar el estado de inicio de sesión y rol del usuario
  checkLoginStatus() {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    this.username = userSession.email || '';
    this.isLoggedIn = !!this.username;
    this.isProfessor = userSession.role === 'profesor'; // Revisar si el usuario es profesor
  }

  // Navegar a la ruta especificada
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('userSession');
    this.checkLoginStatus();
  }
}
