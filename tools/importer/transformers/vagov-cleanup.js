/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for VA.gov website cleanup
 * Purpose: Remove site-wide non-content elements (header, footer, navigation, sidebars, tracking)
 * Applies to: www.va.gov (all templates)
 * Tested: /health/
 * Generated: 2026-02-24
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove VA.gov site header and navigation
    // EXTRACTED: Found <header> and nav elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header',
      '#vetnav',
      '#vetnav-menu',
      '.va-nav-breadcrumbs',
      '.va-breadcrumbs',
      '#vetnav-va-crisis-line',
    ]);

    // Remove VA.gov footer
    // EXTRACTED: Found <footer> and footer-related elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '#footerNav',
      '#footer_wrapper',
      '#va-footer',
    ]);

    // Remove VA.gov official government site banner
    // EXTRACTED: Found .usa-banner and related elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.usa-banner',
      '#official-govt-site',
      '.va-crisis-line',
    ]);

    // Remove slider navigation controls (not content)
    // EXTRACTED: Found slider UI elements in #healthslider captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#slider-controls',
      '.slider-thumbnails',
      '.thumbnails-wrap',
      '#sliderNavWrapper',
      'a.prev',
      'a.next',
    ]);

    // Remove cloned slides (duplicate content used for infinite scroll)
    // EXTRACTED: Found div.slide.cloned elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.slide.cloned',
    ]);

    // Remove VA.gov sidebar decorative elements
    // EXTRACTED: Found decorative images and fillers in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#swoosh',
    ]);

    // Remove tab navigation inside IVH (Inside Veterans Health) section
    // EXTRACTED: Found IVH slider controls in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#IVHcontrols',
      '#IVHmore',
      '#ivhfeeds',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    // Standard HTML elements safe to remove
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Remove tracking and analytics elements
    // EXTRACTED: Found SiteImprove analytics image in captured DOM
    const trackingImages = element.querySelectorAll('img[src*="siteimproveanalytics"]');
    trackingImages.forEach((img) => img.remove());

    // Remove empty decorative image containers
    const decorativeImgs = element.querySelectorAll('img[src*="gray_nav_bkgd"], img[src*="bg-content"], img[src*="bg-footer"]');
    decorativeImgs.forEach((img) => img.remove());
  }
}
