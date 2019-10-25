import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartComponent } from './chart/chart.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TrafficCardComponent } from './traffic-card/traffic-card.component';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';
import { StackedGaugeChartComponent } from './stacked-gauge-chart/stacked-gauge-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    TrafficCardComponent,
    GaugeChartComponent,
    StackedGaugeChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
