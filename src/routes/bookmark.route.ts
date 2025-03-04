import { Hono } from "hono";
import { got } from "got";
import metascraper from "metascraper";
import metascraperTitle from "metascraper-title";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import { prisma } from "../lib/prisma.js";
import { layout } from "../components/layout.js";

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
]);

export const bookmarkRoutes = new Hono();

// GET /bookmarks – Render URL entry form
bookmarkRoutes.get("/", (c) => {
  return c.html(
    layout(
      "Create Bookmark",
      `
      <h1>Create a New Bookmark</h1>
      <form action="/bookmarks/create" method="post">
        <label for="url">Bookmark URL</label>
        <input type="url" id="url" name="url" placeholder="Enter URL" required>
        <button type="submit">Scrape Bookmark</button>
      </form>
    `,
    ),
  );
});

// POST /bookmarks/create – Scrape and create bookmark
bookmarkRoutes.post("/create", async (c) => {
  const body = await c.req.parseBody();
  const urlField = body.url;

  if (typeof urlField !== "string" || urlField.trim() === "") {
    return c.html(
      layout("Create Bookmark", "<p>Error: URL is required.</p>"),
      400,
    );
  }

  try {
    const { body: html } = await got(urlField);
    const metadata = await scraper({ html, url: urlField });

    const newBookmark = await prisma.bookmark.create({
      data: {
        url: urlField,
        title: metadata.title || urlField,
        description: metadata.description || "",
        cover: metadata.image || "",
        collection: "unsorted",
        isDraft: true,
      },
    });

    return c.redirect(`/bookmarks/edit/${newBookmark.id}`);
  } catch (err) {
    console.error(err);
    return c.html(
      layout(
        "Create Bookmark",
        `<p>Error scraping URL: ${(err as Error).message}</p>`,
      ),
      500,
    );
  }
});

// GET /bookmarks/edit/:id – Render edit form
bookmarkRoutes.get("/edit/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!bookmark) {
      return c.html(layout("Edit Bookmark", "<p>Bookmark not found.</p>"), 404);
    }

    const collections = await prisma.collection.findMany();
    const tags = await prisma.tag.findMany();

    const collectionOptions = collections
      .map(
        (col: any) =>
          `<option value="${col.name}" ${bookmark.collection === col.name ? "selected" : ""}>${col.name}</option>`,
      )
      .join("");

    const tagOptions = tags
      .map(
        (tag: any) =>
          `<option value="${tag.name}" ${bookmark.tags.some((t: any) => t.name === tag.name) ? "selected" : ""}>${tag.name}</option>`,
      )
      .join("");

    const formHtml = `
      <h1>Edit Bookmark</h1>
      <form action="/bookmarks/edit/${bookmark.id}" method="post">
        <p><strong>URL:</strong> ${bookmark.url}</p>
        
        <label for="title">Title</label>
        <input type="text" id="title" name="title" value="${bookmark.title}" required>
        
        <label for="description">Description</label>
        <textarea id="description" name="description" rows="4">${bookmark.description || ""}</textarea>
        
        <label for="collection">Collection</label>
        <select id="collection" name="collection" required>
          ${collectionOptions}
        </select>
        <p><a href="/collections/new">Create New Collection</a></p>
        
        <label for="tags">Tags</label>
        <select id="tags" name="tags" multiple>
          ${tagOptions}
        </select>
        <p><a href="/tags/new">Create New Tag</a></p>
        
        ${bookmark.cover ? `<img src="${bookmark.cover}" alt="Cover Image">` : ""}
        <button type="submit">Save Bookmark</button>
      </form>
    `;
    return c.html(layout("Edit Bookmark", formHtml));
  } catch (error) {
    console.error(error);
    return c.html(
      layout("Edit Bookmark", "<p>Error loading bookmark.</p>"),
      500,
    );
  }
});

