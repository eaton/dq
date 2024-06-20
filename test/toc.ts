import test from 'ava';
import { parseToc } from '../src/parse-toc.js';

test('list ebook contents', async t => {
  const file = './test/fixtures/content-strategy.epub';
  
  const toc = await parseToc(file);
  t.not(toc, undefined);
  t.log(toc);
});