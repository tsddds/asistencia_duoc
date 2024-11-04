import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not change password if current password is incorrect', () => {
    localStorage.setItem('currentPassword', 'correctPassword');
    component.oldPassword = 'wrongPassword';
    component.newPassword = 'newPassword';
    component.confirmPassword = 'newPassword';
    spyOn(console, 'error');
    component.changePassword();
    expect(console.error).toHaveBeenCalledWith('Current password is incorrect');
  });

  it('should not change password if new passwords do not match', () => {
    localStorage.setItem('currentPassword', 'correctPassword');
    component.oldPassword = 'correctPassword';
    component.newPassword = 'newPassword';
    component.confirmPassword = 'differentPassword';
    spyOn(console, 'error');
    component.changePassword();
    expect(console.error).toHaveBeenCalledWith('New passwords do not match');
  });

  it('should change password if current password is correct and new passwords match', () => {
    localStorage.setItem('currentPassword', 'correctPassword');
    component.oldPassword = 'correctPassword';
    component.newPassword = 'newPassword';
    component.confirmPassword = 'newPassword';
    spyOn(console, 'log');
    component.changePassword();
    expect(console.log).toHaveBeenCalledWith('Password changed successfully');
    expect(localStorage.getItem('currentPassword')).toBe('newPassword');
  });
});