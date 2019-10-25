import { Component, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

export interface ChartConfig {
  size?: number;
  min?: number;
  max?: number;
  threshold?: GaugeValue[];
}

export interface StackedGaugeChartConfig extends ChartConfig {
  values: { value: number, color: string }[];
  unitLabel?: string;
}

export interface GaugeValue {
  from: number;
  to: number;
  color: string;
}

@Component({
  selector: 'app-stacked-gauge-chart',
  templateUrl: './stacked-gauge-chart.component.html',
  styleUrls: ['./stacked-gauge-chart.component.scss']
})
export class StackedGaugeChartComponent implements OnChanges {

  /** ID */
  @Input() id: string;

  /** コンフィグ */
  @Input() config: StackedGaugeChartConfig;

  /** ゲージ本体 */
  gauge: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;

  /** 表示エリアのサイズ */
  private areaSize: number;

  /** ゲージサイズ */
  private gaugeSize: number;

  /** ふぉんとさいず */
  private fontSize: number;

  /** 半径 */
  private radius: number;

  /** 中心のX座標 */
  private cx: number;

  /** 中心のY座標 */
  private cy: number;

  /** 最小値 */
  private min: number;

  /** 最大値 */
  private max: number;

  /** ゲージの最大値 */
  private gaugeMax: number;

  /** 最小-最大の幅 */
  private range: number;

  /** 値 */
  private values: GaugeValue[];

  /** 単位名 */
  private unit: string;

  /** アニメーション時間 */
  private transitionDuration = 500;

  /** 円周 */
  private circumference = 270;

  /** 値が無いエリアの色 */
  private NO_VALUE = 'rgba(224, 224, 224, 0.3)' as const;

  /**
   * コンストラクタ
   */
  constructor() { }

  /**
   * 変更検知
   */
  ngOnChanges() {
    if (this.config) {
      // 初期化
      this.init();
      // レンダリング
      this.rendering();
    }
  }

  /**
   * 初期処理
   */
  private init() {
    // コンフィグに従ってゲージ情報を初期化
    this.areaSize = this.config.size || 250;
    this.gaugeSize = this.areaSize * 0.9;
    this.fontSize = Math.round(this.gaugeSize / 12);
    this.radius = this.gaugeSize * 0.95 / 2;
    this.cx = this.gaugeSize / 2;
    this.cy = this.gaugeSize / 2;
    this.min = this.config.min || 0;
    this.max = this.config.max || 100;
    this.gaugeMax = this.max * 1.5;
    this.range = this.gaugeMax - this.min;
    this.values = this.config.values.reduce((acc, value, index) => {
      if ((index === 0)) {
        acc[index].to = value.value;
        acc[index].color = value.color;
        return acc;
      }
      acc.push({ from: acc[index - 1].to, to: acc[index - 1].to + value.value, color: value.color });
      return acc;
    }, [{ from: this.min, to: 0, color: '' }]);
    this.unit = this.config.unitLabel || '';
  }

  /**
   * レンダリング処理
   */
  private rendering() {
    // ゲージを生成
    this.gauge = d3.select('#' + this.id)
      .append('svg:svg')
      .attr('class', 'gauge')
      .attr('width', this.gaugeSize)
      .attr('height', this.gaugeSize);
    // ゲージを追加
    const outerGaugeRadius = { inner: 0.4 * this.radius, outer: 0.85 * this.radius };
    const innerGaugeRadius = { inner: 0.4 * this.radius, outer: 0.85 * this.radius * 0.88 };
    if (this.config.threshold) {
      this.config.threshold.forEach(value => this.drawBand(value, outerGaugeRadius));
    }
    this.values.forEach(value => this.drawBand(value, innerGaugeRadius));
    // ラベルを追加
    this.drawFraction();
    this.gauge.append('svg:text')
      .attr('x', this.cx)
      .attr('y', this.cy * 1.4)
      .attr('dy', this.fontSize / 2)
      .attr('text-anchor', 'middle')
      .text(`MB`)
      .style('font-size', this.fontSize * 1.2 + 'px')
      .style('fill', '#000')
      .style('stroke-width', '0px');
    // this.gauge.append('svg:g').attr('class', 'gauge-title-container')
    //   .selectAll('text')
    //   .data(this.config.values)
    //   .join('text')
    //   .attr('text-anchor', 'middle')
    //   .attr('transform', d => this.getTranslate(d.value / 2, 0.85 * 0.88))
    //   .call(text => text.append('tspan').text(d => d.value));
  }

  /**
   * ゲージを追加
   * @param value 値
   */
  private drawBand(value: GaugeValue, radius: { inner: number, outer: number }) {
    // to < from の場合は何もしない
    if (0 >= value.to - value.from) { return; }
    // ゲージに追加
    this.gauge.append('svg:path')
      .style('fill', value.color)
      .attr('d', this.getArc(value.from, value.to, radius.inner, radius.outer))
      .attr('transform', () => `translate(${this.cx}, ${this.cy}) rotate(${this.circumference})`);
  }

  private drawFraction() {
    const total = this.config.values.map(v => v.value).reduce((acc, value, i) => acc + value);
    [{ value: total, y: this.cy - this.fontSize * 1.2 }, { value: this.max, y: this.cy + this.fontSize * 0.2 }].forEach((value, i) => {
      this.gauge.append('svg:text')
        .attr('class', 'value-label')
        .attr('x', this.cx)
        .attr('y', value.y)
        .attr('dy', this.fontSize / 2)
        .attr('text-anchor', 'middle')
        .text(`${value.value}`)
        .style('font-size', this.fontSize + 'px')
        .style('fill', '#000')
        .style('stroke-width', '0px');
    });
    this.gauge.append('svg:line')
      .attr('x1', this.cx - 35)
      .attr('y1', this.cy - 6.5)
      .attr('x2', this.cx + 35)
      .attr('y2', this.cy - 6.5)
      .style('stroke', 'rgb(0,0,0)')
      .style('stroke-width', 1);
  }

  private getArc(from: number, to: number, inner: number, outer: number) {
    return d3.arc().startAngle(this.valueToRadians(from)).endAngle(this.valueToRadians(to)).innerRadius(inner).outerRadius(outer);
  }

  private getTranslate(value: number, factor: number) {
    const position = this.getValuePosition(value, factor);
    return `translate(${position.x}, ${position.y})`;
  }

  private getValuePosition(value: number, factor: number) {
    return {
      x: this.cx - this.radius * factor * Math.cos(this.valueToRadians(value)),
      y: this.cy - this.radius * factor * Math.sin(this.valueToRadians(value))
    };
  }

  /**
   * ラジアン取得
   * @param value 値
   */
  private valueToRadians(value: number) {
    return this.valueToDegrees(value) * Math.PI / 180;
  }

  /**
   * 角度取得
   * @param value 値
   * @return 角度
   */
  private valueToDegrees(value: number) {
    const tmp = (360 - this.circumference) / 2;
    return (value / this.range * this.circumference) - (this.min / this.range * this.circumference + tmp);
  }
}
