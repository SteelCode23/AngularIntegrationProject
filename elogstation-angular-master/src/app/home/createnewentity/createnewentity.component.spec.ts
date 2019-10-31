import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatenewentityComponent } from './createnewentity.component';

describe('CreatenewentityComponent', () => {
  let component: CreatenewentityComponent;
  let fixture: ComponentFixture<CreatenewentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatenewentityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatenewentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
