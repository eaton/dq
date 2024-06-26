import TurndownService from 'turndown';

const indexOf = Array.prototype.indexOf;
const every = Array.prototype.every;

const rules: Record<string, TurndownService.Rule> = {}

rules.tableCell = {
  filter: ['th', 'td'],
  replacement: function (content, node) {
    return cell(content, node)
  }
}

rules.tableRow = {
  filter: 'tr',
  replacement: function (content, node) {
    let borderCells = '';
    const alignMap: Record<string, string> = {
      left: ':--',
      right: '--:',
      center: ':-:'
    };

    if (isHeadingRow(node)) {
      for (let i = 0; i < node.childNodes.length; i++) {
        let border = '---'
        const align: string = (
          node.childNodes[i].getAttribute('align') || ''
        ).toLowerCase();

        if (align) border = alignMap[align] || border

        borderCells += cell(border, node.childNodes[i])
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

  replacement: function (content) {
    // Ensure there are no blank lines
    content = content.replace('\n\n', '\n')
    return '\n\n' + content + '\n\n'
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
function isHeadingRow(tr: TurndownService.Node) {
  
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

function isFirstTbody(element: TurndownService.Node) {
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

function cell(content: string, node: TurndownService.Node) {
  const index = indexOf.call(node.parentNode?.childNodes, node)
  let prefix = ' '
  if (index === 0) prefix = '| '
  return prefix + content + ' |'
}

export function tables(turndownService: TurndownService) {
  turndownService.keep(function (node) {
    return node.nodeName === 'TABLE' && !isHeadingRow(node.rows[0])
  })
  for (const key in rules) turndownService.addRule(key, rules[key])
}