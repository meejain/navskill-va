/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block
 *
 * Source: https://www.va.gov/health/
 * Base Block: carousel
 *
 * Block Structure (from block collection example):
 * - Each row: [image, content (heading + description + optional CTA)]
 *
 * Source HTML Pattern (from captured DOM):
 * <div id="healthslider" class="slider2 slider">
 *   <div class="slide">
 *     <a href="javascript:void(0);"><img src="..." alt="..."></a>
 *     <div class="slider-info">
 *       <p><b>Title</b></p>
 *       <p>Description</p>
 *       <p><a href="...">CTA text</a></p>
 *     </div>
 *   </div>
 *   ...
 * </div>
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract slides - each div.slide (exclude .cloned duplicates)
  // VALIDATED: Found div.slide elements in captured DOM within #healthslider
  const slides = element.querySelectorAll('.slide:not(.cloned)');

  slides.forEach((slide) => {
    // Extract image from slide
    // VALIDATED: Each slide has an <a> wrapping an <img>
    const img = slide.querySelector('img');

    // Extract content from .slider-info
    // VALIDATED: Found div.slider-info in each slide in captured DOM
    const sliderInfo = slide.querySelector('.slider-info');

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

    // Build content cell
    const contentCell = document.createElement('div');
    if (sliderInfo) {
      const paragraphs = sliderInfo.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const clonedP = p.cloneNode(true);
        // Convert <b> title to h2
        const bold = clonedP.querySelector('b');
        if (bold && clonedP.children.length === 1 && clonedP.children[0] === bold) {
          const h2 = document.createElement('h2');
          h2.textContent = bold.textContent;
          contentCell.appendChild(h2);
        } else {
          contentCell.appendChild(clonedP);
        }
      });
    }

    // Add row: [image, content] per block collection example structure
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel', cells });
  element.replaceWith(block);
}
