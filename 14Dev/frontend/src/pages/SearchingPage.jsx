import React, { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import SearchingVisualizer from '../algorithm-visualizer/components/SearchingVisualizer';
import { linearSearch, linearSearchInfo } from '../algorithm-visualizer/algorithms/searching/linearSearch';
import { binarySearch, binarySearchInfo } from '../algorithm-visualizer/algorithms/searching/binarySearch';

const SearchingPage = () => {
  const algorithms = [
    { name: 'Linear Search', algorithm: linearSearch, info: linearSearchInfo },
    { name: 'Binary Search', algorithm: binarySearch, info: binarySearchInfo },
  ];

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to="/algorithm-visualizer"
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-700/50"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Visualizer Home</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-white">Searching Algorithms</h1>
          
          <div className="w-32"></div>
        </div>
      </div>

      {/* Algorithm Selector */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {algorithms.map((algo, index) => (
              <button
                key={index}
                onClick={() => setSelectedAlgorithm(algo)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedAlgorithm.name === algo.name
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-105'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="container mx-auto p-4 h-[calc(100vh-180px)]">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-lg shadow-2xl h-full overflow-hidden border border-slate-700">
          <SearchingVisualizer
            algorithm={selectedAlgorithm.algorithm}
            algorithmInfo={selectedAlgorithm.info}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchingPage;