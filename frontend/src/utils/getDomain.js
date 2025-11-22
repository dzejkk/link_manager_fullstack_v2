export function getDomain(url) {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch {
    return null;
  }
}
