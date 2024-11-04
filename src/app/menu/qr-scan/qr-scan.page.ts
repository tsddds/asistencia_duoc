import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {

  scanResult="";

  constructor(private modalController: ModalController, private platform:Platform) { }

  ngOnInit() {
    if(this.platform.is("capacitor")){
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  async startScan() {
    const modal = await this.modalController.create({
    component: BarcodeScanningModalComponent,
    cssClass:'barcode-scanning-modal',
    showBackdrop:false,
    componentProps: { 
      formats:[],
      lensFacing:LensFacing.Back
     }
    });
  
    await modal.present();

    const {data} = await modal.onWillDismiss();

    if(data){
      this.scanResult = data?.barcode.displayValue;
    }
  
  }

}