// POST /bookmarks/edit/:id – Update bookmark
bookmarkRoutes.post("/edit/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = await c.req.parseBody();

  const title = typeof body.title === "string" ? body.title : "";
  const description =
    typeof body.description === "string" ? body.description : "";
  const collection =
    typeof body.collection === "string" ? body.collection : "unsorted";

  // Handle tags
  let tags: string[] = [];
  if (Array.isArray(body.tags)) {
    tags = body.tags.filter((t) => typeof t === "string");
  } else if (typeof body.tags === "string") {
    tags = [body.tags];
  }

  try {
    // Update bookmark and its tags
    await prisma.bookmark.update({
      where: { id },
      data: {
        title,
        description,
        collection,
        isDraft: false,
        tags: {
          // Disconnect existing tags
          disconnect: await prisma.bookmark
            .findUnique({
              where: { id },
              include: { tags: true },
            })
            .then((b: any) => b?.tags.map((tag: any) => ({ name: tag.name }))),

          // Connect new tags, creating them if they don't exist
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
    });

    return c.redirect("/bookmarks/list");
  } catch (error) {
    console.error(error);
    return c.html(
      layout("Edit Bookmark", "<p>Error updating bookmark.</p>"),
      500,
    );
  }
});

// GET /bookmarks/list – List all bookmarks
bookmarkRoutes.get("/list", async (c) => {
  const bookmarks = await prisma.bookmark.findMany({
    include: { tags: true },
  });

  const listHtml = bookmarks
    .map(
      (b: any) => `
    <li>
      <a href="${b.url}" target="_blank">${b.title}</a>
      <small>(${b.collection})</small>
      <div>
        ${b.tags.map((tag: any) => `<span class="tag">${tag.name}</span>`).join(", ")}
      </div>
      <div>
        <a class="contrast" href="/bookmarks/edit/${b.id}">Edit</a>
        <a class="contrast" href="/bookmarks/delete/${b.id}">Delete</a>
      </div>
    </li>
  `,
    )
    .join("");

  return c.html(
    layout(
      "Your Bookmarks",
      `
    <h1>Your Bookmarks</h1>
    ${bookmarks.length === 0 ? "<p>No bookmarks added yet.</p>" : `<ul>${listHtml}</ul>`}
  `,
    ),
  );
});

// GET /bookmarks/delete/:id – Delete a bookmark
bookmarkRoutes.get("/delete/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  try {
    await prisma.bookmark.delete({
      where: { id },
    });
    return c.redirect("/bookmarks/list");
  } catch (error) {
    console.error(error);
    return c.html(
      layout("Delete Bookmark", "<p>Error deleting bookmark.</p>"),
      500,
    );
  }
});

