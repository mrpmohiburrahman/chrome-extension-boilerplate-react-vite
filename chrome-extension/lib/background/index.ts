import 'webextension-polyfill';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import { Library, UniqueCategoryData } from './types';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');

async function fetchJsonData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function fetchDataAndStore() {
  try {
    const combinedData: Record<string, Library> = await fetchJsonData(
      'https://cdn.jsdelivr.net/gh/mrpmohiburrahman/category-selector-with-cdn/data/combinedFromChunks.json',
    );
    const uniqueCategoryData: UniqueCategoryData = await fetchJsonData(
      'https://cdn.jsdelivr.net/gh/mrpmohiburrahman/category-selector-with-cdn/data/uniqueCategoryToLib.json',
    );

    // Store data in local storage
    chrome.storage.local.set({
      combinedData,
      uniqueCategoryData,
    });

    console.log('Fetched and stored combined and unique category data');
  } catch (error) {
    console.error('Error fetching data from CDN:', error);
  }
}

// Fetch data initially and then periodically (every 24 hours)
fetchDataAndStore();
setInterval(fetchDataAndStore, 24 * 60 * 60 * 1000);

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('github.com')) {
    chrome.storage.local.get(['combinedData', 'uniqueCategoryData'], result => {
      const combinedData: Record<string, Library> = result.combinedData;
      const uniqueCategoryData: UniqueCategoryData = result.uniqueCategoryData;

      if (!combinedData || !uniqueCategoryData) {
        console.error('No data found in local storage');
        return;
      }

      // Check if GitHub URL matches any key in combinedData
      const matchedKey = Object.keys(combinedData).find(key => tab.url?.includes(key));
      if (matchedKey) {
        console.log(`🚀 ~ chrome.tabs.onUpdated.addListener ~ matchedKey:`, matchedKey);
        const library: Library = combinedData[matchedKey];
        const uniqueCategory = library.uniqueCategory;

        console.log(`Matched GitHub URL: ${tab.url}, uniqueCategory: ${uniqueCategory}`);

        if (uniqueCategory) {
          // Check if uniqueCategory matches any key in uniqueCategoryData
          const matchedItems = uniqueCategoryData[uniqueCategory];
          if (matchedItems) {
            const itemCount = matchedItems.length;

            // Set badge text
            chrome.action.setBadgeText({ text: itemCount.toString(), tabId: tabId });

            // Store matched items in local storage
            chrome.storage.local.set({ matchedItems });

            console.log(`Found ${itemCount} items for uniqueCategory: ${uniqueCategory}`);
          } else {
            console.log(`No items found for uniqueCategory: ${uniqueCategory}`);
            chrome.action.setBadgeText({ text: '', tabId: tabId });
          }
        }
      } else {
        console.log('No match found for current GitHub URL');
        chrome.action.setBadgeText({ text: '', tabId: tabId });
      }
    });
  }
});
