// THE DIV WE NEED TO FILTER
const selector =
  'div.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]';


function waitForFeed(selector: string) {
  const applyStyle = (el: HTMLElement) => {
    el.style.backgroundColor = "red";
  };

  const found = document.querySelector<HTMLElement>(selector);
  if (found) {
    applyStyle(found);
    return;
  }

  const observer = new MutationObserver((_, obs) => {
    const target = document.querySelector<HTMLElement>(selector);
    if (target) {
      applyStyle(target);
      obs.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function onlyWorkOnFeedPage() {
  const url = window.location.href;
  const targetUrl = "https://www.linkedin.com/feed/";

  if (url !== targetUrl) {
    return;
  }
  if (url === targetUrl) {
    waitForFeed(selector);
  }
}

onlyWorkOnFeedPage();
