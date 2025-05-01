import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

import { getThisWeeksWeekdays } from "./utils";
import { getAllKubiosResults } from "./fetch-api";

export const ChartResult = {
    EmptyDataset: "EmptyDataset",
    Success: "Success"
}

export async function generateThisWeekGraph(state, data, ctx) {
    let chart_data = [];

    const weekdays = getThisWeeksWeekdays();

    let i = 0;
    weekdays.forEach(date => {
        if(data.Data[i]) {
            if(date == data.Data[i].date) {
                chart_data.push(data.Data[i].rmssd_ms);
                i++;
            }
        }
    });

    if(!chart_data.length) {
        return EmptyDataset
    }

    const sum = (total, number) => total + number;
    const average = chart_data.reduce(sum) / chart_data.length;

    state.average_rmssd = average;


    const annotation = {
        type: 'line',
        borderColor: 'rgba(109, 186, 161, 1)',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
          enabled: true,
          content: null,
          position: 'end'
        },
        scaleID: 'y',
        value: average
      };

    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'],
        datasets: [{
            label: 'RMSSD',
            data: chart_data,
            backgroundColor: 'rgba(247, 108, 94, 1)',
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
        },
        options: {
            maintainAspectRatio: false,

            plugins: {
                legend: {
                display: false
                },
                tooltip: {
                mode: 'index',
                intersect: false
                },

                annotation: {
                    annotations: {
                      annotation
                    }
                  }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

Chart.register(annotationPlugin);