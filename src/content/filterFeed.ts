// Fonction mise de coter a voir si necessaire par la suite
// function extractNumberFromText(text: string | null | undefined ): number | null {
//   if (!text) return null;

//   // Cherche uniquement les chiffres dans la chaîne
//   const match = text.match(/\d+/g); // va retourner ["478"] pour "478 abonnés"
//   if (!match) return null;

//   // Concatène tous les nombres trouvés (utile si tu as des milliers "1 234")
//   const numberStr = match.join("");
//   const number = Number(numberStr);

//   return isNaN(number) ? null : number;
// }

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

function processPostData(post: HTMLElement) {
  // --- Get the profil ---
  const profilLink = post.querySelector<HTMLAnchorElement>(
    "a.update-components-actor__meta-link"
  );
  const vanityName = profilLink
    ? profilLink.pathname.replace("/in/", "").replace("/", "")
    : null;

  // --- Get the date *its the same element for sposored post ---
  const dateSpan = post.querySelector<HTMLSpanElement>(
    "span.update-components-actor__sub-description span[aria-hidden='true']"
  );
  const dateText = dateSpan
    ? dateSpan.textContent?.replace("•", "").trim()
    : null;

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
    getFollowerCount(vanityName).then((followers) => {
      console.log("===========");
      console.log(`👤 Autor : ${vanityName}`);
      console.log(`👥 Followers : ${followers}`);
      console.log(`📅 Date : ${dateText}`);
      console.log(`👍 Reactions : ${reactionsCount}`);
      console.log(`👍 Reactions with name : ${reactionsWithNames}`);
      console.log("===========");
    });
    post.dataset.konecterMarked = "true";
  }
}

function scanAllPost() {
  const posts = document.querySelectorAll<HTMLDivElement>(
    "div[data-view-name='feed-full-update']"
  );
  posts.forEach(processPostData);
}

function initObserver() {
  const observer = new MutationObserver(() => {
    // waitForFeed();
    scanAllPost();
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
