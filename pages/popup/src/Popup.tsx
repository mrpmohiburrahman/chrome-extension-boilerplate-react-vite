// src/popup.tsx
import React, { useEffect, useState } from 'react';
import '@src/Popup.css';

const MatchedItemsList: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0].id !== undefined) {
        chrome.runtime.sendMessage({ type: 'getMatchedItems', tabId: tabs[0].id }, response => {
          setItems(response || []);
          setLoading(false);
        });
      }
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (items.length === 0) {
    return <div>No matched items found.</div>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
          <a href={item} target="_blank" rel="noopener noreferrer">
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
};

const Popup: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <h1 className="text-xl mb-4">Matched Libraries</h1>
      <MatchedItemsList />
    </header>
  </div>
);

export default Popup;
