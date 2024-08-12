export function createSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replacing non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, '');     // Remooving leading and hyphens
  }
