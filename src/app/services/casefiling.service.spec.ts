import { TestBed } from '@angular/core/testing';

import { CasefilingService } from './casefiling.service';

describe('CasefilingService', () => {
  let service: CasefilingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasefilingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
