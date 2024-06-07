// src/SidePanel.tsx
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import React, { useEffect, useState } from 'react';
import '@src/SidePanel.css';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';

const DataList: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(['categoryData'], result => {
      setData(result.categoryData || {});
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="space-y-2">
      {Object.keys(data).map(key => (
        <li key={key} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
          {key}
        </li>
      ))}
    </ul>
  );
};

const SidePanel: React.FC = () => {
  const theme = useStorageSuspense(exampleThemeStorage);

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#eee' : '#222',
        color: theme === 'light' ? '#222' : '#eee',
      }}>
      <header className="App-header">
        <img src={chrome.runtime.getURL('sidepanel/logo.svg')} className="App-logo" alt="logo" />
        <h1 className="text-xl mb-4">Library Names</h1>
        <DataList />
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
