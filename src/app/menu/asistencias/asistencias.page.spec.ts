import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AsistenciasPage } from './asistencias.page';
import { AsistenciaService } from '../../services/asistecia.service';
import { of, throwError } from 'rxjs';

describe('AsistenciasPage', () => {
  let component: AsistenciasPage;
  let fixture: ComponentFixture<AsistenciasPage>;
  let asistenciaServiceSpy: jasmine.SpyObj<AsistenciaService>;

  const mockAsistencias = [
    { fecha: '2024-03-20', presente: true, subject: 'PGY4121' },
    { fecha: '2024-03-21', presente: false, subject: 'PGY4121' },
    { fecha: '2024-03-20', presente: true, subject: 'BDD4121' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AsistenciaService', ['getStudentAttendance']);
    spy.getStudentAttendance.and.returnValue(of(mockAsistencias));

    await TestBed.configureTestingModule({
      declarations: [AsistenciasPage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: AsistenciaService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AsistenciasPage);
    component = fixture.componentInstance;
    asistenciaServiceSpy = TestBed.inject(AsistenciaService) as jasmine.SpyObj<AsistenciaService>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con objeto vacío', () => {
    const nuevoComponente = new AsistenciasPage(asistenciaServiceSpy);
    expect(Object.keys(nuevoComponente.asistenciasPorAsignatura).length).toBe(0);
  });

  it('debería llamar a loadAsistencias en ngOnInit', () => {
    spyOn(component, 'loadAsistencias');
    component.ngOnInit();
    expect(component.loadAsistencias).toHaveBeenCalled();
  });

  it('debería llamar al servicio de asistencias', fakeAsync(() => {
    component.loadAsistencias();
    tick();
    expect(asistenciaServiceSpy.getStudentAttendance).toHaveBeenCalled();
  }));

  it('debería organizar asistencias', () => {
    component.organizeAsistencias(mockAsistencias);
    expect(Object.keys(component.asistenciasPorAsignatura).length).toBe(2);
  });

  it('debería contar asistencias correctamente', () => {
    component.organizeAsistencias(mockAsistencias);
    expect(component.asistenciasPorAsignatura['PGY4121'].length).toBe(2);
    expect(component.asistenciasPorAsignatura['BDD4121'].length).toBe(1);
  });

  it('debería manejar array vacío', () => {
    component.organizeAsistencias([]);
    expect(Object.keys(component.asistenciasPorAsignatura).length).toBe(0);
  });

  it('debería manejar error de carga', fakeAsync(() => {
    asistenciaServiceSpy.getStudentAttendance.and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    component.loadAsistencias();
    tick();
    expect(console.error).toHaveBeenCalled();
  }));
});
