import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';



ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            display:false
        },
        title: {
            display: false,
            // text: 'Free Gala Area Chart ',
        },
    },

};


export default function BarChart({ monthYear, galaAreaSize }) {
    const labels = Object.values(monthYear)

    const data = {
        labels,
        datasets: [
            {
                label: 'Gala Area Size',
                data: galaAreaSize,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgb(152, 223, 88)',
                    'rgb(249, 221, 81)',
                    'rgb(236, 100, 100)',
                    'rgb(36, 220, 212)',
                    'rgb(236, 100, 165)',
                    'rgb(48, 144, 240)'
                ],
                

            }

        ],
    };

    return <Bar options={options} data={data} className="bar_graph" />;

}


