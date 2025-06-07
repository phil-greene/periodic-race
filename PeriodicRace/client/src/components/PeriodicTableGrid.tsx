import { elements as allElements } from "@/data/elements";

interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  gridColumn: number;
  gridRow: number;
  category: string;
}

interface PeriodicTableGridProps {
  elements: Element[];
  filledElements: Set<number>;
  currentElementIndex: number;
  isPlaying: boolean;
}

export default function PeriodicTableGrid({ 
  elements, 
  filledElements, 
  currentElementIndex, 
  isPlaying 
}: PeriodicTableGridProps) {
  
  const getCategoryClass = (category: string) => {
    const categoryMap: Record<string, string> = {
      'alkali-metal': 'element-alkali-metal',
      'alkaline-earth': 'element-alkaline-earth',
      'transition-metal': 'element-transition-metal',
      'post-transition': 'element-post-transition',
      'metalloid': 'element-metalloid',
      'nonmetal': 'element-nonmetal',
      'halogen': 'element-halogen',
      'noble-gas': 'element-noble-gas',
      'lanthanide': 'element-lanthanide',
      'actinide': 'element-actinide'
    };
    return categoryMap[category] || 'element-nonmetal';
  };

  const getElementStatus = (element: Element) => {
    if (filledElements.has(element.atomicNumber)) {
      return 'filled';
    }
    if (isPlaying && currentElementIndex < elements.length && 
        element.atomicNumber === elements[currentElementIndex].atomicNumber) {
      return 'target';
    }
    return 'empty';
  };

  // Separate main table elements from lanthanides and actinides
  const mainTableElements = allElements.filter(el => el.gridRow <= 7);
  const lanthanides = allElements.filter(el => el.gridRow === 8);
  const actinides = allElements.filter(el => el.gridRow === 9);

  return (
    <div className="mb-2">
      <div className="bg-white rounded-lg shadow-lg p-2">
        {/* Main Periodic Table Grid */}
        <div className="periodic-table-container overflow-auto">
          <div className="periodic-grid">
            {mainTableElements.map((element) => {
              const status = getElementStatus(element);
              const categoryClass = status === 'filled' ? getCategoryClass(element.category) : '';
              
              return (
                <div
                  key={element.atomicNumber}
                  className={`element-square ${status} ${categoryClass}`}
                  style={{
                    gridColumn: element.gridColumn,
                    gridRow: element.gridRow
                  }}
                  data-element={element.atomicNumber}
                  title={`${element.name} (${element.symbol}) - Atomic #${element.atomicNumber}`}
                >
                  <div className="element-number">{element.atomicNumber}</div>
                  <div className="element-symbol">
                    {status === 'filled' ? element.symbol : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lanthanides and Actinides */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-center mb-2">
            <span className="text-xs font-medium text-gray-600">Lanthanides & Actinides</span>
          </div>
          
          {/* Lanthanides Row */}
          <div className="mb-2">
            <div className="text-xs font-medium text-gray-500 mb-1 text-center">
              Lanthanides (57-71)
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {lanthanides.map((element) => {
                const status = getElementStatus(element);
                const categoryClass = status === 'filled' ? getCategoryClass(element.category) : '';
                
                return (
                  <div
                    key={element.atomicNumber}
                    className={`element-square ${status} ${categoryClass}`}
                    data-element={element.atomicNumber}
                    title={`${element.name} (${element.symbol}) - Atomic #${element.atomicNumber}`}
                  >
                    <div className="element-number">{element.atomicNumber}</div>
                    <div className="element-symbol">
                      {status === 'filled' ? element.symbol : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actinides Row */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1 text-center">
              Actinides (89-103)
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {actinides.map((element) => {
                const status = getElementStatus(element);
                const categoryClass = status === 'filled' ? getCategoryClass(element.category) : '';
                
                return (
                  <div
                    key={element.atomicNumber}
                    className={`element-square ${status} ${categoryClass}`}
                    data-element={element.atomicNumber}
                    title={`${element.name} (${element.symbol}) - Atomic #${element.atomicNumber}`}
                  >
                    <div className="element-number">{element.atomicNumber}</div>
                    <div className="element-symbol">
                      {status === 'filled' ? element.symbol : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-500 mb-1 text-center">Element Categories</div>
          <div className="flex flex-wrap justify-center gap-1 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
              <span>Alkali Metals</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-200 border border-orange-300 rounded"></div>
              <span>Alkaline Earth</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
              <span>Transition Metals</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
              <span>Nonmetals</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-200 border border-purple-300 rounded"></div>
              <span>Halogens</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-pink-200 border border-pink-300 rounded"></div>
              <span>Noble Gases</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
