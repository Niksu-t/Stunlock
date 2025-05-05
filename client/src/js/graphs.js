import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

import { getThisWeeksWeekdays } from "./utils";
import { getAllKubiosResults } from "./fetch-api";

export const ChartResult = {
    EmptyDataset: "EmptyDataset",
    Success: "Success"
}

export async function drawRmssdGraph(data, ctx, labels) {
    const return_value = {
        average_rmssd: 0,
        empty: false
    }

    console.log(data)
    let average = 0;

    if(data.length) {
        const sum = (total, number) => total + number;
        const n =  data.reduce((count, num) => num > 0 ? count + 1 : count, 0)
        
        average = data.reduce(sum) / n;
        console.log(average)

        return_value.average_rmssd = average;

        if(!n) {
            return_value.empty = true;
        }
    }

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
            labels: labels,
            datasets: [{
                label: 'RMSSD',
                data: data,
                backgroundColor: 'rgba(247, 108, 94, 1)',
                fill: true,
                tension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 7,
                spanGaps: false,
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

    return return_value;
}

Chart.register(annotationPlugin);