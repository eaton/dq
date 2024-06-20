import test from 'ava';
import { listContents } from '../src/list-contents.js';

test('list cs contents', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const fileList = await listContents(file);

  t.not(fileList, undefined);
  t.is(fileList.length, 102);
  t.is(fileList[0], 'mimetype');
  t.is(fileList[101], 'OEBPS/toc.xhtml');
});


test('list ip contents', async t => {
  const file = './test/fixtures/image-performance.epub';
  const fileList = await listContents(file);

  t.not(fileList, undefined);
  t.is(fileList.length, 64);
  t.is(fileList[0], 'mimetype');
});