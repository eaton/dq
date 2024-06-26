import test from 'ava';
import { getRawChapter } from '../src/get-chapter.js';

test('load cs chapter 1', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const xhtml = await getRawChapter(file, 'chap01.xhtml');

  t.not(xhtml, undefined);
});

test('load ps chapter 6', async t => {
  const file = './test/fixtures/image-performance.epub';
  const xhtml = await getRawChapter(file, 'image-performance_draft-3-6.xhtml');

  t.not(xhtml, undefined);
});