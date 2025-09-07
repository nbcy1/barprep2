import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export type ProgressPoint = {
  date: string
  score: number // percentage (0–100)
}

type Props = {
  data: ProgressPoint[]
}

export default function ProgressChart({ data }: Props) {
  const labels = data.map((p) => p.date)
  const scores = data.map((p) => p.score)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Performance (%)',
        data: scores,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.2
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Progress Over Time' }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (val: number | string) => `${val}%`
        }
      }
    }
  }

  return <Line data={chartData} options={options} />
}
