import test from 'ava';

import { getToc } from '../src/get-toc.js';
import { getChapter } from '../src/get-chapter.js';

test('generate markdown section', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const toc = await getToc(file);
  const chapter = await getChapter(file, toc[6].content);

  t.not(chapter.xhtml, undefined);
  const markdown = chapter.markdown;
  
  t.not(markdown, undefined);
});