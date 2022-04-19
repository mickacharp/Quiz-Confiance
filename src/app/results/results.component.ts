import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../shared/results.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  data: any = {
    datasets: [
      {
        label: 'First Dataset',
        data: [0],
      },
    ],
  };

  options: any = {
    scales: {
      x: {
        position: 'center',
      },
      y: {
        position: 'center',
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
        position: 'bottom',
      },
    },
  };

  constructor(private resultsService: ResultsService) {}

  ngOnInit(): void {}
}
