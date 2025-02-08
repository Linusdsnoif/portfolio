import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let query = '';
let projects = await fetchJSON('../lib/projects.json');
let selectedIndex = -1;
let searchInput = document.querySelector('.searchBar');

const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

if (projects && projects.length > 0) {

    projectsTitle.textContent = `${projects.length} Projects`;
    projectsContainer.innerHTML = '';

    projects.forEach(project => {
        const article = document.createElement('article');
        renderProjects(project, article, 'h2');
        projectsContainer.appendChild(article);
    });
} else {
    projectsContainer.innerHTML = '<p>No projects available.</p>';
}



  function renderPieChart(projectsGiven) {
    let rolledData = d3.rollups(
        projectsGiven,
        v => v.length,
        d => d.year
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    // Clear chart and legend
    d3.select('svg').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();

    // Create new chart
    let colors = ['purple', 'grey', 'darkgreen'];
    let arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(50);
        let sliceGenerator = d3.pie()
        .value(d => d.value);

    let arcData = sliceGenerator(data);
    let arcs = arcData.map(d => arcGenerator(d));

    // Draw chart
    let svg = d3.select('svg');
    arcs.forEach((arc, i) => {
        svg.append('path')
            .attr('d', arc)
            .attr('fill', colors[i])
            .attr('cursor', 'pointer')
            .attr('class', i === selectedIndex ? 'selected' : '')
            .on('click', () => {
                const year = data[i].label;
                
                if (selectedIndex === i) {
                    // Reset selection
                    selectedIndex = -1;
                    const projectsTitle = document.querySelector('h1');
                    projectsTitle.textContent = `${projects.length} Projects`;

                    // Show all projects
                    // projectsContainer.innerHTML = '';
                    projects.forEach(project => {
                        const article = document.createElement('article');
                        renderProjects(project, article, 'h2');
                        projectsContainer.appendChild(article);
                    });
                } else {
                    // New selection
                    selectedIndex = i;
                    const filteredProjects = projects.filter(p => p.year === year);
                    const projectsTitle = document.querySelector('h1');
                    projectsTitle.textContent = `${filteredProjects.length} Projects`;
                    
                    // Update projects display
                    projectsContainer.innerHTML = '';
                    filteredProjects.forEach(project => {
                        const article = document.createElement('article');
                        renderProjects(project, article, 'h2');
                        projectsContainer.appendChild(article);
                    });
                }

                // Update wedge classes
                svg.selectAll('path')
                    .attr('class', (_, idx) => 
                        idx === selectedIndex ? 'selected' : ''
                    );

                // Update legend classes
                d3.select('.legend')
                    .selectAll('li')
                    .attr('class', (_, idx) => 
                        idx === selectedIndex ? 'legend-item selected' : 'legend-item'
                    );
            });
    });

    let legend = d3.select('.legend');
    data.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors[idx]}`)
            .attr('class', `legend-item ${idx === selectedIndex ? 'selected' : ''}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

}

  function filterProj(filteredProjects) {
    if (filteredProjects && filteredProjects.length > 0) {
        const projectsTitle = document.querySelector('h1');
        projectsTitle.textContent = `${filteredProjects.length} Projects`;
        
        projectsContainer.innerHTML = '';
        filteredProjects.forEach(project => {
            const article = document.createElement('article');
            renderProjects(project, article, 'h2');
            projectsContainer.appendChild(article);
        });

        renderPieChart(filteredProjects);
    } else {
        projectsContainer.innerHTML = '<p>No projects available.</p>';
        d3.select('svg').selectAll('path').remove();
        d3.select('.legend').selectAll('li').remove();
    }
}


filterProj(projects);


searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    let filteredProjects = projects.filter(project => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    filterProj(filteredProjects);
});