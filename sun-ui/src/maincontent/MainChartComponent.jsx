import React, { useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController);

const MainChartComponent = () => {

  useEffect(() => {
    const ctx = document.getElementById("myAreaChart")?.getContext('2d');

    if (ctx) {
      Chart.defaults.font.family = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
      Chart.defaults.color = '#292b2c';

      const myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7"],
          datasets: [{
            label: "Sessions",
            lineTension: 0.3,
            backgroundColor: "rgba(2,117,216,0.2)",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
          }],
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            },
            y: {
              min: 0,
              max: 40000,
              ticks: {
                maxTicksLimit: 5
              },
              grid: {
                color: "rgba(0, 0, 0, .125)",
              }
            },
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

      return () => {
        myLineChart.destroy();
      };
    }
  }, []);

  return (
<div className="col-xl-12 d-flex justify-content-center"> {/* d-flex와 justify-content-center 사용 */}
      <div className="card mb-4" style={{ width: '100%', maxWidth: '600px' }}> {/* 차트 너비 조정 */}
        <div className="card-header">
          <i className="fas fa-chart-area me-1"></i>
          월별 태양광모듈 생산량 추이
        </div>
        <div className="card-body">
          <canvas id="myAreaChart" width="100%" height="40"></canvas>
        </div>
      </div>
    </div>
  );
};

export default MainChartComponent;
