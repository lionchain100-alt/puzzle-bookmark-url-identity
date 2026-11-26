// MIT; Leon Reed with AI assistance. Educational example, not production code.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

export function bookmarkKey(value) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError('URL required');
  const url = new URL(value.trim());
  if (url.protocol !== 'https:') throw new TypeError('HTTPS required');
  if (url.username || url.password) throw new TypeError('Credentials not accepted');
  // A fragment is an in-page position in this specific bookmark contract.
  // Paths, query values, and query order deliberately remain significant.
  url.hash = '';
  return url.href;
}

export function uniqueBookmarks(values) {
  if (!Array.isArray(values)) throw new TypeError('Expected an array');
  const seen = new Set();
  return values.filter(value => {
    const key = bookmarkKey(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function selfTest() {
  let checks = 0;
  const eq = (a, b) => { assert.deepEqual(a, b); checks++; };
  const different = (a, b) => { assert.notEqual(bookmarkKey(a), bookmarkKey(b)); checks++; };
  eq(bookmarkKey(' HTTPS://EXAMPLE.COM:443/play#rules '), 'https://example.com/play');
  eq(bookmarkKey('https://example.com'), 'https://example.com/');
  eq(bookmarkKey('https://example.com/play?mode=daily#rules'), 'https://example.com/play?mode=daily');
  for (const pair of [
    ['/play','/Play'], ['/play','/play/'],
    ['/play?mode=daily','/play?mode=practice'],
    ['/play?a=1&b=2','/play?b=2&a=1'],
    ['/play?a=1&a=2','/play?a=2&a=1'],
    ['/play?a=','/play'], ['/play?x=A','/play?x=a']
  ]) different(...pair.map(p => 'https://example.com' + p));
  for (const value of [null, 2, {}, '', ' ', '/play', 'javascript:alert(1)',
    'http://example.com/', 'data:text/plain,test', 'https://u:p@example.com/']) {
    assert.throws(() => bookmarkKey(value)); checks++;
  }
  const input = ['https://EXAMPLE.com:443/play#one','https://example.com/play#two',
    'https://example.com/play?mode=daily','https://example.com/play?mode=practice'];
  const before = [...input];
  eq(uniqueBookmarks(input), [input[0], input[2], input[3]]);
  eq(input, before);
  eq(uniqueBookmarks([]), []);
  assert.throws(() => uniqueBookmarks('bad')); checks++;
  eq(uniqueBookmarks(['https://example.com/?q=a','https://example.com/?q=b']).length, 2);
  return { checks, passed: true };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(selfTest()));
}
