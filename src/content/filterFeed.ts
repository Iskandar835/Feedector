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

// Esayyer d'optimiser de façon a recuperer chaque post et voir les data dessus avec nos fonctions

function waitForFeed() {
  const divFeed = document.querySelector<HTMLElement>(
    'div.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]'
  );

  if (divFeed) {
    divFeed.style.backgroundColor = "red";

    return;
  }
}

// Voir car a certain endroit nombre d'abonnées present et d'autre non
async function getFollowerCount(vanityName: string) {
  const url = `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(vanityName:${vanityName})&queryId=voyagerIdentityDashProfiles.a1a483e719b20537a256b6853cdca711`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      accept: "application/vnd.linkedin.normalized+json+2.1",
      "csrf-token": "ajax:0907696543489087217",
    },
  });

  if (!response.ok) {
    console.error("❌ Erreur HTTP la voici :", response.status);
    return null;
  }

  const data = await response.json();
  return data?.included?.[0]?.followerCount ?? null;
}

function findProfilSubs() {
  const profilLinkEl = document.querySelectorAll<HTMLAnchorElement>(
    "a.update-components-actor__meta-link"
  );

  profilLinkEl.forEach((profilLink) => {
    if (!profilLink.dataset.konecterMarked) {
      // c'est le pathname qui est envoyer dans l'api c'est le meme
      const payload = profilLink.pathname.replace("/in/", "").replace("/", "");
      getFollowerCount(payload).then((followers) =>
        console.log(`Nombre d'abonnés : ${followers}`)
      );
      profilLink.dataset.konecterMarked = "true";
    }
  });
}

function spotPostDate() {
  // cette classe est aussi utilisé pour les Post sponsorisé
  const dateSpans = document.querySelectorAll<HTMLSpanElement>(
    "span.update-components-actor__sub-description"
  );
  dateSpans.forEach((span) => {
    const aria = span.querySelector("span[aria-hidden='true']");
    if (aria) {
      const textNode = Array.from(aria.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      );
      if (textNode && !span.dataset.konecterMarked) {
        const dateText = textNode.textContent?.trim();
        console.log("📅 Date trouvée :", dateText);
        span.dataset.konecterMarked = "true";
      }
    }
  });
}

function highlightReactions() {
  const elOnlyNumber = document.querySelectorAll<HTMLSpanElement>(
    "span.social-details-social-counts__reactions-count"
  );
  elOnlyNumber.forEach((el) => {
    if (!el.dataset.konecterMarked) {
      console.log(`Voici le nombre de réaction : ${el.textContent}`);
      el.dataset.konecterMarked = "true";
    }
  });

  const elNumberAndNames = document.querySelectorAll<HTMLSpanElement>(
    "span.social-details-social-counts__social-proof-fallback-number"
  );
  elNumberAndNames.forEach((el) => {
    if (!el.dataset.konecterMarked) {
      console.log(
        `Voici le nombre de reaction post avec nom : ${el.textContent}`
      );
      el.dataset.konecterMarked = "true";
    }
  });
}

function allDataWeNeed() {
  const observer = new MutationObserver(() => {
    waitForFeed();
    findProfilSubs();
    spotPostDate();
    highlightReactions();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function onlyWorkOnFeedPage() {
  const url = window.location.href;
  const targetUrl = "https://www.linkedin.com/feed/";

  if (url !== targetUrl) {
    return;
  }
  if (url === targetUrl) {
    allDataWeNeed();
  }
}

onlyWorkOnFeedPage();
