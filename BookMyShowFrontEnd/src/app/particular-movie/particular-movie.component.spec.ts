import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularMovieComponent } from './particular-movie.component';

describe('ParticularMovieComponent', () => {
  let component: ParticularMovieComponent;
  let fixture: ComponentFixture<ParticularMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticularMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticularMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
