import wretch from 'wretch';
import pReflect from 'p-reflect';
import * as cheerio from 'cheerio';
import { WretchError } from 'wretch/resolver';

export type LinkStatus = {
  requested: string,
  redirected: string,
  status: number,
  statusText?: string | undefined
};

export async function expandLinks(xhtml: string) {
  const $ = cheerio.load(xhtml);
  const links = new Map<string, string | undefined>();
  $('a[href]').each((i, link) => {
    const href = $(link).attr('href');
    if (href) links.set(href, undefined);
  });

  const promises: Promise<LinkStatus>[] = [];
  for (const url of links.keys()) {
    if (url.includes('bkaprt.com')) {
      promises.push(expand(url));
    }
  }

  const results = await Promise.all(promises.map(pReflect));
  return results.map(r => r.isFulfilled ? r.value : undefined).filter(v => v !== undefined);
}

async function expand(url: string): Promise<LinkStatus> {
  const parsed = new URL(url);
  parsed.protocol = 'https:';

  return await wretch(url)
    .head()
    .res(r => ({
      requested: url,
      redirected: r.url,
      status: r.status,
      statusText: r.statusText
    }))
    .catch((err: WretchError) => ({
      requested: url,
      redirected: err.response?.url ? err.response.url : err.url,
      status: err.response?.status ? err.response?.status : err.status,
      statusText: err.response?.statusText ? err.response.statusText : err.text,
    }));
}