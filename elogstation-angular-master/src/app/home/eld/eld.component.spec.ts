import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldComponent } from './eld.component';

describe('EldComponent', () => {
  let component: EldComponent;
  let fixture: ComponentFixture<EldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
