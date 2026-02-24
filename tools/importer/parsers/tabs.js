/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs block
 *
 * Source: https://www.va.gov/health/
 * Base Block: tabs
 *
 * Block Structure (from block collection example):
 * - Each row: [tab label, tab content]
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="tab-accord" id="tab-accord">
 *   <h3 class="tab"><a href="#" class="m current">Health Care</a></h3>
 *   <h3 class="tab"><a href="#" class="m">Camp Lejeune</a></h3>
 *   <h3 class="tab"><a href="#" class="m">Cold or Flu?</a></h3>
 *   <div class="pane">...Health Care content...</div>
 *   <div class="pane">...Camp Lejeune content...</div>
 *   <div class="pane">...Cold or Flu content...</div>
 * </div>
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract tab labels
  // VALIDATED: Found h3.tab elements with <a> children in captured DOM
  const tabHeaders = element.querySelectorAll('h3.tab');

  // Extract tab content panes
  // VALIDATED: Found div.pane elements in captured DOM
  const tabPanes = element.querySelectorAll('.pane');

  tabHeaders.forEach((header, index) => {
    // Get tab label text from the anchor inside h3.tab
    const anchor = header.querySelector('a');
    const labelText = anchor ? anchor.textContent.trim() : header.textContent.trim();

    // Get corresponding pane content
    const pane = tabPanes[index];

    // Build label cell
    const labelCell = document.createTextNode(labelText);

    // Build content cell - clone pane content
    const contentCell = document.createElement('div');
    if (pane) {
      // Clone all child nodes from the pane
      const children = pane.cloneNode(true).childNodes;
      children.forEach((child) => {
        contentCell.appendChild(child.cloneNode(true));
      });
    }

    // Add row: [label, content] per block collection example structure
    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs', cells });
  element.replaceWith(block);
}
