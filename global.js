
function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}


export async function fetchJSON(url) {
  try {
      //Fetch the JSON file from the given URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

      console.log(response)
      const data = await response.json();

      console.log(data);
      return data; 

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

window.fetchJSON = fetchJSON;

// const containerElement = document.createElement('div');
// window.containerElement = containerElement;
// const project = {
//   title: 'Lorem ipsum dolor sit.',
//   description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus, ut perspiciatis, ad illum quo possimus porro atque iure nisi molestiae libero nostrum, reprehenderit neque ex iusto. Magni corrupti inventore qui.',
//   image: 'https://vis-society.github.io/labs/2/images/empty.svg',
// };

// window.project = project;

export function renderProjects(project, containerElement, headingLevel = 'h2') {

  containerElement.innerHTML = '';

  if (!(containerElement instanceof HTMLElement) || !project || containerElement === null) {
    console.error("Invalid container element!");
    return;
}

const projectsContainer = document.querySelector('.projects');
window.projectsContainer = projectsContainer;
window.renderProjects = renderProjects;


  const validHeadingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadingTags.includes(headingLevel)) {
        console.error("Invalid heading level! Defaulting to h2.");
        headingLevel = 'h2';
    }

    const article = document.createElement('article');

    // Populate the article element with dynamic content
    article.innerHTML += `
    
    <${headingLevel}>${project.title || 'No title'}<${headingLevel}>
    <img src="${project.image || ''}" alt="">
    <p>${project.description || 'No description.'}</p>
    <p name = "year">Year : ${project.year || 'No description.'}</p>
    `;

    containerElement.appendChild(article);
}

// window.renderProjects = renderProjects;
export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}

window.fetchGitHubData = fetchGitHubData;

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'meta', title: 'Meta' },
    { url: 'https://github.com/Linusdsnoif', title: 'Github'},
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);


for (let p of pages) {
    let url = p.url;
    let title = p.title;
    const ARE_WE_HOME = document.documentElement.classList.contains('home');
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
    }
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
      }
    
    if (a.host !== location.host) {
        a.target = '_blank';
      }
  }


  document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
            <option value="auto">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
      </label>`
  );



  const select = document.querySelector('select');


  select.addEventListener('input', function (event) {
      console.log('color scheme changed to', event.target.value);
      document.documentElement.style.setProperty('color-scheme', event.target.value);
      localStorage.colorScheme = event.target.value
  });
  
  if ("colorScheme" in localStorage) {
    select.value = localStorage.colorScheme
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
}

const form = document.querySelector('contact-form')

form?.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = new FormData(form);

    let url = form.action + '?';

    for (let [name, value] of data) {
        url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
        console.log(name, encodeURIComponent(value));
    }
    
    location.href = url;
  });

