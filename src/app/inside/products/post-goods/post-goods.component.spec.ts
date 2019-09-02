import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGoodsComponent } from './post-goods.component';

describe('PostGoodsComponent', () => {
  let component: PostGoodsComponent;
  let fixture: ComponentFixture<PostGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
