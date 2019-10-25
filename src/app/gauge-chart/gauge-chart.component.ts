import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as c3 from 'c3';
import * as d3 from 'd3';

export interface RadiusData {
  radius: number;
  innerRadius: number;
}

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnInit, AfterViewInit {

  @Input() id = 'gauge-chart';

  private config: c3.ChartConfiguration;

  private chart: c3.ChartAPI;

  @Input() private boxSize = 0;

  @Input() private value = 0;

  @Input() private min = 0;

  @Input() private max = 0;

  @Input() private threshold = 0;

  constructor() { }

  ngOnInit() {
    this.config = {
      bindto: `#${this.id}`,
      data: {
        type: 'gauge',
        columns: [['利用量(MB)', this.value]]
      },
      gauge: {
        label: { format: (value, ratio): string => `${value}##${this.max}`, show: false },
        // label: { format: (value, ratio): string => (`${Math.floor(value / this.max * 100)}%`), show: true },
        min: this.min,
        max: this.max,
      },
      color: {
        pattern: ['#60B044', '#F6C600', '#FF0000'],
        threshold: {
          unit: 'value',
          max: this.max,
          values: [this.max * ((this.threshold !== 0) ? this.threshold : 0.9), this.max]
        }
      },
      size: {
        height: 180
      },
      onrendered: () => {
        d3.selectAll(`#${this.id} .value-text`).remove();
        d3.selectAll(`#${this.id} .thresholds-rect`).remove();
        if (this.threshold) {
          d3.selectAll(`#${this.id} .thresholds-line-0`).remove();
          d3.selectAll(`#${this.id} .thresholds-text-0`).remove();
          d3.selectAll(`#${this.id} .thresholds-line-1`).remove();
          d3.selectAll(`#${this.id} .thresholds-text-1`).remove();
          this.drawThresholds('#F6C600', this.threshold, 0);
          this.drawThresholds('#FF0000', 0.95, 1);
        }
        this.gaugeValueBreak();
        this.drawValue('#777');
      }
    };
  }

  ngAfterViewInit() {
    this.chart = c3.generate(this.config);
  }

  private gaugeValueBreak() {
    const element = d3.select(`#${this.id} .c3-gauge-value`);
    const value = element.text();
    const words = value.split('##');
    element.text('');
    words.forEach((word, i) => {
      const tspan = element.append('tspan').text(word);
      if (i === 0) {
        tspan.attr('y', -30);
      }
      if (i > 0) {
        tspan.attr('x', 0).attr('dy', 30).attr('text-decoration', 'overline');
      }
    });
  }

  private drawThresholds(color: string, threshold: number, index: number) {
    const radiusData = this.getRadiusData();
    const v = this.max * threshold;
    const angle = Math.PI * this.max * threshold / this.max;
    this.createLine(color, radiusData, angle, `thresholds-line-${index}`);
    // this.createBox(color, radiusData, angle);
    this.createText(color, radiusData, angle, v, `thresholds-text-${index}`, threshold);
  }

  private drawValue(color: string) {
    const radiusData = this.getRadiusData();
    this.createValue(color, radiusData, this.value);
  }

  private createValue(col: string, radiusData: RadiusData, v: number) {
    const textSize = this.measure(v, 'value-text');
    const angle = (v >= this.max) ? Math.PI * this.max / this.max : Math.PI * v / this.max;
    const color = (v >= this.max) ? 'white' : col;
    const x1 = (((radiusData.radius) * Math.cos(angle)) + textSize.width / 2) * 0.80;
    const y1 = (((radiusData.radius) * Math.sin(angle)) + textSize.height / 2) * 0.70;
    d3.select(`#${this.id} .c3-chart-arcs`).append('text')
      .attr('x', -x1)
      .attr('y', -y1)
      .attr('class', 'value-text')
      .attr('fill', color)
      .text(`${Math.floor(this.value / this.max * 100)}%`);
  }

  private createLine(col: string, radiusData: RadiusData, angle: number, className: string) {
    const x0 = (radiusData.innerRadius * Math.cos(angle));
    const y0 = (radiusData.innerRadius * Math.sin(angle));
    const x1 = (radiusData.radius * Math.cos(angle));
    const y1 = (radiusData.radius * Math.sin(angle));
    d3.select(`#${this.id} .c3-chart-arcs`).append('line')
      .attr('x1', -x0)
      .attr('y1', -y0)
      .attr('x2', -x1)
      .attr('y2', -y1)
      .attr('class', className)
      .style('stroke-width', 2)
      .style('stroke', col);
  }

  createBox(col: string, radiusData: RadiusData, angle: number) {
    const x1 = ((radiusData.radius + this.boxSize) * Math.cos(angle)) + this.boxSize / 2;
    const y1 = ((radiusData.radius + this.boxSize) * Math.sin(angle)) + this.boxSize / 2;
    d3.select(`#${this.id} .c3-chart-arcs`).append('rect')
      .attr('width', this.boxSize)
      .attr('height', this.boxSize)
      .attr('x', -x1)
      .attr('y', -y1)
      .attr('class', 'thresholds-rect')
      .style('fill', col)
      .style('stroke-width', 2)
      .style('stroke', col);
  }

  private createText(col: string, radiusData: RadiusData, angle: number, v: number, className: string, threshold: number) {
    const textSize = this.measure(threshold * 100, className);
    let x1 = ((radiusData.radius + this.boxSize) * Math.cos(angle)) + textSize.width / 2;
    const y1 = ((radiusData.radius + this.boxSize) * Math.sin(angle)) + textSize.height / 2 - 8;
    x1 = (threshold >= 0.5) ? x1 - 10 : x1 + 10;
    console.log(this.id, angle, radiusData.radius, this.boxSize, textSize.width);
    d3.select(`#${this.id} .c3-chart-arcs`).append('text')
      .attr('x', -x1)
      .attr('y', -y1)
      .attr('class', className)
      // .attr('fill', col)
      .attr('fill', '#777')
      // .style('stroke-width', 0)
      // .style('stroke', col)
      .text(`${threshold * 100}%`);
  }

  private getRadiusData(): RadiusData {
    const data = { radius: 0, innerRadius: 0 };
    // チャートのサイズ情報を取得
    const size = this.getChartSize();
    // ゲージの表示エリアのサイズを算出
    const radiusExpanded = (Math.min(size.width, size.height) / 2) * 0.85;
    // ゲージの外側のサイズを設定
    data.radius = radiusExpanded * 0.95;
    // ゲージの内側のサイズを設定
    data.innerRadius = data.radius * 0.58;
    return data;
  }

  private getChartSize(): { width: number, height: number } {
    const size = { width: 0, height: 0 };
    const svg = d3.select('svg').node() as Element;
    const legend = d3.select('.c3-legend-item-event').node() as any;
    size.width = svg.clientWidth;
    // チャートの高さから判例の高さを引いた値を取得
    const height = svg.clientHeight - 4 - ((this.config.padding) ? this.config.padding.top : 0) - legend.height.animVal.value;
    // 項目ラベルを表示する場合はサイズを考慮して高さを計算
    size.height = (height) + height - ((this.config.gauge.label.show) ? 20 : 0);
    return size;
  }

  private measure(text: number, className: string) {
    if (!text || text === 0) {
      return {
        height: 0,
        width: 0
      };
    }
    const container = d3.select('body').append('svg').attr('class', className);
    container.append('text')
      .attr('x', -1000)
      .attr('y', -1000)
      .text(text);
    const box = container.node().getBBox();
    console.dir(box);
    container.remove();
    return {
      height: box.height,
      width: box.width
    };
  }
}
