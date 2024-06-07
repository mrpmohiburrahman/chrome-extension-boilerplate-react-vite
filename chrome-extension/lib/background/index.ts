import 'webextension-polyfill';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');

function fetchDataAndStore() {
  fetch('https://cdn.jsdelivr.net/gh/mrpmohiburrahman/category-selector-with-cdn/data/uniqueCategoryToLib.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched and storing data:', data);
      chrome.storage.local.set({ categoryData: data });
    })
    .catch(error => {
      console.error('Error fetching data from CDN:', error);
    });
}

// Fetch data initially and then periodically (every 24 hours)
fetchDataAndStore();
setInterval(fetchDataAndStore, 24 * 60 * 60 * 1000);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('github.com')) {
    if (/https:\/\/github\.com\/[^\/]+\/[^\/]+/.test(tab.url)) {
      chrome.storage.local.get(['categoryData'], result => {
        const data = result.categoryData;
        const numberOfKeys = data ? Object.keys(data).length : '0';
        chrome.action.setBadgeText({ text: numberOfKeys.toString(), tabId: tabId });
      });
    } else {
      chrome.action.setBadgeText({ text: '', tabId: tabId });
    }
  }
});
