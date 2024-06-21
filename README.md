# Dancing Queen, the ABA Book Parser

Given an EPUB file from A Book Apart, extract the table of contents, files, and other sundries for use in an 11ty site. Imagine you're an ABA author with fresh rights to your book, a desire to set it free like a little web bird, but no idea how to turn it into an attractive web site. Congratulations, you found the right nerds.

The default mode of interaction for this utility is super straightforward, though ideally you'll never actually use it — it's meant to be used as a library with @wilto's ABA-Book-Site-In-A-Box setup. But if you're nerdishly unwell, you can look deeper:

```javascript
import { processBook } from '@eatonfyi/dq';
await processBook('path/to/my-ebook.epub', { root: 'path/to/output-directory' });
```

That will spit out a directory full of markdown files and accompanying images, as well as a `_data` directory with metadata about the book and a list of all the links that appear in it (We're planning to use the latter for URL validity checking, so long-dead links can be flagged or culled).

An example of the output from an ABA book:

```shell
$ ls my-book-directory

_data
  links.json
  meta.json
_src
  image
    1-1.png
    1-2.ping
    ...
  about.md
  acknowledgements.md
  chap01.md
  chap02.md
  ...
```

There are other, finer grain helper functions underneath `prepareBook` that allow you to pluck individual files out of the EPUB file, change how the HTML gets converted into Markdown, and all that good stuff, but you probably don't care. We make a good effort to convert some funky markup (including captioned figures), but some cleanup will probably be necessary. It mostly works.
