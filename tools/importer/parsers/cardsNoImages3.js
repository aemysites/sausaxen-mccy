/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the block name exactly as required
  const headerRow = ['Cards'];

  // Get all cards (each <a> is a card)
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  const rows = cards.map(card => {
    // The card content is the <div> inside each <a>
    const contentDiv = card.querySelector(':scope > div');
    // Collect all child nodes of the contentDiv (date, heading, description)
    // This keeps the order and semantics
    const cardContent = [];
    if (contentDiv) {
      Array.from(contentDiv.childNodes).forEach(node => {
        // Ignore empty text nodes or whitespace
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        cardContent.push(node);
      });
    }
    // Return the card content in a single cell (one column)
    return [cardContent];
  });

  // Construct the table cells array
  const cells = [headerRow, ...rows];
  
  // Create the Cards table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
