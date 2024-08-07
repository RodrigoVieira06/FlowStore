import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import { of } from 'rxjs';
import { LoadingService } from '../../services/loading/loading.service';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingComponent]
    })
      .compileComponents();

      fixture = TestBed.createComponent(LoadingComponent);
      component = fixture.componentInstance;
      loadingService = TestBed.inject(LoadingService);
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoading to false when LoadingService emits false', () => {
    loadingService.isLoading = of(false);
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });
});
