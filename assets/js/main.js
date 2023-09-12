const contentBox = document.getElementById('content');
const header = document.getElementById("site-header");
let lastScrollTop = 0;
let isUserScrolling = true;
let newSection = null;
const tabsContainer = document.querySelector("[role=tablist]");
const sectionContainers = document.querySelectorAll("section");
const showMoreBtn = document.getElementById("show-more-btn");

showMoreBtn.addEventListener('click', () => {
    scrollSectionIntoView(showMoreBtn);
});

if (tabsContainer) {
    const tabButtons = tabsContainer.querySelectorAll("[role=tab]");
    tabsContainer.addEventListener("click", (e) => {
        const clickedTab = e.target.closest("button");
        const currentTab = tabsContainer.querySelector('[aria-selected="true"]');

        if (!clickedTab || clickedTab === currentTab) return;

        switchTab(clickedTab);
        scrollSectionIntoView(clickedTab);
    });

    tabsContainer.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowLeft":
                moveLeft();
                break;
            case "ArrowRight":
                moveRight();
                break;
            case "Home":
                e.preventDefault();
                switchTab(tabButtons[0]);
                break;
            case "End":
                e.preventDefault();
                switchTab(tabButtons[tabButtons.length - 1]);
                break;
        }
    });

    function moveLeft() {
        const currentTab = document.activeElement;

        if (!currentTab.previousElementSibling) {
            tabButtons.item(tabButtons.length - 1).focus();
        } else {
            currentTab.previousElementSibling.focus();
        }
    }

    function moveRight() {
        const currentTab = document.activeElement;
        if (!currentTab.nextElementSibling) {
            tabButtons.item(0).focus();
        } else {
            currentTab.nextElementSibling.focus();
        }
    }

    function switchTab(newTab) {
        const oldTab = tabsContainer.querySelector('[aria-selected="true"]');

        tabButtons.forEach((button) => {
            button.setAttribute("aria-selected", false);
            button.setAttribute("tabindex", "-1");
        });

        newTab.setAttribute("aria-selected", true);
        newTab.setAttribute("tabindex", "0");
        newTab.focus();

        moveIndicator(oldTab, newTab);
    }

    function scrollSectionIntoView(clickedTab) {
        const activePanelId = clickedTab.getAttribute("aria-controls");
        const sectionToScroll = document.getElementById(activePanelId);
        if (sectionToScroll) {
            sectionToScroll.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }

    function moveIndicator(oldTab, newTab) {
        const newTabPosition = oldTab.compareDocumentPosition(newTab);
        const newTabWidth = newTab.offsetWidth / tabsContainer.offsetWidth;
        let transitionWidth;

        if (newTabPosition === 4) {
            transitionWidth =
                newTab.offsetLeft + newTab.offsetWidth - oldTab.offsetLeft;
        } else {
            transitionWidth =
                oldTab.offsetLeft + oldTab.offsetWidth - newTab.offsetLeft;
            tabsContainer.style.setProperty("--_left", newTab.offsetLeft + "px");
        }

        tabsContainer.style.setProperty(
            "--_width",
            transitionWidth / tabsContainer.offsetWidth
        );

        setTimeout(() => {
            tabsContainer.style.setProperty("--_left", newTab.offsetLeft + "px");
            tabsContainer.style.setProperty("--_width", newTabWidth);
        }, 220);
    }
}

window.addEventListener("scroll", () => {
    const viewportY = window.scrollY;
    const opacity = 1 - viewportY / 600;
    const mostVisibleSection = findMostVisibleSection();


    contentBox.style.setProperty("--opacity", Math.max(opacity, 0));

    if (isUserScrolling) {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > 100) {
            if (currentScrollTop > lastScrollTop) {
                header.style.transform = "translateY(-150%)";
            } else {
                if (currentScrollTop < 800) {
                    header.style.transform = "translateY(0%)";
                    header.style.backgroundColor = 'transparent';
                    header.style.top = '40px';
                    header.style.left = '5vw';
                    header.style.right = '5vw';
                } else {
                    header.style.transform = "translateY(0%)";
                    header.style.backgroundColor = '#000000';
                    header.style.top = '0';
                    header.style.left = '0';
                    header.style.right = '0';
                    header.style.paddingInline = '1rem';
                }
            }
        }

        lastScrollTop = currentScrollTop;
    }

    const oldSection = mostVisibleSection;

    if (oldSection !== newSection) {
        const scrolledTabId = mostVisibleSection.getAttribute('id');
        const scrolledTab = tabsContainer.querySelector(`[aria-controls=${scrolledTabId}]`);

        newSection = oldSection;

        switchTab(scrolledTab);
    }
});

function findMostVisibleSection() {
    let maxPercentage = 0;
    let mostVisibleSection = null;

    sectionContainers.forEach((section, index) => {
        const percentage = calculateVisiblePercentage(section);

        if (percentage > maxPercentage) {
            maxPercentage = percentage;
            mostVisibleSection = section;
        }
    });

    return mostVisibleSection;
}

function calculateVisiblePercentage(section) {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Calculate the height of the section that is visible in the viewport
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

    // Calculate the percentage of the section that is visible
    return (visibleHeight / section.offsetHeight) * 100;
}





// GSAP

gsap.registerPlugin(ScrollTrigger);


// Page loading container
window.addEventListener('load', function () {
    gsap.to('.loading-container', { opacity: 0, duration: 1, onComplete: hideLoading });
});

function hideLoading() {
    document.querySelector('.loading-container').style.display = 'none';
}

// Scroll text animations

const textElements = gsap.utils.toArray('.text');

textElements.forEach(text => {
    gsap.to(text, {
        backgroundSize: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: text,
            start: 'center 80%',
            end: 'center 20%',
            scrub: true,
        },
    });
});

// Side menu

const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const sideMenu = document.querySelector('.side-menu');

menuOpen.addEventListener('click', () => {
    // Toggle the side menu open/close using translateX
    gsap.to(sideMenu, { x: '0%', duration: 0.2, ease: 'power2.inOut' });
});
menuClose.addEventListener('click', () => {
    // Toggle the side menu open/close using translateX
    gsap.to(sideMenu, { x: '100%', duration: 0.2, ease: 'power2.inOut' });
});
