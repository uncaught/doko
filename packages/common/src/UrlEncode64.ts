export function urlEncode64(str: string): string {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=*$/, '');
}

export function urlDecode64(str: string): string {
  const replaced = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = replaced.padEnd(replaced.length + (replaced.length % 4), '=');
  return Buffer.from(padded, 'base64').toString('binary');
}