// old 2
// import { Hono, type Context } from "hono";
// import got from "got";
// import metascraper from "metascraper";
// import metascraperTitle from "metascraper-title";
// import metascraperDescription from "metascraper-description";
// import metascraperImage from "metascraper-image";
// import { layout } from "../components/layout.js";
//
// export const bookmarkRoutes = new Hono();
//
// const scraper = metascraper([
//   metascraperTitle(),
//   metascraperDescription(),
//   metascraperImage(),
// ]);
//
// type Bookmark = {
//   id: number;
//   url: string;
//   title: string;
//   description?: string;
//   cover?: string;
//   collection: string;
//   tags: string[];
//   isDraft: boolean;
// };
// let bookmarks: Bookmark[] = [];
// let collectionsList: string[] = ["unsorted"]; // Always include "unsorted"
// let tagsList: string[] = [];
// // GET /bookmarks – Render a form for entering a URL.
// bookmarkRoutes.get("/", (c: Context) => {
//   return c.html(
//     layout(
//       "Create Bookmark",
//       `
//       <h1>Create a New Bookmark</h1>
//       <form action="/bookmarks/create" method="post">
//         <label for="url">Bookmark URL</label>
//         <input type="url" id="url" name="url" placeholder="Enter URL" required>
//         <button type="submit">Scrape Bookmark</button>
//       </form>
//     `,
//     ),
//   );
// });
//
// // POST /bookmarks/create – Scrape metadata from the URL.
// bookmarkRoutes.post("/create", async (c: Context) => {
//   const body = await c.req.parseBody();
//   const urlField = body.url;
//   if (typeof urlField !== "string" || urlField.trim() === "") {
//     return c.html(
//       layout("Create Bookmark", "<p>Error: URL is required.</p>"),
//       400,
//     );
//   }
//   try {
//     const { body: html } = await got(urlField);
//     const metadata = await scraper({ html, url: urlField });
//     const newBookmark: Bookmark = {
//       id: bookmarks.length + 1,
//       url: urlField,
//       title: metadata.title || urlField,
//       description: metadata.description || "",
//       cover: metadata.image || "",
//       collection: "unsorted",
//       tags: [],
//       isDraft: true,
//     };
//     bookmarks.push(newBookmark);
//     // Redirect to edit page so the user can adjust details.
//     return c.redirect(`/bookmarks/edit/${newBookmark.id}`);
//   } catch (err) {
//     console.error(err);
//     return c.html(
//       layout(
//         "Create Bookmark",
//         `<p>Error scraping URL: ${(err as Error).message}</p>`,
//       ),
//       500,
//     );
//   }
// });
//
// // GET /bookmarks/edit/:id – Render the edit form.
// // Uses <select> elements for collections (single select) and tags (multiple select).
// bookmarkRoutes.get("/edit/:id", (c: Context) => {
//   const id = parseInt(c.req.param("id"), 10);
//   const bookmark = bookmarks.find((b) => b.id === id);
//   if (!bookmark) {
//     return c.html(layout("Edit Bookmark", "<p>Bookmark not found.</p>"), 404);
//   }
//
//   const collectionOptions = collectionsList
//     .map(
//       (col) =>
//         `<option value="${col}" ${bookmark.collection === col ? "selected" : ""}>${col}</option>`,
//     )
//     .join("");
//
//   const tagOptions = tagsList
//     .map(
//       (tag) =>
//         `<option value="${tag}" ${bookmark.tags.includes(tag) ? "selected" : ""}>${tag}</option>`,
//     )
//     .join("");
//
//   const formHtml = `
//     <h1>Edit Bookmark</h1>
//     <form action="/bookmarks/edit/${bookmark.id}" method="post">
//       <p><strong>URL:</strong> ${bookmark.url}</p>
//
//       <label for="title">Title</label>
//       <input type="text" id="title" name="title" value="${bookmark.title}" required>
//
//       <label for="description">Description</label>
//       <textarea id="description" name="description" rows="4">${bookmark.description || ""}</textarea>
//
//       <label for="collection">Collection</label>
//       <select id="collection" name="collection" required>
//         ${collectionOptions}
//       </select>
//       <p><a href="/collections/new">Create New Collection</a></p>
//
//       <label for="tags">Tags</label>
//       <select id="tags" name="tags" multiple>
//         ${tagOptions}
//       </select>
//       <p><a href="/tags/new">Create New Tag</a></p>
//
//       ${bookmark.cover ? `<img src="${bookmark.cover}" alt="Cover Image">` : ""}
//       <button type="submit">Save Bookmark</button>
//     </form>
//   `;
//   return c.html(layout("Edit Bookmark", formHtml));
// });
//
// // POST /bookmarks/edit/:id – Update bookmark with edited details.
// bookmarkRoutes.post("/edit/:id", async (c: Context) => {
//   const id = parseInt(c.req.param("id"), 10);
//   const index = bookmarks.findIndex((b) => b.id === id);
//   if (index === -1) {
//     return c.html(layout("Edit Bookmark", "<p>Bookmark not found.</p>"), 404);
//   }
//   const body = await c.req.parseBody();
//   const title = typeof body.title === "string" ? body.title : "";
//   const description =
//     typeof body.description === "string" ? body.description : "";
//   const collection =
//     typeof body.collection === "string" ? body.collection : "unsorted";
//
//   // For tags, expect an array of strings if multiple selected, or a single string.
//   let tags: string[] = [];
//   if (Array.isArray(body.tags)) {
//     tags = body.tags.filter((t) => typeof t === "string");
//   } else if (typeof body.tags === "string") {
//     tags = [body.tags];
//   }
//
//   bookmarks[index] = {
//     ...bookmarks[index],
//     title,
//     description,
//     collection,
//     tags,
//     isDraft: false,
//   };
//
//   return c.redirect("/bookmarks/list");
// });
//
// // GET /bookmarks/list – List all bookmarks.
// bookmarkRoutes.get("/list", (c: Context) => {
//   const listHtml = bookmarks
//     .map(
//       (b) => `
//     <li>
//       <a href="${b.url}" target="_blank">${b.title}</a>
//       <a class="contrast" href="/bookmarks/edit/${b.id}">Edit</a>
//       <a class="contrast" href="/bookmarks/delete/${b.id}">Delete</a>
//     </li>
//   `,
//     )
//     .join("");
//   return c.html(
//     layout(
//       "Your Bookmarks",
//       `
//     <h1>Your Bookmarks</h1>
//     ${bookmarks.length === 0 ? "<p>No bookmarks added yet.</p>" : `<ul>${listHtml}</ul>`}
//   `,
//     ),
//   );
// });
//
// // GET /bookmarks/delete/:id – Delete a bookmark.
// bookmarkRoutes.get("/delete/:id", (c: Context) => {
//   const id = parseInt(c.req.param("id"), 10);
//   bookmarks = bookmarks.filter((b) => b.id !== id);
//   return c.redirect("/bookmarks/list");
// });
//
// // ----- Collections Routes -----
//
// bookmarkRoutes.get("/collections/new", (c: Context) => {
//   return c.html(
//     layout(
//       "New Collection",
//       `
//     <h1>Create New Collection</h1>
//     <form action="/collections/new" method="post">
//       <label for="name">Collection Name</label>
//       <input type="text" id="name" name="name" required>
//       <button type="submit">Create Collection</button>
//     </form>
//   `,
//     ),
//   );
// });
//
// bookmarkRoutes.post("/collections/new", async (c: Context) => {
//   const body = await c.req.parseBody();
//   const name = typeof body.name === "string" ? body.name.trim() : "";
//   if (!name) {
//     return c.html(
//       layout("New Collection", "<p>Error: Name is required.</p>"),
//       400,
//     );
//   }
//   if (!collectionsList.includes(name)) {
//     collectionsList.push(name);
//   }
//   return c.redirect("/bookmarks");
// });
//
// // ----- Tags Routes -----
//
// bookmarkRoutes.get("/tags/new", (c: Context) => {
//   return c.html(
//     layout(
//       "New Tag",
//       `
//     <h1>Create New Tag</h1>
//     <form action="/tags/new" method="post">
//       <label for="name">Tag Name</label>
//       <input type="text" id="name" name="name" required>
//       <button type="submit">Create Tag</button>
//     </form>
//   `,
//     ),
//   );
// });
//
// bookmarkRoutes.post("/tags/new", async (c: Context) => {
//   const body = await c.req.parseBody();
//   const name = typeof body.name === "string" ? body.name.trim() : "";
//   if (!name) {
//     return c.html(layout("New Tag", "<p>Error: Name is required.</p>"), 400);
//   }
//   if (!tagsList.includes(name)) {
//     tagsList.push(name);
//   }
//   return c.redirect("/bookmarks");
// });

