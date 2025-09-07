import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export type WeakArea = {
  category: string
  accuracy: number // percentage (0–100)
}

type Props = {
  data: WeakArea[]
}

export default function WeakAreasChart({ data }: Props) {
  const labels = data.map((w) => w.category)
  const scores = data.map((w) => w.accuracy)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Accuracy (%)',
        data: scores,
        backgroundColor: 'rgba(153,102,255,0.6)'
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Accuracy by Category' }
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

  return <Bar data={chartData} options={options} />
}
