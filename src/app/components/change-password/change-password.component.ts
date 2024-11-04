import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-off';

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      await this.presentAlert('Error', 'Las nuevas contraseñas no coinciden');
      return;
    }

    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe(
      async (success) => {
        if (success) {
          await this.presentAlert('Éxito', 'Contraseña cambiada con éxito');
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.navCtrl.navigateRoot('/login');
        } else {
          await this.presentAlert('Error', 'La contraseña antigua es incorrecta');
        }
      }
    );
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  togglePasswordVisibility1() {
    this.passwordType1 = this.passwordType1 === 'password' ? 'text' : 'password';
    this.passwordIcon1 = this.passwordIcon1 === 'eye-off' ? 'eye' : 'eye-off';
  }
}
