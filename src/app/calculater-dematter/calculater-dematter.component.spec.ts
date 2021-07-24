import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculaterDematterComponent } from './calculater-dematter.component';

describe('CalculaterDematterComponent', () => {
  let component: CalculaterDematterComponent;
  let fixture: ComponentFixture<CalculaterDematterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculaterDematterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculaterDematterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
