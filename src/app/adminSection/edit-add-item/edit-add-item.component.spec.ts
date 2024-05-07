import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddItemComponent } from './edit-add-item.component';

describe('EditAddItemComponent', () => {
  let component: EditAddItemComponent;
  let fixture: ComponentFixture<EditAddItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAddItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
