import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssuePrescriptionComponent } from './issue-prescription.component';

describe('IssuePrescriptionComponent', () => {
  let component: IssuePrescriptionComponent;
  let fixture: ComponentFixture<IssuePrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuePrescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IssuePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
