// src/popup.tsx
import React, { useEffect, useState } from 'react';
import '@src/Popup.css';

const MatchedItemsList: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    chrome.storage.local.get(['matchedItems'], result => {
      setItems(result.matchedItems || []);
    });
  }, []);

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
          {item}
        </li>
      ))}
    </ul>
  );
};

const Popup: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <h1 className="text-xl mb-4">Matched Items</h1>
      <MatchedItemsList />
    </header>
  </div>
);

export default Popup;
