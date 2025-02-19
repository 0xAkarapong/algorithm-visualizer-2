// app/page.tsx
'use client';

import { useState } from 'react';
import AlgorithmSelector from './components/AlgorithmSelector';
import Visualizer from './components/Visualizer'; 

interface Algorithm {
  name: string;
  type: string;
}

const Page: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  const handleAlgorithmSelect = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  return (
    <main className="p-4">
      <AlgorithmSelector onAlgorithmSelect={handleAlgorithmSelect} />
      {selectedAlgorithm && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Visualizing: {selectedAlgorithm.name}</h2>
          <Visualizer algorithm={selectedAlgorithm} />
        </div>
      )}
    </main>
  );
};

export default Page;