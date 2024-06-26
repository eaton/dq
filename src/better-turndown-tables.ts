import TurndownService from 'turndown';

const indexOf = Array.prototype.indexOf
const every = Array.prototype.every
const rules: Record<string, TurndownService.Rule> = {}
const alignMap: Record<string, string> = { left: ':--', right: '--:', center: ':-:' };

rules.tableCell = {
  filter: ['th', 'td'],
  replacement: function (content, node) {
    if (tableShouldBeSkipped(nodeParentTable(node))) return content;
    return cell(content, node)
  }
}

rules.tableRow = {
  filter: 'tr',
  replacement: function (content, node) {
    const parentTable = nodeParentTable(node);
    if (tableShouldBeSkipped(parentTable)) return content;

    let borderCells = ''

    if (isHeadingRow(node)) {
      const colCount = tableColCount(parentTable);
      for (let i = 0; i < colCount; i++) {
        const childNode = colCount >= node.childNodes.length ? null : node.childNodes[i];
        let border = '---'
        const align = childNode ? (childNode.getAttribute('align') || '').toLowerCase() : '';

        if (align) border = alignMap[align] || border

        if (childNode) {
          borderCells += cell(border, node.childNodes[i])
        } else {
          borderCells += cell(border, null, i);
        }
      }
    }
    return '\n' + content + (borderCells ? '\n' + borderCells : '')
  }
}

rules.table = {
  // Only convert tables with a heading row.
  // Tables with no heading row are kept using `keep` (see below).
  filter: function (node) {
    return node.nodeName === 'TABLE'
  },

  replacement: function (content, node) {
    if (tableShouldBeSkipped(node)) return content;

    // Ensure there are no blank lines
    content = content.replace(/\n+/g, '\n')

    let caption: string | undefined = undefined;

    // Pull out `<caption>` elements and put them above the table; they're discarded later.
    if (isTableCaption(node.firstChild)) {
      caption = node.firstChild.textContent;
      node.firstChild.remove();
    }

    // If table has no heading, add an empty one so as to get a valid Markdown table
    let secondLine: string[] = content.trim().split('\n');
    if (secondLine.length >= 2) secondLine = [secondLine[1]]
    const secondLineIsDivider = secondLine[0].indexOf('| ---') === 0
    
    const columnCount = tableColCount(node);
    let emptyHeader = ''
    if (columnCount && !secondLineIsDivider) {
      emptyHeader = '|' + '     |'.repeat(columnCount) + '\n' + '|' + ' --- |'.repeat(columnCount)
    }

    if (caption) {
      return '\n\n' + caption + '\n\n' + emptyHeader + content + '\n\n'
    } else {
      return '\n\n' + emptyHeader + content + '\n\n'
    }
  }
}

rules.tableSection = {
  filter: ['thead', 'tbody', 'tfoot'],
  replacement: function (content) {
    return content
  }
}

// A tr is a heading row if:
// - the parent is a THEAD
// - or if its the first child of the TABLE or the first TBODY (possibly
//   following a blank THEAD)
// - and every cell is a TH
function isHeadingRow (tr: TurndownService.Node) {
  const parentNode = tr.parentNode
  return (
    parentNode.nodeName === 'THEAD' ||
    (
      parentNode.firstChild === tr &&
      (parentNode.nodeName === 'TABLE' || isFirstTbody(parentNode)) &&
      every.call(tr.childNodes, function (n) { return n.nodeName === 'TH' })
    )
  )
}

function isTableCaption(cap: TurndownService.Node) {
  const parentNode = cap.parentNode
  return (
    parentNode.nodeName === 'TABLE' && cap.nodeName === 'CAPTION'
  )
}


function isFirstTbody (element: TurndownService.Node) {
  const previousSibling = element.previousSibling
  return (
    element.nodeName === 'TBODY' && (
      !previousSibling ||
      (
        previousSibling.nodeName === 'THEAD' &&
        /^\s*$/i.test(previousSibling.textContent)
      )
    )
  )
}

function cell(content: string, node?: TurndownService.Node, index?: number) {
  if (index === null) index = indexOf.call(node.parentNode.childNodes, node)
  let prefix = ' '
  if (index === 0) prefix = '| '
  let filteredContent = content.trim().replace(/\n\r/g, '<br>').replace(/\n/g, "<br>");
  filteredContent = filteredContent.replace(/\|+/g, '\\|')
  while (filteredContent.length < 3) filteredContent += ' ';
  if (node) filteredContent = handleColSpan(filteredContent, node, ' ');
  return prefix + filteredContent + ' |'
}

function nodeContainsTable(node: TurndownService.Node) {
  if (!node.childNodes) return false;

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child.nodeName === 'TABLE') return true;
    if (nodeContainsTable(child)) return true;
  }
  return false;
}

// Various conditions under which a table should be skipped - i.e. each cell
// will be rendered one after the other as if they were paragraphs.
function tableShouldBeSkipped(tableNode: TurndownService.Node) {
  if (!tableNode) return true;
  if (!tableNode.rows) return true;
  if (tableNode.rows.length === 1 && tableNode.rows[0].childNodes.length <= 1) return true; // Table with only one cell
  if (nodeContainsTable(tableNode)) return true;
  return false;
}

function nodeParentTable(node: TurndownService.Node) {
  let parent = node.parentNode;
  while (parent.nodeName !== 'TABLE') {
    parent = parent.parentNode;
    if (!parent) return null;
  }
  return parent;
}

function handleColSpan(content: string, node: TurndownService.Node, emptyChar: string) {
  const colspan = node.getAttribute('colspan') || 1;
  for (let i = 1; i < colspan; i++) {
    content += ' | ' + emptyChar.repeat(3);
  }
  return content
}

function tableColCount(node: TurndownService.Node) {
  let maxColCount = 0;
  for (let i = 0; i < node.rows.length; i++) {
    const row = node.rows[i]
    const colCount = row.childNodes.length
    if (colCount > maxColCount) maxColCount = colCount
  }
  return maxColCount
}

export function tables (turndownService: TurndownService) {
  turndownService.keep(function (node: TurndownService.Node) {
    return node.nodeName === 'TABLE'
  });
  turndownService.remove('caption');

  for (const key in rules) turndownService.addRule(key, rules[key])
}