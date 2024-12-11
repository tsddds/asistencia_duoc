import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  username: string = '';
  isLoggedIn: boolean = false;
  isProfessor: boolean = false;
  private toastShown: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    const previousLoginState = this.isLoggedIn;
    this.checkLoginStatus();
    
    // Mostrar toast solo cuando el usuario pasa de no logueado a logueado
    if (!previousLoginState && this.isLoggedIn && !this.toastShown) {
      this.showWelcomeToast();
      this.toastShown = true;
    }
  }

  checkLoginStatus() {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    this.username = userSession.email || '';
    this.isLoggedIn = !!this.username;
    this.isProfessor = userSession.role === 'profesor';
  }

  private async showWelcomeToast() {
    const toast = await this.toastController.create({
      message: `¡Bienvenido, ${this.username}! ¿Qué deseas hacer hoy?`,
      duration: 3000,
      position: 'top',
      cssClass: 'welcome-toast'
    });
    await toast.present();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    localStorage.removeItem('userSession');
    this.toastShown = false; // Resetear el flag cuando se cierra sesión
    this.checkLoginStatus();
  }
}
