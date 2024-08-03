// Function to categorize Reddit links and return the new RFB link
function categorizeRedditLink(url) {
  const categories = [
      { category: 'image', regex: /^(https:\/\/|http:\/\/)(i|preview)\.redd\.it\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+\/?(\?.+)?(#.+)?$/i },
      { category: 'subreddit', regex: /^(https?:\/\/)?([-a-zA-Z0-9]+\.)*(reddit\.com(\/tb)?|redd\.it)\/r\/([a-zA-Z0-9_]+)(\/about)?\/?(\?.+)?(#.+)?$/i },
      { category: 'user', regex: /^(https?:\/\/)?([-a-zA-Z0-9]+\.)*(reddit\.com(\/tb)?|redd\.it)\/(u|user)\/([a-zA-Z0-9_]+)\/?(\?.+)?(#.+)?$/i },
      { category: 'post', regex: /^(https?:\/\/)?([-a-zA-Z0-9]+\.)*(reddit\.com(\/tb)?|redd\.it)\/(r\/([a-zA-Z0-9_]+)\/)?(comments\/)?([a-zA-Z0-9_]+)(\/[a-zA-Z0-9_]+)?\/?(\?.+)?(#.+)?$/i },
      { category: 'comment', regex: /^(https?:\/\/)?([-a-zA-Z0-9]+\.)*(reddit\.com(\/tb)?|redd\.it)?\/(r\/([a-zA-Z0-9_]+)\/)?(comments\/)?([a-zA-Z0-9_]+)(\/[a-zA-Z0-9_]+)?(\/(comment\/|_\/)?([a-zA-Z0-9_]+))\/?(\?.+)?(#.+)?$/i },
  ];

  for (const category of categories) {
      if (category.regex.test(url)) {
          return category.category;
      }
  }

  // Default case if no category matches
  return 'unknown';
}
// Function to modify Reddit links
function modifyRedditLinks(links, replace) {
    // Get all anchor tags on the page
    links.forEach(link => {
      const href = link.href;
      // Check if the link is a Reddit link
      cat = categorizeRedditLink(href)
      if (cat !== 'image' && cat !== 'unknown') {
        
if (replace) {
  // Replace the original link with the new link
  const newLink = link.cloneNode(true);
      newLink.href = `redditforblind:${href}`;
      link.parentNode.replaceChild(newLink, link);
} else {
  // Create the new text node
  const newLink = document.createElement('a');
  newLink.href = 'redditforblind:' + href;
newLink.textContent = `Open ${cat} in RFB`;
  // Append the new link next to the original link
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
      }
    });
  }
  
  // Function to add "Open in RedditForBlind" link at the top of Reddit pages
  function addRedditForBlindLink() {
    const currentUrl = window.location.href;
    // Check if the current page URL is a Reddit link
    cat = categorizeRedditLink(currentUrl);
    if (cat !== 'image' && cat !== 'unknown') {
      // Create the new link element
      const newLink = document.createElement('a');
      newLink.href = `redditforblind:${currentUrl}`;
      newLink.textContent = `Open ${cat} in RedditForBlind`;
      newLink.style.display = 'block';
      newLink.style.marginBottom = '10px';
      // Insert the new link at the top of the body
      document.body.insertBefore(newLink, document.body.firstChild);
    }
  }
  
  function afterDOMLoaded() {
    chrome.storage.sync.get(['linkOption'], (result) => {
      const replace = result.linkOption === 'replace';
      modifyRedditLinks(document.querySelectorAll('a'), replace);
  
      // Set up a MutationObserver to watch for new content
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const newLinks = node.querySelectorAll('a');
                modifyRedditLinks(newLinks, replace);
              }
            });
          }
        });
      });
  
      observer.observe(document.body, { childList: true, subtree: true });
    });
    addRedditForBlindLink();
  }
  
  // Run the functions when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoaded);
  } else {
    afterDOMLoaded();
  }