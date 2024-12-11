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
  studentId: string = '';
  private apiUrl = 'http://192.168.104.19:3000';

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private http: HttpClient,
    private asistenciaService: AsistenciaService
  ) {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    this.studentId = userSession.id || '';
  }

  ngOnInit() {
    if (this.platform.is("capacitor")) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }

    if (!this.studentId) {
      this.message = 'Error: No se pudo obtener la información del estudiante';
      console.error('No se encontró el ID del estudiante en la sesión');
    }
  }

  async startScan() {
    if (!this.studentId) {
      this.message = 'Error: Debes iniciar sesión nuevamente';
      return;
    }

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

            this.http.get<any[]>(`${this.apiUrl}/attendance`).subscribe(allAttendance => {
                try {
                    const today = new Date();
                    const todayStr = today.getUTCFullYear() + '-' + 
                                   String(today.getUTCMonth() + 1).padStart(2, '0') + '-' + 
                                   String(today.getUTCDate()).padStart(2, '0');

                    const alreadyRegistered = allAttendance.some(record => {
                        if (record.studentId === this.studentId && record.classId === classId) {
                            const recordDate = new Date(record.timestamp);
                            const recordDateStr = recordDate.getUTCFullYear() + '-' + 
                                                String(recordDate.getUTCMonth() + 1).padStart(2, '0') + '-' + 
                                                String(recordDate.getUTCDate()).padStart(2, '0');
                            
                            return recordDateStr === todayStr;
                        }
                        return false;
                    });

                    if (alreadyRegistered) {
                        this.message = 'Ya has registrado tu asistencia para hoy en esta clase.';
                        return;
                    }

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
                } catch (error) {
                    console.error('Error procesando fechas:', error);
                    this.message = 'Error al procesar las fechas';
                }
            });
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
