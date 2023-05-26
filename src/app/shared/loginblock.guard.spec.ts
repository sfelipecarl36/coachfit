import { TestBed } from '@angular/core/testing';

import { LoginblockGuard } from './loginblock.guard';

describe('LoginblockGuard', () => {
  let guard: LoginblockGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginblockGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
