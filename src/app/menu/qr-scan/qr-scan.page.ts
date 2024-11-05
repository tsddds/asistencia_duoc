import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

  scanResult = "";
  studentId: string = '2'; // Reemplaza esto con la obtención del ID del estudiante autenticado

  private apiUrl = 'http://192.168.1.110:3000'; // Asegúrate de que esta URL sea correcta

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (this.platform.is("capacitor")) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  async startScan() {
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

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.scanResult = data?.barcode.displayValue;
      this.processScanResult();
    }
  }

  processScanResult() {
    // Extraer siglas y sección del resultado del escaneo
    const [siglas, seccion] = this.scanResult.split(' - ');

    // Obtener la clase correspondiente
    this.getClassBySubjectAndSection(siglas, seccion).subscribe(
      (classes) => {
        if (classes && classes.length > 0) {
          const classId = classes[0].id;
          const attendanceRecord = {
            id: this.generateId(),
            classId: classId,
            studentId: this.studentId,
            timestamp: new Date().toISOString()
          };
          // Guardar el registro de asistencia
          this.saveAttendance(attendanceRecord).subscribe(
            (response) => {
              console.log('Asistencia guardada', response);
              // Puedes mostrar un mensaje de éxito aquí
            },
            (error) => {
              console.error('Error al guardar la asistencia', error);
            }
          );
        } else {
          console.error('Clase no encontrada para las siglas y sección proporcionadas');
        }
      },
      (error) => {
        console.error('Error al obtener la clase', error);
      }
    );
  }

  getClassBySubjectAndSection(subject: string, section: string) {
    const url = `${this.apiUrl}/classes?subject=${subject}&section=${section}`;
    return this.http.get<any[]>(url);
  }

  saveAttendance(attendanceRecord: any) {
    const url = `${this.apiUrl}/attendance`;
    return this.http.post(url, attendanceRecord);
  }

  generateId() {
    return Math.random().toString(16).substr(2, 4);
  }
}
