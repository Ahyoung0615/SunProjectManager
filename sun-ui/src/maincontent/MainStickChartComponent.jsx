import React, { useEffect } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const MainStickChartComponent = () => {

  useEffect(() => {
    const ctx = document.getElementById("myBarChart")?.getContext('2d');

    if (ctx) {
      Chart.defaults.font.family = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
      Chart.defaults.color = '#292b2c';

      const myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{
            label: "Revenue",
            backgroundColor: "rgba(2,117,216,1)",
            borderColor: "rgba(2,117,216,1)",
            data: [4215, 5312, 6251, 7841, 9821, 14984],
          }],
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                maxTicksLimit: 6
              }
            },
            y: {
              min: 0,
              max: 15000,
              ticks: {
                maxTicksLimit: 5
              },
              grid: {
                display: true
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
        myBarChart.destroy();
      };
    }
  }, []);

  return (
    <div className="col-xl-12 d-flex justify-content-center"> {/* d-flex와 justify-content-center 사용 */}
      <div className="card mb-4" style={{ width: '100%', maxWidth: '600px' }}> {/* 차트 너비 조정 */}
        <div className="card-header">
          <i className="fas fa-chart-bar me-1"></i>
          근무 현황 그래프
        </div>
        <div className="card-body">
          <canvas id="myBarChart" width="100%" height="40"></canvas>
        </div>
      </div>
    </div>
  );
};

export default MainStickChartComponent;
