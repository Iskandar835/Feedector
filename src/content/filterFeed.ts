async function saveFilters(filters: any) {
  await chrome.storage.local.set({ filters });
}

async function getFilters() {
  const result = await chrome.storage.local.get("filters");
  return result.filters || {};
}

function resetFilters() {
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === "RESET_FILTERS") {
      chrome.storage.local.remove("filters");
      cachedFilters = null;

      sendResponse({ status: "ok" });
      window.location.reload();

      return true;
    }
  });
}

resetFilters();

function dataFromFilters() {
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === "APPLY_FILTERS") {
      const filtersData = msg.payload;

      saveFilters(filtersData).then(() => {
        cachedFilters = null;
        sendResponse({ status: "ok" });
        window.location.reload();
      });

      return true;
    }
  });
}

dataFromFilters();

function parsePostDate(dateSpan: HTMLSpanElement | null) {
  if (!dateSpan) return null;

  const rawText = dateSpan.textContent ?? "";
  const match = rawText.match(/(\d+)\s*(sem|j|h|min)/i);

  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  return { value, unit };
}

function processPostData(post: HTMLElement) {
  // --- Get the date ---
  const dateSpan = post.querySelector<HTMLSpanElement>(
    "span.update-components-actor__sub-description"
  );
  const dateValue = parsePostDate(dateSpan);

  // --- Get the reactions ---
  const reactionsCountElement = post.querySelector<HTMLSpanElement>(
    "span.social-details-social-counts__reactions-count"
  );
  const reactionsCount = reactionsCountElement?.textContent
    ? Number(reactionsCountElement.textContent)
    : 0;

  // --- Get the reactions (with name) ---
  const reactionsWithNamesElement = post.querySelector<HTMLSpanElement>(
    "span.social-details-social-counts__social-proof-fallback-number"
  );
  const reactionsWithNames = reactionsWithNamesElement?.textContent
    ? Number(reactionsWithNamesElement.textContent)
    : 0;

  // --- Fetch followers ---
  if (!post.dataset.konecterMarked) {
    post.dataset.konecterMarked = "true";

    return {
      dateValue,
      reactionsCount,
      reactionsWithNames,
    };
  }

  return null;
}

let cachedFilters: any = null;

async function scanAllPost() {
  if (!cachedFilters) {
    cachedFilters = await getFilters();
  }

  if (Object.keys(cachedFilters).length === 0) return;

  const posts = document.querySelectorAll<HTMLDivElement>(
    "div[data-finite-scroll-hotkey-item]"
  );

  const unprocessedPosts = Array.from(posts).filter(
    (post) => !post.dataset.konecterMarked
  );

  if (unprocessedPosts.length === 0) return;

  for (const post of unprocessedPosts) {
    try {
      const postContent = post.querySelector<HTMLDivElement>(
        "div.feed-shared-update-v2"
      );
      if (!postContent) continue;

      const postData = processPostData(postContent);
      if (!postData) continue;

      const maxReactions = Math.max(
        postData.reactionsCount,
        postData.reactionsWithNames
      );

      // --- filter reactions ---
      if (maxReactions < cachedFilters.minReactions) {
        post.style.display = "none";
      }

      // --- filter date ---
      if (postData.dateValue && cachedFilters.timeRange) {
        const { value, unit } = postData.dateValue;

        if (cachedFilters.timeRange === 24) {
          if ((unit === "j" && value > 1) || unit === "sem") {
            post.style.display = "none";
          }
        }

        if (cachedFilters.timeRange === 48) {
          if ((unit === "j" && value > 2) || unit === "sem") {
            post.style.display = "none";
          }
        }

        if (cachedFilters.timeRange === 1) {
          if (unit === "sem" && value > 1) {
            post.style.display = "none";
          }
        }
      }
    } catch (err) {
      console.error("Error processing a post :", err);
    }
  }
}

let debounceTimer: number | null = null;

function initObserver() {
  const divFeed = document.querySelector<HTMLElement>(
    'div.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]'
  );

  if (!divFeed) {
    console.error("⚠️ Unable to find feed div");
    return;
  }

  const observer = new MutationObserver(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(() => {
      scanAllPost();
    }, 100);
  });

  observer.observe(divFeed, {
    childList: true,
    subtree: true,
  });
}

async function onlyWorkOnFeedPage() {
  const url = window.location.href;
  const targetUrl = "https://www.linkedin.com/feed/";

  if (url !== targetUrl) {
    return;
  }
  if (url === targetUrl) {
    initObserver();

    const filters = await getFilters();
    if (Object.keys(filters).length > 0) {
      await scanAllPost();
    }
  }
}

onlyWorkOnFeedPage();
