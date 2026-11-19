const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const tabList = document.querySelector(".project-tabs");
const projects = [...document.querySelectorAll(".project")];

const tabs = projects.map((panel) => {
  const tab = document.createElement("button");
  const title = document.createElement("span");
  const thumbnail = document.createElement("span");
  const image = document.createElement("img");
  const cover = panel.querySelector(".project-image img");

  tab.type = "button";
  tab.className = "project-tab";
  tab.id = panel.id + "-tab";
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", panel.id);
  title.className = "tab-label";
  title.textContent = panel.querySelector("h3").textContent;
  thumbnail.className = "tab-image";
  image.src = cover.src;
  image.alt = "";
  image.loading = "lazy";

  thumbnail.append(image);
  tab.append(thumbnail, title);
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.tabIndex = 0;

  return tab;
});

let activeProject = -1;
let projectTransition;

function selectProject(index) {
  if (index === activeProject) return;

  tabs.forEach((tab, position) => {
    const selected = index === position;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    projects[position].hidden = !selected;
  });

  projectTransition?.cancel();
  if (activeProject !== -1 && !reduceMotion.matches) {
    projectTransition = projects[index].animate(
      [{ opacity: 0.45, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }],
      { duration: 265, easing: "ease-out" }
    );
  }
  activeProject = index;
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectProject(index));
  tab.addEventListener("keydown", (event) => {
    let next;
    switch (event.key) {
      case "ArrowLeft":
        next = (index + tabs.length - 1) % tabs.length;
        break;
      case "ArrowRight":
        next = (index + 1) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectProject(next);
    tabs[next].focus();
  });
});

tabList.append(...tabs);
const linkedProject = () => projects.findIndex((project) => "#" + project.id === window.location.hash);
const initialProject = linkedProject();
selectProject(Math.max(0, initialProject));
tabList.hidden = false;

function showLinkedProject(index) {
  selectProject(index);
  document.querySelector(".showcase").scrollIntoView({ behavior: "instant" });
}

if (initialProject !== -1) showLinkedProject(initialProject);
window.addEventListener("hashchange", () => {
  const index = linkedProject();
  if (index !== -1) showLinkedProject(index);
});

const navigation = [...document.querySelectorAll(".site-nav a")];
const sections = navigation.map((link) => document.querySelector(link.hash));
let currentSection = 0;
let navigationFrame = 0;

function updateNavigation() {
  navigationFrame = 0;
  const scrollMargin = parseFloat(getComputedStyle(sections[0]).scrollMarginTop);
  const marker = Math.max(scrollMargin + 16, window.innerHeight * 0.25);
  const pageEnd = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
  const index = pageEnd ? sections.length - 1 : Math.max(0, sections.findLastIndex(
    (section) => section.getBoundingClientRect().top <= marker
  ));

  if (index === currentSection) return;
  navigation[currentSection].removeAttribute("aria-current");
  navigation[index].setAttribute("aria-current", "location");
  currentSection = index;
}

function queueNavigationUpdate() {
  if (!navigationFrame) navigationFrame = window.requestAnimationFrame(updateNavigation);
}

window.addEventListener("scroll", queueNavigationUpdate, { passive: true });
window.addEventListener("resize", queueNavigationUpdate);
window.addEventListener("load", queueNavigationUpdate);
queueNavigationUpdate();
