import test from 'ava';
import { expandLinks } from '../src/expand-links.js';
import { getToc } from '../src/get-toc.js';
import { getChapter } from '../src/get-chapter.js';

test('expand links', async t => {
  t.timeout(10_000);

  const file = './test/fixtures/content-strategy.epub';
  const toc = await getToc(file);
  const xhtml = await getChapter(file, toc[7].content);

  t.not(xhtml, undefined);

  const links = await expandLinks(xhtml!);
  t.is(links[0]?.status, 404);
  t.is(links[1]?.status, 200);
});