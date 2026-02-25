import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/* ===== Crisis Line Modal ===== */
function openCrisisModal() {
  let modal = document.querySelector('.crisis-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'crisis-modal';
    modal.setAttribute('role', 'alertdialog');
    modal.innerHTML = `
      <div class="crisis-modal-overlay"></div>
      <div class="crisis-modal-content">
        <button class="crisis-modal-close"
          aria-label="Close this modal">&times;</button>
        <h3>We&rsquo;re here anytime, day or night
          &ndash; 24/7</h3>
        <p>If you are a Veteran in crisis or concerned
          about one, connect with our caring, qualified
          responders for confidential help. Many of them
          are Veterans themselves.</p>
        <ul>
          <li><a href="tel:988">Call
            <strong>988 and select 1</strong></a></li>
          <li><a href="sms:838255">Text
            <strong>838255</strong></a></li>
          <li><a href="https://www.veteranscrisisline.net/get-help-now/chat/">Start a confidential chat</a></li>
          <li>For TTY, call <a href="tel:711">
            <strong>711 then 988</strong></a></li>
        </ul>
        <p>Get more resources at
          <a href="https://www.veteranscrisisline.net/">
          VeteransCrisisLine.net</a>.</p>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.crisis-modal-close')
      .addEventListener('click', () => {
        modal.classList.remove('open');
      });
    modal.querySelector('.crisis-modal-overlay')
      .addEventListener('click', () => {
        modal.classList.remove('open');
      });
  }
  modal.classList.add('open');
}

/* ===== Government Banner ===== */
function buildGovBanner() {
  const banner = document.createElement('div');
  banner.className = 'gov-banner';
  const flagSrc = '/content/images/tiny-usa-flag.png';
  banner.innerHTML = `
    <div class="gov-banner-inner">
      <div class="gov-banner-left">
        <img src="${flagSrc}" alt="U.S. flag"
          class="gov-flag" width="16" height="11">
        <span>An official website of the
          United States government</span>
        <button class="gov-banner-toggle"
          aria-expanded="false">Here&rsquo;s how
          you know</button>
      </div>
      <button class="crisis-line-btn"
        aria-label="Talk to the Veterans Crisis Line now">
        <span class="crisis-line-text">Talk to the
          <strong>Veterans Crisis Line</strong>
          now</span>
        <span class="crisis-line-arrow">&rsaquo;</span>
      </button>
    </div>
    <div class="gov-banner-details" hidden>
      <div class="gov-banner-detail">
        <strong>The .gov means it&rsquo;s
          official.</strong>
        <span>Federal government websites often end
          in .gov or .mil. Before sharing sensitive
          information, make sure you&rsquo;re on a
          federal government site.</span>
      </div>
      <div class="gov-banner-detail">
        <strong>The site is secure.</strong>
        <span>The <strong>https://</strong> ensures
          that you&rsquo;re connecting to the official
          website and that any information you provide
          is encrypted and sent securely.</span>
      </div>
    </div>
  `;
  const toggle = banner.querySelector('.gov-banner-toggle');
  toggle.addEventListener('click', (e) => {
    const details = banner.querySelector(
      '.gov-banner-details',
    );
    const exp = e.currentTarget
      .getAttribute('aria-expanded') === 'true';
    e.currentTarget
      .setAttribute('aria-expanded', exp ? 'false' : 'true');
    details.hidden = exp;
  });
  banner.querySelector('.crisis-line-btn')
    .addEventListener('click', () => openCrisisModal());
  return banner;
}

/* ===== Search ===== */
function buildSearch(navTools) {
  const searchItem = navTools?.querySelector(
    'a[href="#search"]',
  );
  if (!searchItem) return;
  const li = searchItem.closest('li')
    || searchItem.parentElement;
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-search';
  wrapper.innerHTML = `
    <button class="nav-search-toggle"
      aria-expanded="false" aria-label="Search">
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span>Search</span>
    </button>
    <div class="nav-search-form">
      <input type="search" placeholder="Search VA.gov"
        aria-label="Search">
      <button type="submit" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg"
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21"
            x2="16.65" y2="16.65"/>
        </svg>
      </button>
    </div>
  `;
  const toggleBtn = wrapper.querySelector(
    '.nav-search-toggle',
  );
  toggleBtn.addEventListener('click', (e) => {
    const form = wrapper.querySelector('.nav-search-form');
    const exp = e.currentTarget
      .getAttribute('aria-expanded') === 'true';
    e.currentTarget
      .setAttribute('aria-expanded', exp ? 'false' : 'true');
    form.classList.toggle('open', !exp);
    if (!exp) form.querySelector('input').focus();
  });
  li.replaceWith(wrapper);
}

/* ===== Nav Section Toggle ===== */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  const sel = ':scope .default-content-wrapper > ul > li';
  sections.querySelectorAll(sel).forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/* ===== Benefits Megamenu (sidebar + content) ===== */
function decorateBenefitsMegamenu(item, subList) {
  const panel = document.createElement('div');
  panel.className = 'megamenu-panel megamenu-benefits';

  const sidebar = document.createElement('div');
  sidebar.className = 'megamenu-sidebar';

  const content = document.createElement('div');
  content.className = 'megamenu-content';

  const categories = subList.querySelectorAll(':scope > li');
  let firstCategory = true;

  categories.forEach((cat) => {
    const catSubList = cat.querySelector(':scope > ul');
    const catText = (
      cat.childNodes[0]?.textContent?.trim() || ''
    );

    if (!catSubList) {
      const link = cat.querySelector('a');
      if (link) {
        const sidebarLink = document.createElement('a');
        sidebarLink.href = link.href;
        sidebarLink.textContent = link.textContent.trim();
        sidebarLink.className = 'megamenu-sidebar-link';
        sidebar.appendChild(sidebarLink);
      }
      return;
    }

    const sidebarBtn = document.createElement('button');
    sidebarBtn.className = 'megamenu-sidebar-btn';
    sidebarBtn.textContent = catText;
    if (firstCategory) {
      sidebarBtn.classList.add('active');
    }
    sidebar.appendChild(sidebarBtn);

    const catContent = document.createElement('div');
    catContent.className = 'megamenu-category-content';
    if (firstCategory) catContent.classList.add('active');

    const subItems = catSubList.querySelectorAll(
      ':scope > li',
    );
    const columns = document.createElement('div');
    columns.className = 'megamenu-columns';

    let promoCard = null;

    subItems.forEach((subItem) => {
      const strong = subItem.querySelector(':scope > strong');
      const link = subItem.querySelector(':scope > a');
      const img = subItem.querySelector(
        ':scope > picture img, :scope > img',
      );
      const innerList = subItem.querySelector(':scope > ul');

      if (img && link) {
        promoCard = document.createElement('div');
        promoCard.className = 'megamenu-promo';
        const promoImg = document.createElement('img');
        promoImg.src = img.src;
        promoImg.alt = img.alt || '';
        promoCard.appendChild(promoImg);
        const promoLink = document.createElement('a');
        promoLink.href = link.href;
        promoLink.textContent = link.textContent.trim();
        promoCard.appendChild(promoLink);
        const nodes = [...subItem.childNodes].filter(
          (n) => n.nodeType === Node.TEXT_NODE
            && n.textContent.trim(),
        );
        if (nodes.length) {
          const desc = document.createElement('p');
          desc.textContent = nodes
            .map((n) => n.textContent.trim()).join(' ');
          promoCard.appendChild(desc);
        }
      } else if (strong && innerList) {
        const col = document.createElement('div');
        col.className = 'megamenu-column';
        const heading = document.createElement('h3');
        heading.textContent = strong.textContent;
        col.appendChild(heading);
        const linkList = document.createElement('ul');
        const links = innerList.querySelectorAll(
          ':scope > li > a',
        );
        links.forEach((a) => {
          const newLi = document.createElement('li');
          const newLink = document.createElement('a');
          newLink.href = a.href;
          newLink.textContent = a.textContent.trim();
          newLi.appendChild(newLink);
          linkList.appendChild(newLi);
        });
        col.appendChild(linkList);
        columns.appendChild(col);
      } else if (link && !img) {
        const viewAll = document.createElement('a');
        viewAll.href = link.href;
        viewAll.textContent = link.textContent.trim();
        viewAll.className = 'megamenu-view-all';
        catContent.appendChild(viewAll);
      }
    });

    catContent.appendChild(columns);
    if (promoCard) catContent.appendChild(promoCard);
    content.appendChild(catContent);

    sidebarBtn.addEventListener('click', () => {
      sidebar.querySelectorAll('.megamenu-sidebar-btn')
        .forEach((b) => b.classList.remove('active'));
      content.querySelectorAll('.megamenu-category-content')
        .forEach((c) => c.classList.remove('active'));
      sidebarBtn.classList.add('active');
      catContent.classList.add('active');
    });

    firstCategory = false;
  });

  panel.appendChild(sidebar);
  panel.appendChild(content);
  subList.replaceWith(panel);
}

/* ===== About VA Megamenu (columns layout) ===== */
function decorateColumnsMegamenu(item, subList) {
  const panel = document.createElement('div');
  panel.className = 'megamenu-panel megamenu-about';

  const columns = document.createElement('div');
  columns.className = 'megamenu-columns';

  let promoCard = null;
  const items = subList.querySelectorAll(':scope > li');

  items.forEach((li) => {
    const strong = li.querySelector(':scope > strong');
    const innerList = li.querySelector(':scope > ul');
    const img = li.querySelector(
      ':scope > picture img, :scope > img',
    );
    const link = li.querySelector(':scope > a');

    if (img && link) {
      promoCard = document.createElement('div');
      promoCard.className = 'megamenu-promo';
      const promoImg = document.createElement('img');
      promoImg.src = img.src;
      promoImg.alt = img.alt || '';
      promoCard.appendChild(promoImg);
      const promoLink = document.createElement('a');
      promoLink.href = link.href;
      promoLink.textContent = link.textContent.trim();
      promoCard.appendChild(promoLink);
      const nodes = [...li.childNodes].filter(
        (n) => n.nodeType === Node.TEXT_NODE
          && n.textContent.trim(),
      );
      if (nodes.length) {
        const desc = document.createElement('p');
        desc.textContent = nodes
          .map((n) => n.textContent.trim()).join(' ');
        promoCard.appendChild(desc);
      }
    } else if (strong && innerList) {
      const col = document.createElement('div');
      col.className = 'megamenu-column';
      const heading = document.createElement('h3');
      heading.textContent = strong.textContent;
      col.appendChild(heading);
      const linkList = document.createElement('ul');
      innerList.querySelectorAll(':scope > li > a')
        .forEach((a) => {
          const newLi = document.createElement('li');
          const newLink = document.createElement('a');
          newLink.href = a.href;
          newLink.textContent = a.textContent.trim();
          newLi.appendChild(newLink);
          linkList.appendChild(newLi);
        });
      col.appendChild(linkList);
      columns.appendChild(col);
    }
  });

  panel.appendChild(columns);
  if (promoCard) panel.appendChild(promoCard);
  subList.replaceWith(panel);
}

/* ===== Desktop Megamenu Decoration ===== */
function decorateMegamenu(navSections) {
  if (!navSections) return;
  const sel = ':scope .default-content-wrapper > ul > li';
  const topLevelItems = navSections.querySelectorAll(sel);
  topLevelItems.forEach((item) => {
    const subList = item.querySelector(':scope > ul');
    if (!subList) return;
    item.classList.add('nav-drop');
    item.setAttribute('aria-expanded', 'false');

    const deepSel = ':scope > li > ul > li > ul';
    const hasDeep = subList.querySelector(deepSel);
    if (hasDeep) {
      item.classList.add('nav-megamenu');
      item.classList.add('nav-megamenu-benefits');
      decorateBenefitsMegamenu(item, subList);
    } else {
      const strongs = subList.querySelectorAll(
        ':scope > li > strong',
      );
      if (strongs.length >= 2) {
        item.classList.add('nav-megamenu');
        item.classList.add('nav-megamenu-columns');
        decorateColumnsMegamenu(item, subList);
      }
    }

    const label = item.childNodes[0];
    if (label && label.nodeType === Node.TEXT_NODE) {
      const btn = document.createElement('button');
      btn.className = 'nav-drop-toggle';
      btn.textContent = label.textContent.trim();
      btn.setAttribute('aria-expanded', 'false');
      label.replaceWith(btn);
      btn.addEventListener('click', () => {
        const wasExp = item
          .getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        item.setAttribute(
          'aria-expanded',
          wasExp ? 'false' : 'true',
        );
        btn.setAttribute(
          'aria-expanded',
          wasExp ? 'false' : 'true',
        );
      });
    }
  });
}

/* ===== Mobile Sub-Panel Builder (slide-in) ===== */
function buildMobileSubPanel(name, contentUl) {
  const panel = document.createElement('div');
  panel.className = 'mobile-slide-panel-content';
  panel.hidden = true;

  const backBtn = document.createElement('button');
  backBtn.className = 'mobile-back-btn';
  backBtn.innerHTML = '&#8249; Back to menu';
  panel.appendChild(backBtn);

  // Flat list of all links (no sub-headings)
  const items = contentUl.querySelectorAll(':scope > li');
  items.forEach((item) => {
    const strong = item.querySelector(':scope > strong');
    const link = item.querySelector(':scope > a');
    const img = item.querySelector(
      ':scope > picture img, :scope > img',
    );
    const innerUl = item.querySelector(':scope > ul');

    if (img) return;

    if (link && !strong && !innerUl) {
      const el = document.createElement('a');
      el.href = link.href;
      el.className = 'mobile-panel-link';
      el.textContent = link.textContent.trim();
      panel.appendChild(el);
    } else if (strong && innerUl) {
      // Flatten: add all nested links directly
      innerUl.querySelectorAll(':scope > li > a')
        .forEach((a) => {
          const el = document.createElement('a');
          el.href = a.href;
          el.className = 'mobile-panel-link';
          el.textContent = a.textContent.trim();
          panel.appendChild(el);
        });
    }
  });

  return panel;
}

/* ===== Mobile Menu Builder ===== */
function buildMobileMenu(clonedUl) {
  const menu = document.createElement('div');
  menu.className = 'mobile-menu';

  // Search at top of mobile menu
  const search = document.createElement('div');
  search.className = 'mobile-search';
  search.innerHTML = `
    <div class="mobile-search-form">
      <input type="search" placeholder="Search VA.gov"
        aria-label="Search VA.gov">
      <button type="submit"
        aria-label="Search">Search</button>
    </div>
  `;
  menu.appendChild(search);

  // Main nav list
  const mainNav = document.createElement('div');
  mainNav.className = 'mobile-nav-main';

  // Slide panels container (sits beside mainNav)
  const slidePanels = document.createElement('div');
  slidePanels.className = 'mobile-slide-panels';

  const topItems = clonedUl.querySelectorAll(':scope > li');
  let contactInserted = false;

  topItems.forEach((item) => {
    const subUl = item.querySelector(':scope > ul');
    const link = item.querySelector(':scope > a');

    if (subUl) {
      // Accordion item (Benefits, About VA)
      const text = (
        item.childNodes[0]?.textContent?.trim() || ''
      );
      const accordion = document.createElement('div');
      accordion.className = 'mobile-accordion';

      const trigger = document.createElement('button');
      trigger.className = 'mobile-accordion-trigger';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = [
        `<span>${text}</span>`,
        '<span class="mobile-accordion-icon">+</span>',
      ].join('');
      accordion.appendChild(trigger);

      const panel = document.createElement('div');
      panel.className = 'mobile-accordion-panel';
      panel.hidden = true;

      // Process sub-items as slide-in triggers
      const subItems = subUl.querySelectorAll(':scope > li');
      subItems.forEach((sub) => {
        const subSubUl = sub.querySelector(':scope > ul');
        const subLink = sub.querySelector(':scope > a');
        const subStrong = sub.querySelector(
          ':scope > strong',
        );
        const subImg = sub.querySelector(
          ':scope > picture img, :scope > img',
        );

        if (subImg) return; // skip promo

        if (subSubUl && !subStrong) {
          // Benefits sub-category — slide-in panel
          const catName = (
            sub.childNodes[0]?.textContent?.trim() || ''
          );
          const btn = document.createElement('button');
          btn.className = 'mobile-subcategory-btn';
          btn.innerHTML = [
            `<span>${catName}</span>`,
            '<span class="mobile-chevron">&rsaquo;</span>',
          ].join('');
          panel.appendChild(btn);

          const subPanel = buildMobileSubPanel(
            catName,
            subSubUl,
          );
          slidePanels.appendChild(subPanel);

          // Click: slide main out, slide panel in
          btn.addEventListener('click', () => {
            mainNav.classList.add('slide-out');
            slidePanels.classList.add('slide-in');
            slidePanels.querySelectorAll(
              '.mobile-slide-panel-content',
            ).forEach((p) => {
              p.hidden = true;
              p.style.maxHeight = '';
            });
            subPanel.hidden = false;
            requestAnimationFrame(() => {
              const mTop = menu.getBoundingClientRect().top;
              const sH = search.offsetHeight;
              subPanel.style.maxHeight = `${
                window.innerHeight - mTop - sH
              }px`;
              menu.scrollTop = 0;
            });
          });
          // Back button: reverse
          subPanel.querySelector('.mobile-back-btn')
            .addEventListener('click', () => {
              mainNav.classList.remove('slide-out');
              slidePanels.classList.remove('slide-in');
              subPanel.hidden = true;
              subPanel.style.maxHeight = '';
            });
        } else if (subStrong && subSubUl) {
          // About VA sub-category — slide-in panel
          const catName = subStrong.textContent.trim();
          const btn = document.createElement('button');
          btn.className = 'mobile-subcategory-btn';
          btn.innerHTML = [
            `<span>${catName}</span>`,
            '<span class="mobile-chevron">&rsaquo;</span>',
          ].join('');
          panel.appendChild(btn);

          const subPanel = buildMobileSubPanel(
            catName,
            subSubUl,
          );
          slidePanels.appendChild(subPanel);

          btn.addEventListener('click', () => {
            mainNav.classList.add('slide-out');
            slidePanels.classList.add('slide-in');
            slidePanels.querySelectorAll(
              '.mobile-slide-panel-content',
            ).forEach((p) => {
              p.hidden = true;
              p.style.maxHeight = '';
            });
            subPanel.hidden = false;
            requestAnimationFrame(() => {
              const mTop = menu.getBoundingClientRect().top;
              const sH = search.offsetHeight;
              subPanel.style.maxHeight = `${
                window.innerHeight - mTop - sH
              }px`;
              menu.scrollTop = 0;
            });
          });
          subPanel.querySelector('.mobile-back-btn')
            .addEventListener('click', () => {
              mainNav.classList.remove('slide-out');
              slidePanels.classList.remove('slide-in');
              subPanel.hidden = true;
              subPanel.style.maxHeight = '';
            });
        } else if (subLink && !subSubUl) {
          // Direct link (Service members, etc.)
          const el = document.createElement('a');
          el.href = subLink.href;
          el.className = 'mobile-direct-link';
          el.textContent = subLink.textContent.trim();
          panel.appendChild(el);
        }
      });

      accordion.appendChild(panel);
      mainNav.appendChild(accordion);

      // Accordion toggle - single expand mode
      trigger.addEventListener('click', () => {
        const isExp = trigger
          .getAttribute('aria-expanded') === 'true';
        // Close all top-level accordions first
        const trigs = mainNav.querySelectorAll(
          ':scope > .mobile-accordion'
          + ' > .mobile-accordion-trigger',
        );
        trigs.forEach((t) => {
          t.setAttribute('aria-expanded', 'false');
          const icon = t.querySelector(
            '.mobile-accordion-icon',
          );
          if (icon) icon.textContent = '+';
          const p = t.closest('.mobile-accordion')
            .querySelector('.mobile-accordion-panel');
          if (p) p.hidden = true;
        });
        if (!isExp) {
          trigger.setAttribute('aria-expanded', 'true');
          const icon = trigger.querySelector(
            '.mobile-accordion-icon',
          );
          if (icon) icon.textContent = '\u2212';
          panel.hidden = false;
        }
      });
    } else if (link) {
      // Direct link item
      const linkText = link.textContent.trim();
      const el = document.createElement('a');
      el.href = link.href;
      el.className = 'mobile-nav-link';
      el.textContent = linkText;
      mainNav.appendChild(el);

      // Insert Contact us after Find a VA Location
      if (linkText === 'Find a VA Location'
        && !contactInserted) {
        const contactEl = document.createElement('a');
        contactEl.href = (
          'https://www.va.gov/contact-us/'
        );
        contactEl.className = 'mobile-nav-link';
        contactEl.textContent = 'Contact us';
        mainNav.appendChild(contactEl);
        contactInserted = true;
      }
    }
  });

  menu.appendChild(mainNav);
  menu.appendChild(slidePanels);
  return menu;
}

/* ===== Toggle Menu ===== */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector(
    '.nav-hamburger button',
  );
  const bodyOverflow = (expanded || isDesktop.matches)
    ? '' : 'hidden';
  document.body.style.overflowY = bodyOverflow;
  nav.setAttribute(
    'aria-expanded',
    expanded ? 'false' : 'true',
  );

  // Update hamburger text
  if (button) {
    const label = button.querySelector(
      '.nav-hamburger-label',
    );
    const icon = button.querySelector(
      '.nav-hamburger-icon',
    );
    if (expanded) {
      button.setAttribute('aria-label', 'Open navigation');
      if (label) label.textContent = 'Menu';
      if (icon) icon.textContent = '\u2261';
    } else {
      button.setAttribute('aria-label', 'Close navigation');
      if (label) label.textContent = 'Close';
      if (icon) icon.textContent = '\u00D7';
    }
  }

  // Reset mobile state when closing
  const mobileMenu = nav.querySelector('.mobile-menu');
  if (expanded && mobileMenu) {
    // Reset accordion triggers
    mobileMenu.querySelectorAll(
      '.mobile-accordion-trigger',
    ).forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
      const ic = t.querySelector(
        '.mobile-accordion-icon',
      );
      if (ic) ic.textContent = '+';
    });
    mobileMenu.querySelectorAll(
      '.mobile-accordion-panel',
    ).forEach((p) => { p.hidden = true; });
    // Reset slide panels
    const mainNavEl = mobileMenu.querySelector(
      '.mobile-nav-main',
    );
    const panels = mobileMenu.querySelector(
      '.mobile-slide-panels',
    );
    if (mainNavEl) mainNavEl.classList.remove('slide-out');
    if (panels) {
      panels.classList.remove('slide-in');
      panels.querySelectorAll(
        '.mobile-slide-panel-content',
      ).forEach((p) => {
        p.hidden = true;
        p.style.maxHeight = '';
      });
    }
    mobileMenu.style.maxHeight = '';
  }

  // Set dynamic max-height when opening
  if (!expanded && mobileMenu) {
    requestAnimationFrame(() => {
      const { top: menuY } = mobileMenu.getBoundingClientRect();
      mobileMenu.style.maxHeight = `${
        window.innerHeight - menuY
      }px`;
    });
  }

  // Close desktop dropdowns
  const navSections = nav.querySelector('.nav-sections');
  toggleAllNavSections(navSections, false);
  if (navSections) {
    navSections.querySelectorAll('.nav-drop-toggle')
      .forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });
  }
}

/* ===== Main Decorate ===== */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta
    ? new URL(navMeta, window.location).pathname
    : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';

  // Government banner (Row 0)
  const govBanner = buildGovBanner();
  block.appendChild(govBanner);

  // Nav wrapper
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Brand
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }
  }

  // Tools - build search
  const navTools = nav.querySelector('.nav-tools');
  buildSearch(navTools);

  // Sign in button styling
  if (navTools) {
    const signInLink = navTools.querySelector(
      'a[href*="my-va"]',
    );
    if (signInLink) signInLink.classList.add('nav-sign-in');
  }

  // Clone nav sections BEFORE desktop decoration
  // for mobile menu building
  const navSections = nav.querySelector('.nav-sections');
  const clonedUl = navSections?.querySelector(
    '.default-content-wrapper > ul',
  )?.cloneNode(true);

  // Desktop megamenu decoration
  decorateMegamenu(navSections);

  // Build mobile menu from cloned content
  if (clonedUl) {
    const mobileMenu = buildMobileMenu(clonedUl);
    nav.appendChild(mobileMenu);
  }

  // Hamburger - text button (Menu / Close)
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = [
    '<button type="button" aria-controls="nav"',
    '  aria-label="Open navigation">',
    '  <span class="nav-hamburger-label">Menu</span>',
    '  <span class="nav-hamburger-icon">\u2261</span>',
    '</button>',
  ].join('\n');
  hamburger.addEventListener('click', () => {
    toggleMenu(nav);
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, isDesktop.matches);

  // Viewport resize handling
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, isDesktop.matches);
  });

  // Close dropdowns on click outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      toggleAllNavSections(navSections, false);
      if (navSections) {
        navSections.querySelectorAll('.nav-drop-toggle')
          .forEach((btn) => {
            btn.setAttribute('aria-expanded', 'false');
          });
      }
    }
  });

  // Escape key handler
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    const exp = navSections?.querySelector(
      '[aria-expanded="true"]',
    );
    if (exp) {
      exp.setAttribute('aria-expanded', 'false');
      exp.focus();
    } else if (
      !isDesktop.matches
      && nav.getAttribute('aria-expanded') === 'true'
    ) {
      toggleMenu(nav, false);
    }
    const searchForm = nav.querySelector(
      '.nav-search-form',
    );
    if (searchForm?.classList.contains('open')) {
      searchForm.classList.remove('open');
    }
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
