import test from 'ava';
import jetpack from 'fs-jetpack';
import { getSection } from '../src/get-section.js';

test('load cs chapter 1', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const xhtml = await getSection(file, 'chap01.xhtml');

  t.not(xhtml, undefined);
  jetpack.write('./output/chap01.xhtml', xhtml ?? '');

});

test('load ps chapter 6', async t => {
  const file = './test/fixtures/image-performance.epub';
  const xhtml = await getSection(file, 'image-performance_draft-3-6.xhtml');

  t.not(xhtml, undefined);
  jetpack.write('./output/image-performance_draft-3-6.xhtml', xhtml ?? '');
});