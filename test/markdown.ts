import test from 'ava';
import jetpack from 'fs-jetpack';

import { buildMarkdownFile, serializeFrontmatter } from '../src/build-markdown.js';
import { getToc } from '../src/get-toc.js';
import { getSection } from '../src/get-section.js';

test('generate markdown section', async t => {
  const file = './test/fixtures/content-strategy.epub';
  const toc = await getToc(file);
  const xhtml = await getSection(file, toc[6].content);

  t.not(xhtml, undefined);

  const { data, content } = buildMarkdownFile(xhtml!, toc[6]);
  const markdown = serializeFrontmatter(data, content);
  
  t.not(markdown, undefined);
  jetpack.write('./output/section.xhtml', xhtml!);
  jetpack.write('./output/section.md', markdown!);
});