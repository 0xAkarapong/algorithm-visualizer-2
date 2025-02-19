// app/components/AlgorithmSelector.tsx
//import { on } from 'events';
import React, { useState } from 'react';

interface Algorithm {
  name: string;
  type: string;
}

interface AlgorithmSelectorProps {
  onAlgorithmSelect: (algorithm: Algorithm) => void;
}
const algorithms: Algorithm[] = [
  { name: 'Bubble Sort', type: 'Sorting' },
  { name: 'Insertion Sort', type: 'Sorting' },
  { name: 'Merge Sort', type: 'Sorting' },
  { name: 'Binary Search', type: 'Searching' },
  { name: 'Depth-First Search', type: 'Graph' },
  { name: 'Breadth-First Search', type: 'Graph' },
  { name: 'Dijkstra\'s Algorithm', type: 'Graph' },
];

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ onAlgorithmSelect }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  const handleAlgorithmSelect = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    onAlgorithmSelect(algorithm);
    console.log("Selected Algorithm:", algorithm.name);
  };

  const categorizedAlgorithms = algorithms.reduce((acc: { [key: string]: Algorithm[] }, algorithm) => {
    if (!acc[algorithm.type]) {
      acc[algorithm.type] = [];
    }
    acc[algorithm.type].push(algorithm);
    return acc;
  }, {});

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-semibold mb-2">Select Algorithm</h2>
      {Object.entries(categorizedAlgorithms).map(([type, algs]) => (
        <div key={type} className="mb-4">
          <h3 className="text-md font-medium mb-1">{type}</h3>
          <ul>
            {algs.map((algorithm) => (
              <li key={algorithm.name} className="cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => handleAlgorithmSelect(algorithm)}>
                {algorithm.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {selectedAlgorithm && (
        <p className="mt-2">Selected: {selectedAlgorithm.name}</p>
      )}
    </div>
  );
};

export default AlgorithmSelector;