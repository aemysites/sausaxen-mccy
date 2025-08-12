/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header
  const headerRow = ['Hero'];

  // 2. Extract Background Image from style attribute
  let bgImgElem = null;
  const style = element.getAttribute('style') || '';
  const bgUrlMatch = style.match(/background-image\s*:\s*url\(['"]?(.*?)['"]?\)/i);
  if (bgUrlMatch && bgUrlMatch[1]) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgUrlMatch[1];
    bgImgElem.alt = '';
  }

  // 3. Extract Text Content (Heading, Subheading)
  // Structure: section > div > div.component-content > div > div > div > h1/p
  let textCellContent = [];
  // Find the deepest div that contains the h1 and p
  const deepDiv = element.querySelector('.component-content div div');
  if (deepDiv) {
    // Append h1 if present
    const h1 = deepDiv.querySelector('h1');
    if (h1) textCellContent.push(h1);
    // Append subheading/paragraph if present
    const p = deepDiv.querySelector('p');
    if (p) textCellContent.push(p);
    // If there are more paragraphs, add those as well
    deepDiv.querySelectorAll(':scope > p:not(:first-of-type)').forEach(paragraph => {
      textCellContent.push(paragraph);
    });
  }
  // Fallback: if not found, push all immediate children that are h1 or p
  if (textCellContent.length === 0) {
    const fallback = element.querySelectorAll('h1, p');
    fallback.forEach(node => textCellContent.push(node));
  }

  // 4. Build final table structure
  const cells = [
    headerRow,
    [bgImgElem ? bgImgElem : ''],
    [textCellContent.length === 1 ? textCellContent[0] : textCellContent]
  ];

  // 5. Create block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
