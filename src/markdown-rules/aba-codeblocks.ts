import TurndownService from 'turndown';

const unEscapes = [
  ['\\\\', '\\'],
  ['\\]', ']'],
  ['\\[', '['],
  ['\\(', ')'],
  ['\\)', ')'],
  ['\\>', '>'],
  ['\\<', '<'],
]

const rules: Record<string, TurndownService.Rule> = {};

export function abaCodeBlocks(service: TurndownService) {
  service.addRule('aba-pre-code', rules.abaCode);
}

function isAbaCodeBlock(node: TurndownService.Node) {
  const classAttr = node.getAttribute('class')
  return (node.nodeName === 'PRE') && (classAttr && classAttr.indexOf('Code') !== -1);
}

function isOpeningCodeBlock(node: TurndownService.Node) {
  if (!isAbaCodeBlock(node)) return false;
  if ((node.previousSibling && isAbaCodeBlock(node.previousSibling))) return false;
  if (!(node.nextSibling && isAbaCodeBlock(node.nextSibling))) return false;
  return true;
}

function isFinalCodeBlock(node: TurndownService.Node) {
  if (!isAbaCodeBlock(node)) return false;
  if (!(node.previousSibling && isAbaCodeBlock(node.previousSibling))) return false;
  if ((node.nextSibling && isAbaCodeBlock(node.nextSibling))) return false;
  return true;
}

function isMidCodeBlock(node: TurndownService.Node) {
  if (!isAbaCodeBlock(node)) return false;
  if (!(node.previousSibling && isAbaCodeBlock(node.previousSibling))) return false;
  if (!(node.nextSibling && isAbaCodeBlock(node.nextSibling))) return false;
  return true;
}

rules.abaCode = {
  filter: function (node) {
    return isAbaCodeBlock(node);
  },
  replacement: function (content, node, options) {
    node.isCode = true;

    if (!content) return ''
    content = content.replace(/\r?\n|\r/g, ' ');
    content = unEscape(content);

    if (isOpeningCodeBlock(node)) {
      return '\n' + options.fence + '\n' + content + '\n';
    } else if (isMidCodeBlock(node)) {
      return content + '\n';
    } else if (isFinalCodeBlock(node)) {
      return content + '\n' + options.fence + '\n\n';
    } else {
      return content;
    }
  }
}

function unEscape(input: string) {
  return unEscapes.reduce((accumulator, escape) => {
    return accumulator.replace(escape[0], escape[1])
  }, input)
}
