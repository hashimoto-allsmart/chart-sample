import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedGaugeChartComponent } from './stacked-gauge-chart.component';

describe('StackedGaugeChartComponent', () => {
  let component: StackedGaugeChartComponent;
  let fixture: ComponentFixture<StackedGaugeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedGaugeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedGaugeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
