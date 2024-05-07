import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevinueComponent } from './revinue.component';

describe('RevinueComponent', () => {
  let component: RevinueComponent;
  let fixture: ComponentFixture<RevinueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevinueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RevinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
