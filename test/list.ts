import test from 'ava';
import { listContents } from '../src/list-contents.js';

test('list ebook contents', async t => {
  const file = './test/fixtures/content-strategy.epub';
  
  const fileList = await listContents(file);
  t.not(fileList, undefined);
  t.is(fileList.length, 102);
  t.is(fileList[0], 'mimetype');
  t.is(fileList[101], 'OEBPS/toc.xhtml');
});