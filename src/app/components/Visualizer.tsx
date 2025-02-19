// app/components/Visualizer.tsx
import { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Algorithm from './AlgorithmSelector';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VisualizerProps {
  algorithm: Algorithm;
}

const Visualizer: React.FC<VisualizerProps> = ({ algorithm }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<ChartJS | null>(null);
  const [data, setData] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [animationSpeed, setAnimationSpeed] = useState(200); // Initial speed
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const initialData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50));
    setData(initialData);
  }, [algorithm]);

  useEffect(() => {
    if (data && algorithm) {
      switch (algorithm.name) {
        case 'Bubble Sort':
          setSteps(performBubbleSort(data.slice()));
          break;
        case 'Insertion Sort':
          setSteps(performInsertionSort(data.slice()));
          break;
        case 'Merge Sort':
          setSteps(performMergeSort(data.slice()));
          break;
        default:
          setSteps([]);
      }
    }
  }, [data, algorithm]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (chartRef.current && steps.length > 0 && isPlaying) {
      if (!chart) {
        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
          const newChart = new ChartJS(ctx, {
            type: 'line',
            data: {
              labels: data.map((_, i) => i),
              datasets: [
                {
                  label: algorithm.name,
                  data: data,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.4,
                },
              ],
            },
            options: {
              responsive: true,
            },
          });
          setChart(newChart);
        }
      }

      interval = setInterval(() => {
        if (currentStep < steps.length) {
          setData(steps[currentStep]);
          setCurrentStep(currentStep + 1);
        } else {
          if (interval) {
            clearInterval(interval);
          }
          setIsPlaying(false); // Stop when finished
          setCurrentStep(0); // Reset for next run
        }
      }, animationSpeed);
    } else if (chart) {
      chart.data.datasets[0].data = data;
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (chart) {
        chart.destroy();
        setChart(null); // Reset chart
      }
    };
  }, [chartRef, steps, algorithm, isPlaying, animationSpeed, currentStep, data]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationSpeed(Number(event.target.value));
  };

  // Algorithm Implementations 
  function performBubbleSort(arr: number[]): number[][] {
    const steps: number[][] = [arr.slice()];
    const n = arr.length;
    let swapped: boolean;
    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;
          steps.push(arr.slice());
        }
      }
    } while (swapped);
    return steps;
  }

  function performInsertionSort(arr: number[]): number[][] {
    const steps: number[][] = [arr.slice()];
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
        steps.push(arr.slice());
      }
      arr[j + 1] = key;
      steps.push(arr.slice());
    }
    return steps;
  }

  function performMergeSort(arr: number[]): number[][] {
    const steps: number[][] = [];

    function mergeSortRecursive(arr: number[], start: number, end: number): void {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        mergeSortRecursive(arr, start, mid);
        mergeSortRecursive(arr, mid + 1, end);
        merge(arr, start, mid, end);
      }
    }

    function merge(arr: number[], start: number, mid: number, end: number): void {
      const n1 = mid - start + 1;
      const n2 = end - mid;

      const left = new Array(n1);
      const right = new Array(n2);

      for (let i = 0; i < n1; i++) left[i] = arr[start + i];
      for (let j = 0; j < n2; j++) right[j] = arr[mid + 1 + j];

      let i = 0, j = 0, k = start;

      while (i < n1 && j < n2) {
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }
        k++;
        steps.push(arr.slice());
      }

      while (i < n1) {
        arr[k] = left[i];
        i++;
        k++;
        steps.push(arr.slice());
      }

      while (j < n2) {
        arr[k] = right[j];
        j++;
        k++;
        steps.push(arr.slice());
      }
    }

    mergeSortRecursive(arr, 0, arr.length - 1);
    return steps;
  }



  return (
    <div>
      <canvas ref={chartRef} />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <input type="range" min="50" max="1000" value={animationSpeed} onChange={handleSpeedChange} />
      <span>Speed: {animationSpeed}ms</span>
    </div>
  );
};

export default Visualizer;