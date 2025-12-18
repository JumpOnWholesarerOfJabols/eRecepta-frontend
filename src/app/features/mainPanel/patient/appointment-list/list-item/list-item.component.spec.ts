import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitListItemComponent } from './list-item.component';

describe('ListItemComponent', () => {
  let component: VisitListItemComponent;
  let fixture: ComponentFixture<VisitListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