//OLD
// bookmarkRoutes.get("/", (c: Context) => {
//   return c.html(
//     layout(
//       "Create Bookmark",
//       `
//       <h1>Create a New Bookmark</h1>
//       <form action="/bookmarks/create" method="post">
//         <label for="url">Bookmark URL</label>
//         <input type="url" id="url" name="url" placeholder="Enter URL" required>
//         <button type="submit">Scrape Bookmark</button>
//       </form>
//     `,
//     ),
//   );
// });
//
// // POST /bookmarks/create – Scrape metadata using metascraper.
// bookmarkRoutes.post("/create", async (c: Context) => {
//   const body = await c.req.parseBody();
//   const urlField = body.url;
//   if (typeof urlField !== "string" || urlField.trim() === "") {
//     return c.html(
//       layout("Create Bookmark", "<p>Error: URL is required.</p>"),
//       400,
//     );
//   }
//   try {
//     const { body: html } = await got(urlField);
//     const metadata = await scraper({ html, url: urlField });
//     const newBookmark: Bookmark = {
//       id: bookmarks.length + 1,
//       url: urlField,
//       title: metadata.title || urlField,
//       description: metadata.description || "",
//       cover: metadata.image || "",
//       collection: "unsorted",
//       tags: [],
//       isDraft: true,
//     };
//     bookmarks.push(newBookmark);
//     // Redirect user to the edit page so they can review and add tags/collection info.
//     return c.redirect(`/bookmarks/edit/${newBookmark.id}`);
//   } catch (err) {
//     console.error(err);
//     return c.html(
//       layout(
//         "Create Bookmark",
//         `<p>Error scraping URL: ${(err as Error).message}</p>`,
//       ),
//       500,
//     );
//   }
// });

