// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

// Define variables for use later in the script
let content   = document.querySelector('body');
let title     = document.querySelector('h1');
let entryPage = document.querySelector('entry-page');
let journalEntries = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
      });
    });
});

// Function to change the styling of the web app when the settings icon is clicked
document.querySelector('img').addEventListener("click", () => {
    closeEntry();
    openSettings();
    history.pushState({title: 'Settings Page'}, '', '#settings');
});

/**  Function to change the styling of the web app when the header is clicked
  *   To handle moving from entry-page to journal-entries page:
  *   - calls closeEntry() to remove journal entry content from the page
  *   - resets the URL to the base URL of the site
  */
title.addEventListener("click", () => {
  closeEntry();
  history.pushState({}, 'Home Page', '/');
});

/** Function to add content to any journal entry when a journal entry is clicked, respective to the journal entry that was clicked.
  *   - timeout allows time for the journal-entries to be loaded onto the page
  */
setTimeout(()=> { 
  history.replaceState({title:'Home Page'}, '');
  journalEntries = document.querySelectorAll('journal-entry')

  document.querySelectorAll('journal-entry').forEach((journalEntry, index) => {
    journalEntry.addEventListener('click', ()=>{
      openEntry(index);
      history.pushState({title: 'Entry Page', index:index}, '', '#entry'+(index+1));
    });
  });
  /**
   * Event listener that triggers when the 'Back' button is pressed. Ensures that the page displays the correct content for the previous page
   */
  window.addEventListener('popstate', (event) => {
    if (event.state.title == "Entry Page") {
      openEntry(event.state.index);
    } else if (event.state.title == "Settings Page") {
      openSettings();
    }
    else {
      closeEntry();
    }
  })
}, 500);

/**
 * Creates a new journal entry element and loads all of the appropriate content into it. Also adjusts the styling of the page 
 */
function openEntry(index) {
  let journalEntry = journalEntries[index];
  content.classList.remove('settings');
  content.classList.add('single-entry');
  title.innerHTML="Entry "+(1+index);
  entryPage.entry = journalEntry.entry;
}

/**
 * Changes the styling of the page to the settings page
 */
function openSettings() {
  closeEntry();
  content.classList.add('settings');
  title.innerHTML="Settings";
}

/**
 * Removes the old entryPage and creates a new entry-page element (using the same variable name for later access)
 */
function closeEntry() {
  entryPage.remove();
  entryPage = document.createElement('entry-page');
  content.appendChild(entryPage);

  content.classList = [];
  title.innerHTML="Journal Entries";
}
