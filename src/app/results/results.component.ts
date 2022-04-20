import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../shared/results.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  xCoordinate: number = this.resultsService.calculateXPosition();
  yCoordinate: number = this.resultsService.calculateYPosition();

  data: any = {
    datasets: [
      {
        label: 'Votre résultat',
        data: [{ x: this.xCoordinate, y: this.yCoordinate, r: 10 }],
        backgroundColor: '#f2440f',
      },
    ],
  };

  options: any = {
    scales: {
      x: {
        min: -4,
        max: 4,
        position: 'center',
        width: 50,
        ticks: {
          display: false,
        },
        grid: {
          borderWidth: 2,
          borderColor: 'black',
          lineWidth: 1,
        },
      },
      y: {
        min: -4,
        max: 4,
        position: 'center',
        ticks: {
          display: false,
        },
        grid: {
          borderWidth: 2,
          borderColor: 'black',
          lineWidth: 1,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'My Title',
        font: { size: 30, color: 'red' },
        color: '#15a608',
      },
      legend: {
        display: false,
      },
    },
  };

  constructor(private resultsService: ResultsService) {}

  ngOnInit(): void {}
}
