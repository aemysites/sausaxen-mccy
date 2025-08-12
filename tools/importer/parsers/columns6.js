/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we select direct column containers
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Compose each column cell so that all text and structure is preserved.
  // Use all child nodes (including text nodes) for maximum coverage.
  const columnsRow = columns.map(col => {
    // Remove empty columns (with no visible content)
    // (if col has only whitespace text, treat as empty)
    const nodes = Array.from(col.childNodes).filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
      return false;
    });
    if (nodes.length === 0) {
      // Avoid completely empty cells (but keep cell to preserve layout)
      return '';
    }
    // If only one node, return it directly, else return array of nodes for createTable
    return nodes.length === 1 ? nodes[0] : nodes;
  });

  const headerRow = ['Columns']; // Must match example exactly
  const tableRows = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
