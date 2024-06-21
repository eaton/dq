import test from 'ava';
import { getToc } from '../src/get-toc.js';
import { getChapter } from '../src/get-chapter.js';

test('expand links', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const toc = await getToc(file);
  const chapter = await getChapter(file, toc[7].content);

  t.not(chapter, undefined);

  t.not(chapter.links?.length, undefined);
  t.not(chapter.links?.length, 0);
  t.log(chapter.links)
});