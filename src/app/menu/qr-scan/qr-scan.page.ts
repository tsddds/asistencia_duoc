import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

  scanResult = '';
  private apiUrl = 'http://192.168.1.110:3000/attendance'; // URL de la API para registrar asistencia

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    if (this.platform.is('capacitor')) {
      // Verificar si el escáner es soportado
      const isSupported = await BarcodeScanner.isSupported();
      if (!isSupported) {
        this.showAlert('Error', 'La función de escaneo no es soportada en este dispositivo.');
        return;
      }

      // Comprobar permisos y solicitarlos si es necesario
      const status = await BarcodeScanner.checkPermissions();
      if (status.camera !== 'granted') {
        const permissionResult = await BarcodeScanner.requestPermissions();
        if (permissionResult.camera !== 'granted') {
          this.showAlert('Permisos denegados', 'Se requieren permisos de cámara para escanear el código QR.');
          return;
        }
      }

      // Eliminar todos los listeners previos para evitar conflictos
      BarcodeScanner.removeAllListeners();
    }
  }

  async startScan() {
    if (this.platform.is('capacitor')) {
      try {
        // Añadir clase al body para indicar que el escaneo está activo
        document.body.classList.add('barcode-scanning-active');

        // Crear el modal para el escaneo
        const modal = await this.modalController.create({
          component: BarcodeScanningModalComponent,
          cssClass: 'barcode-scanning-modal',
          showBackdrop: false,
          componentProps: {
            formats: [],
            lensFacing: LensFacing.Back
          }
        });

        await modal.present();

        // Obtener el resultado del escaneo cuando el modal se cierre
        const { data } = await modal.onWillDismiss();

        // Eliminar clase del body cuando el escaneo termine
        document.body.classList.remove('barcode-scanning-active');

        if (data && data.barcode) {
          this.scanResult = data.barcode.displayValue;
          // Llamar al método para registrar la asistencia
          this.registrarAsistencia(this.scanResult);
        } else {
          this.showAlert('Escaneo fallido', 'No se pudo obtener un resultado del escaneo.');
        }

      } catch (error: any) {
        document.body.classList.remove('barcode-scanning-active');
        this.showAlert('Error', 'Hubo un problema al iniciar el escaneo: ' + error.message);
      }
    } else {
      this.showAlert('Error', 'El escaneo solo está disponible en dispositivos móviles.');
    }
  }

  // Método para registrar la asistencia
  registrarAsistencia(codigoQr: string) {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const studentId = userSession?.id;

    if (!studentId) {
      this.showAlert('Error', 'No se pudo encontrar el ID del estudiante.');
      return;
    }

    // Crear el objeto de asistencia
    const asistencia = {
      classId: codigoQr, // Usar el código QR como el ID de la clase
      studentId: studentId,
      timestamp: new Date().toISOString() // Fecha actual en formato ISO
    };

    // Enviar la asistencia al servidor
    this.http.post(this.apiUrl, asistencia).subscribe(
      () => {
        this.showAlert('Éxito', 'Asistencia registrada correctamente.');
      },
      (error) => {
        console.error('Error al registrar la asistencia:', error);
        this.showAlert('Error', 'Hubo un problema al registrar la asistencia.');
      }
    );
  }

  // Método para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
