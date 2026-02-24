/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.va.gov/health/
 * Base Block: columns
 *
 * Block Structure (from block collection example):
 * - Each row: [column1 content, column2 content]
 *
 * Source HTML Patterns (from captured DOM):
 *
 * Pattern 1 - Anti-Harassment (.basicContainer with stop sign image):
 *   <div class="basicContainer">
 *     <a href="..."><img src="..." alt="Stop sign..."></a>
 *     <h3 class="subsection">VA'S ANTI-HARASSMENT...</h3>
 *     <p>Everyone should feel welcome and safe at VA.<br><a href="...">Be a part...</a></p>
 *   </div>
 *
 * Pattern 2 - Medical Center Stories (.basicContainer with #vamcStories):
 *   <div class="basicContainer">
 *     <h3 class="subsection">Stories from Medical Centers</h3>
 *     <a href="..."><img src="..." alt="Physical therapist..." id="vamcImage"></a>
 *     <div id="vamcStories"><ul>...</ul></div>
 *   </div>
 *
 * Pattern 3 - Connect with VHA / Contact & Resources (.widget with #widget-social):
 *   <div class="widget clearfix">
 *     <div class="widget-title"><h4>Connect with VHA</h4></div>
 *     <div id="widget-social">...social links...</div>
 *     ...contact info and resources...
 *   </div>
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which pattern this is based on content
  const hasStopSign = element.querySelector('img[alt*="Stop sign"]');
  const hasVamcStories = element.querySelector('#vamcStories');
  const hasWidgetSocial = element.querySelector('#widget-social');

  if (hasStopSign) {
    // Pattern 1: Anti-Harassment - image on left, text on right
    // VALIDATED: Found img[alt*="Stop sign"] and h3.subsection in captured DOM
    const img = element.querySelector('img[alt*="Stop sign"]');
    const heading = element.querySelector('h3.subsection');
    const paragraph = element.querySelector('p');

    // Build image cell
    const imageCell = document.createElement('div');
    if (img) {
      const picture = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      newImg.loading = 'lazy';
      picture.appendChild(newImg);
      imageCell.appendChild(picture);
    }

    // Build text cell
    const textCell = document.createElement('div');
    if (heading) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      p.appendChild(strong);
      textCell.appendChild(p);
    }
    if (paragraph) {
      textCell.appendChild(paragraph.cloneNode(true));
    }

    cells.push([imageCell, textCell]);
  } else if (hasVamcStories) {
    // Pattern 2: Stories from Medical Centers - image on left, story list on right
    // VALIDATED: Found #vamcImage and #vamcStories in captured DOM
    const img = element.querySelector('#vamcImage, img[alt*="Physical therapist"]');
    const storiesDiv = element.querySelector('#vamcStories');

    // Build image cell
    const imageCell = document.createElement('div');
    if (img) {
      const picture = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      newImg.loading = 'lazy';
      picture.appendChild(newImg);
      imageCell.appendChild(picture);
    }

    // Build content cell with heading and story list
    const textCell = document.createElement('div');
    const heading = element.querySelector('h3.subsection');
    if (heading) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      p.appendChild(strong);
      textCell.appendChild(p);
    }
    if (storiesDiv) {
      const ul = storiesDiv.querySelector('ul');
      if (ul) {
        textCell.appendChild(ul.cloneNode(true));
      }
    }

    cells.push([imageCell, textCell]);
  } else if (hasWidgetSocial) {
    // Pattern 3: Contact & Resources - two text columns
    // VALIDATED: Found .widget-contact and .widget-resources patterns in captured DOM

    // Build contact cell
    const contactCell = document.createElement('div');
    const contactHeading = document.createElement('p');
    const contactStrong = document.createElement('strong');
    contactStrong.textContent = 'Contact';
    contactHeading.appendChild(contactStrong);
    contactCell.appendChild(contactHeading);

    // Extract contact info from widget content
    const contactTexts = element.querySelectorAll('.widget-contact p, .widget-content p');
    if (contactTexts.length > 0) {
      contactTexts.forEach((p) => contactCell.appendChild(p.cloneNode(true)));
    } else {
      // Fallback: extract text content directly
      const allText = element.textContent;
      if (allText.includes('1-877-222-VETS')) {
        const p1 = document.createElement('p');
        p1.textContent = 'Health Care: 1-877-222-VETS (8387)';
        contactCell.appendChild(p1);
      }
      if (allText.includes('1-800-488-8244')) {
        const p2 = document.createElement('p');
        p2.textContent = 'VA Inspector General: 1-800-488-8244';
        contactCell.appendChild(p2);
      }
      // Look for toll-free link
      const tollFreeLink = element.querySelector('a[href*="contact-us"]');
      if (tollFreeLink) {
        const p3 = document.createElement('p');
        p3.appendChild(tollFreeLink.cloneNode(true));
        contactCell.appendChild(p3);
      }
    }

    // Build resources cell
    const resourcesCell = document.createElement('div');
    const resourcesHeading = document.createElement('p');
    const resourcesStrong = document.createElement('strong');
    resourcesStrong.textContent = 'Resources';
    resourcesHeading.appendChild(resourcesStrong);
    resourcesCell.appendChild(resourcesHeading);

    // Extract resource links from captured DOM
    const resourceLinks = element.querySelectorAll('.widget-resources a, .resources a');
    if (resourceLinks.length > 0) {
      const ul = document.createElement('ul');
      resourceLinks.forEach((link) => {
        const li = document.createElement('li');
        li.appendChild(link.cloneNode(true));
        ul.appendChild(li);
      });
      resourcesCell.appendChild(ul);
    }

    cells.push([contactCell, resourcesCell]);
  } else {
    // Fallback: generic two-column split
    // Split children into two columns
    const children = Array.from(element.children);
    const midpoint = Math.ceil(children.length / 2);
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');

    children.forEach((child, i) => {
      if (i < midpoint) {
        col1.appendChild(child.cloneNode(true));
      } else {
        col2.appendChild(child.cloneNode(true));
      }
    });

    cells.push([col1, col2]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
