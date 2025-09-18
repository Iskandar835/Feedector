
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

  const colorReacts = document.querySelectorAll<HTMLSpanElement>("span[data-test-id='social-actions__reaction-count']");
  colorReacts.forEach((el) => {
    el.style.color = "red";
  });
}

// *** SPAN AVEC LE NOM + LE NOMBRE DE PERSONNE QUI REAGIS ****
// <span class="social-details-social-counts__social-proof-container">
//                       <span aria-hidden="true" data-social-proof-fallback="" class="social-details-social-counts__social-proof-fallback-number">8</span>
//                       <span class="social-details-social-counts__social-proof-text">
//                             Anthony Carreta et 7&nbsp;autres personnes
//                       </span>
//                     </span>

//*** SPAN AVEC UNIQUEMENT LE NOMBRE DE PERSONNE QUI REAGIS ****
// <span aria-hidden="true" class="social-details-social-counts__reactions-count">22</span>

function highlightReactions() {
   // Span avec uniquement le nombre
   const elOnlyNumber = document.querySelectorAll<HTMLSpanElement>(
    "span.social-details-social-counts__reactions-count"
  );

  elOnlyNumber.forEach((el) => {
    if (!el.dataset.konecterMarked) {
      console.log(`Voici le nombre de réaction ${el.textContent}`);
      el.dataset.konecterMarked = "true"; // ✅ Marque comme traité
    }
  });

  // Span avec nom + nombre
  const elNumberAndNames = document.querySelectorAll<HTMLSpanElement>(
    "span.social-details-social-counts__social-proof-fallback-number"
  );

  elNumberAndNames.forEach((el) => {
    if (!el.dataset.konecterMarked) {
      console.log(`Voici le nombre de reaction post avec nom ${el.textContent}`);
      el.dataset.konecterMarked = "true"; // ✅ Marque comme traité
    }
  });
}

function extractNumberFromText(text: string | null | undefined ): number | null {
  if (!text) return null;

  // Cherche uniquement les chiffres dans la chaîne
  const match = text.match(/\d+/g); // va retourner ["478"] pour "478 abonnés"
  if (!match) return null;

  // Concatène tous les nombres trouvés (utile si tu as des milliers "1 234")
  const numberStr = match.join("");
  const number = Number(numberStr);

  return isNaN(number) ? null : number;
}


async function getFollowers(profileUrl: string): Promise<void | number | null> {
  try {
    // Récupère le HTML du profil avec les cookies de session LinkedIn
    const response = await fetch(profileUrl, { credentials: "include" });
    const html = await response.text();

    // Transforme le HTML en DOM exploitable
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Cherche le premier <span> du UL des abonnés
    const span = doc.querySelector<HTMLSpanElement>("span.pvs-entity__caption-wrapper");
    if (!span) return console.log("span non trouvé");
    // Le span ne se trouve pas, verifier la reponse 'html' et voir comment on peut faire 

    // Récupère le texte et transforme "2 265" -> 2265
    const followers = extractNumberFromText(span.textContent);
    return followers;

  } catch (err) {
    return console.log("Erreur récupération followers :", err);
  }
}

function findProfilSubs() {
  const linkTag = document.querySelectorAll<HTMLAnchorElement>("a.update-components-actor__meta-link");
  
  linkTag.forEach((el) => {
    if (!el.dataset.konecterMarked) {
      el.dataset.konecterMarked = "true";;
      getFollowers(el.href).then((followers) => console.log(`Nombre d'abonnés : ${followers}`));
    }
  });
}


function spotPostDate() {
  // fonction qui marche mais reste a optimiser le tout avec une bonne gestion des BedDoubleIcon, posts, avec MutationObserver
  // cette classe est aussi utilisé pour les Post sponsorisé 
  const dateSpans = document.querySelectorAll<HTMLSpanElement>("span.update-components-actor__sub-description"); 
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


const observer = new MutationObserver(() => {
  findProfilSubs();
  spotPostDate();
  highlightReactions();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

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
