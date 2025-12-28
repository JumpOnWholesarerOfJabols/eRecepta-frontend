import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSpecializationComponent } from './manage-specialization.component';

describe('ManageSpecializationComponent', () => {
  let component: ManageSpecializationComponent;
  let fixture: ComponentFixture<ManageSpecializationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSpecializationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSpecializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
