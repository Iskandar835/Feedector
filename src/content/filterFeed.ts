function getSessionToken() {
  const token = document.cookie
    .split("; ")
    .find((c) => c.startsWith("JSESSIONID"))
    ?.split("=")[1]
    ?.replace(/^"|"$/g, "");

  return token;
}

async function saveFilters(filters: any) {
  await chrome.storage.local.set({ filters });
  console.log("💾 Filtres sauvegardés:", filters);
}

function dataFromFilters() {
  chrome.runtime.onMessage.addListener(async (msg, _sender, sendResponse) => {
    if (msg.action === "APPLY_FILTERS") {
      const filtersData = msg.payload;

      await saveFilters(filtersData);

      sendResponse({ status: "ok" });

      window.location.reload();

      // console.log("reset des filtres", filtersData);
    }
  });
}

dataFromFilters();

async function getFilters() {
  const result = await chrome.storage.local.get("filters");
  return result.filters || {};
}

async function getFollowerCount(vanityName: string) {
  const token = getSessionToken();
  const url = `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(vanityName:${vanityName})&queryId=voyagerIdentityDashProfiles.a1a483e719b20537a256b6853cdca711`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      accept: "application/vnd.linkedin.normalized+json+2.1",
      "csrf-token": `${token}`,
    },
  });

  if (!response.ok) {
    console.error("❌ Erreur HTTP la voici :", response.status);
    return null;
  }

  const data = await response.json();

  if (data?.included?.[0]?.followerCount === null) {
    return data?.included?.[5]?.followerCount ?? null;
  }

  return data?.included?.[0]?.followerCount ?? null;
}

function parsePostDate(dateSpan: HTMLSpanElement | null) {
  if (!dateSpan) return null;

  const rawText = dateSpan.textContent ?? "";
  const match = rawText.match(/(\d+)\s*(sem|j|h|min)/i);

  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  return { value, unit };
}

async function processPostData(post: HTMLElement) {
  // --- Get the profil ---
  const profilLink = post.querySelector<HTMLAnchorElement>(
    "a.update-components-actor__meta-link"
  );
  const vanityName = profilLink
    ? profilLink.pathname.replace("/in/", "").replace("/", "")
    : null;

  // --- Get the date *its the same element for sposored post ---
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
  if (vanityName && !post.dataset.konecterMarked) {
    const followers = await getFollowerCount(vanityName);

    post.dataset.konecterMarked = "true";

    return {
      vanityName,
      followers,
      dateValue,
      reactionsCount,
      reactionsWithNames,
    };
  }

  return null;
}

async function scanAllPost() {
  const filters = await getFilters();

  if (Object.keys(filters).length === 0) return;

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

      const postData = await processPostData(postContent);
      if (!postData) continue;

      const maxReactions = Math.max(
        postData.reactionsCount,
        postData.reactionsWithNames
      );

      // --- filter followers ---
      if (postData.followers < filters.minFollowers) {
        post.style.display = "none";
      }

      // --- filter reactions ---
      if (maxReactions < filters.minReactions) {
        post.style.display = "none";
      }

      // --- filter date ---
      if (postData.dateValue && filters.timeRange) {
        const { value, unit } = postData.dateValue;

        if (filters.timeRange === 24) {
          if ((unit === "j" && value > 1) || unit === "sem") {
            post.style.display = "none";
          }
        }

        if (filters.timeRange === 48) {
          if ((unit === "j" && value > 2) || unit === "sem") {
            post.style.display = "none";
          }
        }

        if (filters.timeRange === 1) {
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

function initObserver() {
  const divFeed = document.querySelector<HTMLElement>(
    'div.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]'
  );

  if (!divFeed) {
    console.error("⚠️ Unable to find feed div");
    return;
  }

  const observer = new MutationObserver(() => {
    scanAllPost();
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
