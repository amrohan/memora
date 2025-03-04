// Render layout with Pico CSS (same as before)
export const layout = (pageTitle: string, content: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
  <style>
    body { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    nav { margin-bottom: 1rem; }
    form { display: grid; gap: 1rem; }
    select, input, textarea { padding: 0.5rem; font-size: 1rem; }
    img { max-width: 200px; margin-top: 1rem; }
  </style>
</head>
<body>
  <nav>
    <a class="contrast" href="/">Home</a>
    <a class="contrast" href="/bookmarks/list">Bookmarks</a>
    <a class="contrast" href="/bookmarks">Create Bookmark</a>
    <a class="contrast" href="/collections">Collections</a>
    <a class="contrast" href="/tags">Tags</a>
  </nav>
  ${content}
</body>
</html>
`;
