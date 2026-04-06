import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsPreview } from './slots-preview';

describe('SlotsPreview', () => {
  let component: SlotsPreview;
  let fixture: ComponentFixture<SlotsPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotsPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(SlotsPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
