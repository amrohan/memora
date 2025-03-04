export const layout = (
  pageTitle: string,
  content: string,
  pageHeader?: string,
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
  <style>
    body { max-width: 800px; margin: 2rem auto; padding: 0 1rem; padding-bottom: 70px; }
    form { display: grid; gap: 1rem; }
    select, input, textarea { padding: 0.5rem; font-size: 1rem; }
    img { max-width: 200px; margin-top: 1rem; }

    /* Bottom navigation styling using Pico CSS */
    nav[role="navigation"] {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: var(--background-color);
      border-top: 1px solid var(--muted-border-color);
      box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
    }
    nav[role="navigation"] ul {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      justify-items: center;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    nav[role="navigation"] li {
      text-align: center;
    }
    nav[role="navigation"] a {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: var(--primary);
      font-size: 0.9rem;
    }
    nav[role="navigation"] svg {
      width: 20px;
      height: 20px;
    }
 .bookmark-list {
            width: 90%;
            max-width: 600px;
        }
        .bookmark-card {
            display: flex;
            align-items: center;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 15px;
            transition: transform 0.2s;
        }
        .bookmark-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
        }
        .bookmark-content {
            padding: 15px;
            flex: 1;
        }
        .bookmark-content h3 {
            margin: 0;
            font-size: 18px;
        }
        .bookmark-content small {
            color: gray;
        }
        .tags {
            margin-top: 10px;
        }
        .tag {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 3px 7px;
            border-radius: 5px;
            font-size: 12px;
            margin-right: 5px;
        }
        .actions {
            margin-top: 10px;
        }
        .actions a {
            text-decoration: none;
            color: #007bff;
            margin-right: 10px;
        }
  </style>
</head>
<body>
  <h4>${pageHeader}</h4>
  ${content}

  <!-- Bottom navigation -->
  <nav role="navigation">
    <ul>
      <li>
        <a href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span>Home</span>
        </a>
      </li>
      <li>
        <a href="/bookmarks/list">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          <span>Bookmarks</span>
        </a>
      </li>
      <li>
        <a href="/bookmarks">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span>Create</span>
        </a>
      </li>
      <li>
        <a href="/collections">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
          <span>Collections</span>
        </a>
      </li>
      <li>
        <a href="/tags">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
          <span>Tags</span>
        </a>
      </li>
    </ul>
  </nav>
</body>
</html>
`;
