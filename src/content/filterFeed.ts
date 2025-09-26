// **** function qui recupere le feed ****
// function waitForFeed() {
//   const divFeed = document.querySelector<HTMLElement>(
//     'div.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]'
//   );

//   if (divFeed) {
//     divFeed.style.backgroundColor = "red";

//     return;
//   }
// }

function getSessionToken() {
  const token = document.cookie
    .split("; ")
    .find((c) => c.startsWith("JSESSIONID"))
    ?.split("=")[1]
    ?.replace(/^"|"$/g, "");

  return token;
}

let filterDataStore: any = {};

function dataFromFilters() {
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === "APPLY_FILTERS" && sendResponse) {
      const filtersData = msg.payload;
      filterDataStore = filtersData;

      console.log(
        "voici le tableau depuis la reponse de dataFromFilter",
        filterDataStore
      );
      sendResponse({ status: "ok" });
      // voir comment recuprer les données reçus et les comparer avec les donnees du feed
    }
  });
}

dataFromFilters();

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
  const reactionsCount = Number(
    post.querySelector<HTMLSpanElement>(
      "span.social-details-social-counts__reactions-count"
    )?.textContent
  );

  // --- Get the reactions (with name) ---
  const reactionsWithNames = Number(
    post.querySelector<HTMLSpanElement>(
      "span.social-details-social-counts__social-proof-fallback-number"
    )?.textContent
  );

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
  const posts = document.querySelectorAll<HTMLDivElement>(
    "div[data-view-name='feed-full-update']"
  );

  const unprocessedPosts = Array.from(posts).filter(
    (post) => !post.dataset.konecterMarked
  );

  if (unprocessedPosts.length === 0) return;

  const results = await Promise.all(unprocessedPosts.map(processPostData));

  results.forEach((result) => {
    if (result) {
      // entrer logique des filtres surement ici
    }
  });
}

function initObserver() {
  const observer = new MutationObserver(() => {
    clearTimeout((window as any)._scanTimeout);
    (window as any)._scanTimeout = setTimeout(scanAllPost, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  scanAllPost();
}

function onlyWorkOnFeedPage() {
  const url = window.location.href;
  const targetUrl = "https://www.linkedin.com/feed/";

  if (url !== targetUrl) {
    return;
  }
  if (url === targetUrl) {
    initObserver();
  }
}

onlyWorkOnFeedPage();
