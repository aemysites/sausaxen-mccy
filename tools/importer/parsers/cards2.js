/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as shown in the example: exact name and formatting
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];

  // Each card is a direct <a> child of the grid
  const cardEls = element.querySelectorAll(':scope > a');
  cardEls.forEach(card => {
    // 1st cell: image (mandatory)
    let img = null;
    const firstDiv = card.querySelector(':scope > div');
    if (firstDiv) {
      img = firstDiv.querySelector('img');
    }

    // 2nd cell: text (title, description)
    const secondDiv = card.querySelector(':scope > div + div');
    const textCellContent = [];
    if (secondDiv) {
      // Title: <h3>
      const h3 = secondDiv.querySelector('h3');
      if (h3) textCellContent.push(h3);
      // Description: <p>
      const p = secondDiv.querySelector('p');
      if (p) textCellContent.push(p);
    }

    cells.push([
      img || ' ',
      textCellContent.length === 1 ? textCellContent[0] : ' '
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
