import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestfirebaseComponent } from './testfirebase.component';

describe('TestfirebaseComponent', () => {
  let component: TestfirebaseComponent;
  let fixture: ComponentFixture<TestfirebaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestfirebaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestfirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
