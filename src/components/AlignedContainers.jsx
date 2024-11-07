import React from 'react';

const AlignedContainers = ({ data = [], itemsPerRow = 0, containerClassName }) => {
  const isOneRow = itemsPerRow <= 0;

  return (
    <div className={`flex flex-col gap-4 ${containerClassName || ''}`}>
      {data.map((items, index) => (
        <div key={index} className={`flex flex-col gap-4 ${containerClassName || ''}`}>
          {isOneRow ? (
            // Display all items in one row
            <div className="flex flex-row gap-4 flex-wrap">
              {items.map((item, itemIndex) => (
                <div key={itemIndex} className="break-words flex-1">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            // Split items between top and bottom containers
            <>
              {/* Top container */}
              <div className="flex flex-row gap-4 flex-wrap justify-center">
                {items.slice(0, itemsPerRow).map((item, itemIndex) => (
                  <div key={itemIndex} className="break-words">
                    {item}
                  </div>
                ))}
              </div>
              {/* Bottom container */}
              <div className="flex flex-row gap-4 flex-wrap justify-center">
                {items.slice(itemsPerRow).map((item, itemIndex) => (
                  <div key={itemIndex} className="break-words">
                    {item}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlignedContainers;