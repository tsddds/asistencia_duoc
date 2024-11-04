import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.page.html',
  styleUrls: ['./sign.page.scss'],
})
export class SignPage implements OnInit {
  username: string = '';
  password: string = '';

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  // Restablecer los campos cuando la página se va a mostrar
  ionViewWillEnter() {
    this.clearFields();
  }

  // Método para registrar un usuario
  signUp() {
    if (!this.username || !this.password) {
      this.presentAlert('Error de Validación', 'Por favor, complete todos los campos');
      return;
    }
    // Llamada al servicio de autenticación para registrar
    this.authService.register(this.username, this.password).subscribe(isRegistered => {
      if (isRegistered) {
        localStorage.setItem('username', this.username);
        this.navCtrl.navigateRoot('/home');
      } else {
        this.presentAlert('Error de registro', 'El correo ya está registrado');
      }
    });
  }

  // Limpiar campos de input
  clearFields() {
    this.username = '';
    this.password = '';
  }

  // Restablecer contraseña
  async resetPassword() {
    const alert = await this.alertController.create({
      header: 'Restablecer contraseña',
      message: 'Se enviará un enlace para restablecer tu contraseña al correo electrónico asociado a tu cuenta.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: () => {
            console.log('Enviar enlace de restablecimiento de contraseña');
          }
        }
      ]
    });

    await alert.present();
  }

  // Navegación a la página principal después del registro
  goHome() {
    this.navCtrl.navigateRoot('/home'); 
  }

  // Navegación a la página de login
  login() {
    this.router.navigate(['/login']); 
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
