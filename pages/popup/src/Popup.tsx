// src/popup.tsx
import React, { useEffect, useState } from 'react';
import '@src/Popup.css';
import { Library } from './types';

const MatchedItemsList: React.FC = () => {
  const [items, setItems] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0].id !== undefined) {
        chrome.runtime.sendMessage({ type: 'getMatchedItems', tabId: tabs[0].id }, (response: Library[]) => {
          setItems(response || []);
          setLoading(false);
        });
      }
    });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (items.length === 0) {
    return <div className="no-items">No matched items found.</div>;
  }

  return (
    <div className="item-list">
      {items.map((item, index) => (
        <div key={index} className="item-card">
          <div className="item-header">
            <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="item-link">
              {item.npmPkg || 'No NPM Package'}
            </a>
            {item.goldstar && <span className="gold-star">Recommended</span>}
          </div>
          <div className="item-body">
            {item.matchingScoreModifiers && item.matchingScoreModifiers.length > 0 && (
              <div className="tags">
                {item.matchingScoreModifiers.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
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
