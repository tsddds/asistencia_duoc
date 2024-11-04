import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClasesACargoPage } from './clases-a-cargo.page';

describe('ClasesACargoPage', () => {
  let component: ClasesACargoPage;
  let fixture: ComponentFixture<ClasesACargoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasesACargoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
