import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateRoot']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 
  it('debería crear el componente', () => {
    
    expect(component).toBeTruthy();
  });

 
  it('debería inicializar sin valores por defecto', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });

  it('debería limpiar los campos', () => {
    component.username = 'test';
    component.password = '123';
    component.clearFields();
    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });

  it('debería navegar a registro', () => {
    component.goToSignUp();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sign']);
  });

  it('debería cambiar visibilidad de contraseña', () => {
    component.togglePasswordVisibility();
    expect(component.passwordType).toBe('text');
    expect(component.passwordIcon).toBe('eye');
  });

  it('debería mostrar alerta con campos vacíos', fakeAsync(() => {
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));
    component.login();
    tick();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  }));

  it('debería navegar al home con login exitoso', fakeAsync(() => {
    component.username = 'test@test.com';
    component.password = '123456';
    authServiceSpy.login.and.returnValue(of(true));
    component.login();
    tick();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith('/home');
  }));
});
