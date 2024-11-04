import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController,
    private authService: AuthService
  ) {}

  // Restablecer los campos cuando la página se va a mostrar
  ionViewWillEnter() {
    this.clearFields();
  }

  // Método para iniciar sesión
  login() {
    if (!this.username || !this.password) {
      this.presentAlert('Error de Validación', 'Por favor, complete todos los campos');
      return;
    }
    // Llamada al servicio de autenticación
    this.authService.login(this.username, this.password).subscribe(isValid => {
      if (isValid) {
        localStorage.setItem('username', this.username);
        this.navCtrl.navigateRoot('/home');
      } else {
        this.presentAlert('Error de inicio de sesión', 'Usuario o contraseña incorrectos');
      }
    });
  }

  // Navegación a la página de registro
  goToSignUp() {
    this.router.navigate(['/sign']);
  }

  // Limpiar campos de input
  clearFields() {
    this.username = '';
    this.password = '';
  }

  // Alertas de error
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Mostrar/ocultar contraseña
  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }
}
