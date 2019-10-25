import { Component, OnInit } from '@angular/core';
import * as c3 from 'c3';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  chart: c3.ChartAPI;

  // chart: Chartist.IChartistLineChart;

  constructor() { }

  ngOnInit() {
    // const data = {
    //   labels: ['利用量'],
    //   series: [
    //     [10],
    //     [5],
    //     [2],
    //   ],
    // };
    // const config = {
    //   stackBars: true,
    //   horizontalBars: true
    // };
    // this.chart = new Chartist.Bar('.ct-chart', data, config);
    this.chart = c3.generate({
      bindto: '#pattern-1',
      padding: {
        left: 2
      },
      data: {
        type: 'bar',
        columns: [
          ['roaming', 60],
          ['domestic', 30],
          // ['カスタマイズ(システム)', 40],
          // ['カスタマイズ(ユーザ)', 20],
        ],
        names: {
          roaming: '国際ローミング',
          domestic: '国内'
        },
        groups: [
          ['roaming', 'domestic'],
          // ['カスタマイズ(システム)', 'カスタマイズ(ユーザ)']
        ],
        order: null
      },
      bar: {
        width: {
          ratio: 0.3
        }
      },
      color: {
        pattern: [

        ]
      },
      legend: {
        // position: 'right'
      },
      grid: {
        y: {
          lines: [{ value: 100 }]
        }
      },
      size: {
        height: 200, width: 200
      },
      axis: {
        x: {
          type: 'category', categories: ['利用量', 'カスタマイズ利用量'],
          show: false,
          tick: {
            fit: true
          }
        },
        y: {
          tick: {
            // values: [100]
          },
          max: 100,
        },
        // rotated: true
      }
    });
  }

}
