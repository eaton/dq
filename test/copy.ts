import test from 'ava';
import jetpack from 'fs-jetpack';
import { parse as parsePath } from 'path';
import { CopyFileOptions, copyFiles } from '../src/copy-files.js';

test('copy files from ebook', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const output = jetpack.dir('./test/fixtures/copy');

  const options: CopyFileOptions = {
    output: output.path(),
    preserveDates: false,
    matching: '**/*.jpg'
  };

  await copyFiles(file, options);
  t.not(output.list()?.length, 0);

  output.remove();
});


test('copy with path', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const output = jetpack.dir('./test/fixtures/copy-with-path');

  const options: CopyFileOptions = {
    output: output.path(),
    preserveDates: false,
    matching: 'OEBPS/toc.ncx'
  };

  await copyFiles(file, options);
  t.assert(output.exists('OEBPS/toc.ncx'));
  
  output.remove();
});

test('copy flattened with date', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const output = jetpack.dir('./test/fixtures/copy-with-date');

  const options: CopyFileOptions = {
    output: output.path(),
    preserveDates: true,
    rewritePaths: input => parsePath(input).base,
    matching: 'OEBPS/toc.ncx'
  };

  await copyFiles(file, options);
  t.assert(output.exists('toc.ncx'));

  const fileYear = output.inspect('toc.ncx', { times: true })?.birthTime?.getFullYear();
  t.is(fileYear, 2014)
  
  output.remove();
});