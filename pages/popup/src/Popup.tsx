// src/Popup.tsx
import React from 'react';
import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import DataList from './DataList';

const Popup = () => {
  const theme = useStorageSuspense(exampleThemeStorage);

  return (
    <div
      className="App p-4"
      style={{
        backgroundColor: theme === 'light' ? '#eee' : '#222',
        color: theme === 'light' ? '#222' : '#eee',
      }}>
      <header className="App-header">
        <img src={chrome.runtime.getURL('newtab/logo.svg')} className="App-logo" alt="logo" />
        <h1 className="text-xl mb-4">Library Names</h1>
        <DataList />
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
