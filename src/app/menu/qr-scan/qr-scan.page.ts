import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AsistenciaService } from '../../services/asistecia.service';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

  scanResult = "";
  message = "";
  studentId: string = '2'; // Reemplaza esto con la obtención del ID del estudiante autenticado

  private apiUrl = 'http://192.168.1.110:3000'; // Asegúrate de que esta URL sea correcta

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private http: HttpClient,
    private asistenciaService: AsistenciaService
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
    const [siglas, seccion] = this.scanResult.split(' - ');

    this.asistenciaService.getClasses().subscribe(classes => {
      const classFound = classes.find(cl => cl.subject === siglas && cl.section === seccion);
      if (classFound) {
        const classId = classFound.id;
        const attendanceRecord = {
          id: this.generateId(),
          classId: classId,
          studentId: this.studentId,
          timestamp: new Date().toISOString()
        };
        this.saveAttendance(attendanceRecord).subscribe(
          response => {
            this.message = `Se ha marcado la asistencia en la clase ${this.scanResult}`;
            console.log('Asistencia guardada', response);
          },
          error => {
            this.message = 'Error al guardar la asistencia';
            console.error('Error al guardar la asistencia', error);
          }
        );
      } else {
        this.message = 'El usuario no está registrado en esta clase';
        console.error('El usuario no está registrado en esta clase');
      }
    });
  }

  saveAttendance(attendanceRecord: any) {
    const url = `${this.apiUrl}/attendance`;
    return this.http.post(url, attendanceRecord);
  }

  generateId() {
    return Math.random().toString(16).substr(2, 4);
  }
}