// // GET /bookmarks/edit/:id – Render an edit form with scraped data.
// bookmarkRoutes.get("/edit/:id", (c: Context) => {
//   const id = parseInt(c.req.param("id"), 10);
//   const bookmark = bookmarks.find((b) => b.id === id);
//   if (!bookmark) {
//     return c.html(layout("Edit Bookmark", "<p>Bookmark not found.</p>"), 404);
//   }
//
//   // Compute unique collections and tags from all bookmarks.
//   const collectionsSet = new Set<string>();
//   const tagsSet = new Set<string>();
//   bookmarks.forEach((b) => {
//     collectionsSet.add(b.collection);
//     b.tags.forEach((tag) => tagsSet.add(tag));
//   });
//   // Ensure "unsorted" is always an option.
//   collectionsSet.add("unsorted");
//   const collections = Array.from(collectionsSet);
//   const tags = Array.from(tagsSet);
//
//   const formHtml = `
//     <h1>Edit Bookmark</h1>
//     <form action="/bookmarks/edit/${bookmark.id}" method="post">
//       <p><strong>URL:</strong> ${bookmark.url}</p>
//
//       <label for="title">Title</label>
//       <input type="text" id="title" name="title" value="${bookmark.title}" required>
//
//       <label for="description">Description</label>
//       <textarea id="description" name="description" rows="4">${bookmark.description || ""}</textarea>
//
//       <label for="collection">Collection</label>
//       <input type="text" id="collection" name="collection" value="${bookmark.collection}" list="collection-options" required>
//       <datalist id="collection-options">
//         ${collections.map((col) => `<option value="${col}">`).join("")}
//       </datalist>
//
//       <label for="tags">Tags (comma separated)</label>
//       <input type="text" id="tags" name="tags" value="${bookmark.tags.join(", ")}" list="tag-options">
//       <datalist id="tag-options">
//         ${tags.map((tag) => `<option value="${tag}">`).join("")}
//       </datalist>
//
//       ${bookmark.cover ? `<img src="${bookmark.cover}" alt="Cover Image">` : ""}
//       <button type="submit">Save Bookmark</button>
//     </form>
//   `;
//
//   return c.html(layout("Edit Bookmark", formHtml));
// });
//
// // POST /bookmarks/edit/:id – Update the bookmark with user-edited information.
// bookmarkRoutes.post("/edit/:id", async (c: Context) => {
//   const id = parseInt(c.req.param("id"), 10);
//   const index = bookmarks.findIndex((b) => b.id === id);
//   if (index === -1) {
//     return c.html(layout("Edit Bookmark", "<p>Bookmark not found.</p>"), 404);
//   }
//   const body = await c.req.parseBody();
//   const title = typeof body.title === "string" ? body.title : "";
//   const description =
//     typeof body.description === "string" ? body.description : "";
//   const collection =
//     typeof body.collection === "string" ? body.collection : "unsorted";
//   const tags =
//     typeof body.tags === "string"
//       ? body.tags
//           .split(",")
//           .map((t) => t.trim())
//           .filter((t) => t !== "")
//       : [];
//
//   bookmarks[index] = {
//     ...bookmarks[index],
//     title,
//     description,
//     collection,
//     tags,
//     isDraft: false,
//   };
//
//   return c.redirect("/bookmarks/list");
// });
//
// // GET /bookmarks/list – List all bookmarks.
// bookmarkRoutes.get("/list", (c: Context) => {
//   const listHtml = bookmarks
//     .map(
//       (b) => `
//     <li>
//       <a href="${b.url}" target="_blank">${b.title}</a>
//       <a class="contrast" href="/bookmarks/edit/${b.id}">Edit</a>
//       <a class="contrast" href="/bookmarks/delete/${b.id}">Delete</a>
//     </li>
//   `,
//     )
//     .join("");
//   return c.html(
//     layout(
//       "Your Bookmarks",
//       `
//     <h1>Your Bookmarks</h1>
//     ${bookmarks.length === 0 ? "<p>No bookmarks added yet.</p>" : `<ul>${listHtml}</ul>`}
//   `,
//     ),
//   );
// });
//
// // GET /bookmarks/delete/:id – Delete a bookmark.
// bookmarkRoutes.get("/delete/:id", (c: Context) => {
//   const id = parseInt(c.req.param("id"), 10);
//   bookmarks = bookmarks.filter((b) => b.id !== id);
//   return c.redirect("/bookmarks/list");
// });
