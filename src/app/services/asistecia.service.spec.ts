import { TestBed } from '@angular/core/testing';

import { AsisteciaService } from './asistecia.service';

describe('AsisteciaService', () => {
  let service: AsisteciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsisteciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
