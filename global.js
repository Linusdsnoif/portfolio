function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

export async function fetchJSON(url) {
try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data; 
} catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
}
}

window.fetchJSON = fetchJSON;

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  if (!(containerElement instanceof HTMLElement) || !project || containerElement === null) {
      console.error("Invalid container element!");
      return;
  }

  const validHeadingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadingTags.includes(headingLevel)) {
      console.error("Invalid heading level! Defaulting to h2.");
      headingLevel = 'h2';
  }

  const article = document.createElement('article');

  article.innerHTML += `
      <${headingLevel}>${project.title || 'No title'}</${headingLevel}>
      <img src="${project.image || ''}" alt="">
      <p>${project.description || 'No description.'}</p>
      <p name="year">Year: ${project.year || 'N/A'}</p>
  `;

  containerElement.appendChild(article);
}

// export async function fetchGitHubData(username) {
// return fetchJSON(`https://api.github.com/users/${username}`);
// }

// window.fetchGitHubData = fetchGitHubData;

// --- UPDATED NAVIGATION LOGIC ---
// Replaced relative page paths with section anchor IDs


for (let p of pages) {
  let url = p.url;
  let title = p.title;
  
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  // Ensure external links (like your GitHub) open in a new tab
  if (url.startsWith('http')) {
      a.target = '_blank';
  }
}

