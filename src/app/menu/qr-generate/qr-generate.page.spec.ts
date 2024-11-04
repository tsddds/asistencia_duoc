import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrGeneratePage } from './qr-generate.page';

describe('QrGeneratePage', () => {
  let component: QrGeneratePage;
  let fixture: ComponentFixture<QrGeneratePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrGeneratePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
