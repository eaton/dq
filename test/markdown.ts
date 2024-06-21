import test from 'ava';

import { toMarkdown } from '../src/build-markdown.js';
import { getToc } from '../src/get-toc.js';
import { getChapter } from '../src/get-chapter.js';

test('generate markdown section', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const toc = await getToc(file);
  const xhtml = await getChapter(file, toc[6].content);

  t.not(xhtml, undefined);
  const markdown = toMarkdown(xhtml!);
  
  t.not(markdown, undefined);
});