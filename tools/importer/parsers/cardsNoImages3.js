/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the block name exactly as required
  const headerRow = ['Cards'];

  // Get all cards (each <a> is a card)
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  const rows = cards.map(card => {
    // The card content is the <div> inside each <a>
    const contentDiv = card.querySelector(':scope > div');

    // Initialize image and text content
    let imageContent = null;
    let textContent = [];

    if (contentDiv) {
      // Look for image in the content div
      const img = contentDiv.querySelector('img');
      if (img) {
        imageContent = img;
      }

      // Collect all child nodes for text content (excluding the image)
      Array.from(contentDiv.childNodes).forEach(node => {
        // Ignore empty text nodes or whitespace
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        // Skip the image node since we've already handled it
        if (node === img) return;
        textContent.push(node);
      });
    }

    // Return the card content with two columns: image and text
    return [
      imageContent || '', // First column: image (or empty if no image)
      textContent.length === 1 ? textContent[0] : textContent || '' // Second column: text content
    ];
  });

  // Construct the table cells array
  const cells = [headerRow, ...rows];

  // Create the Cards table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
