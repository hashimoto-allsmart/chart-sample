import { Component } from '@angular/core';
import { StackedGaugeChartConfig } from './stacked-gauge-chart/stacked-gauge-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sample';
  config: StackedGaugeChartConfig = {
    max: 10000,
    threshold: [
      { from: 0, to: 8000, color: 'rgba(0, 141, 92, 0.2)' },
      { from: 8000, to: 9000, color: 'rgba(252, 211, 0, 0.2)' },
      { from: 9000, to: 10000, color: 'rgba(249, 120, 0, 0.2)' },
      { from: 10000, to: 15000, color: 'rgba(204, 67, 39, 0.2)' }
    ],
    values: [{ value: 1000, color: '#006b9f' }, { value: 7500, color: '#4eb9cb' }]
  };
}
