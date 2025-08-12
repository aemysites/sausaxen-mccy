/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards5)'];

  // Get the grid containing the card <a> elements
  const cardsGrid = element.querySelector('.component-content');
  if (!cardsGrid) return; // If no cards grid, do nothing

  // Select only direct <a> children (cards)
  const cardEls = Array.from(cardsGrid.children).filter(child => child.tagName === 'A');
  if (!cardEls.length) return;

  const rows = [headerRow];

  cardEls.forEach(card => {
    // Image: first child div contains the image
    let imgEl = null;
    const imgDiv = card.querySelector('div');
    if (imgDiv) {
      imgEl = imgDiv.querySelector('img');
    }

    // Text: second child div contains the text
    let textEl = null;
    const divs = card.querySelectorAll(':scope > div');
    if (divs.length > 1) {
      textEl = divs[1];
    } else if (divs.length === 1) {
      textEl = divs[0];
    }

    // Always reference existing elements
    rows.push([
      imgEl,
      textEl
    ]);
  });

  // Create and replace with the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
