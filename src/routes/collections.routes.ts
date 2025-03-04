import { Hono } from "hono";
import { prisma } from "../lib/prisma.js";
import { layout } from "../components/layout.js";

export const collectionRoute = new Hono();

// Collections Routes
collectionRoute.get("/", async (c) => {
  const collections = await prisma.collection.findMany();

  const collectionsHtml = collections
    .map(
      (col: any) => `
      <li>
        ${col.name}
        <a href="/collections/bookmarks/${col.name}">View Bookmarks</a>
      </li>
    `,
    )
    .join("");

  return c.html(
    layout(
      "Collections",
      `
      <h1>Collections</h1>
      <form action="/collections/new" method="post">
        <label for="name">New Collection Name</label>
        <input type="text" id="name" name="name" required>
        <button type="submit">Create Collection</button>
      </form>
      <h2>Existing Collections</h2>
      <ul>${collections.length ? collectionsHtml : "<p>No collections yet.</p>"}</ul>
    `,
    ),
  );
});

collectionRoute.post("/new", async (c) => {
  const body = await c.req.parseBody();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return c.html(
      layout("New Collection", "<p>Error: Name is required.</p>"),
      400,
    );
  }

  try {
    await prisma.collection.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    return c.redirect("/collections");
  } catch (error) {
    console.error(error);
    return c.html(
      layout("New Collection", "<p>Error creating collection.</p>"),
      500,
    );
  }
});

// View bookmarks in a specific collection
collectionRoute.get("/bookmarks/:name", async (c) => {
  const collectionName = c.req.param("name");

  const bookmarks = await prisma.bookmark.findMany({
    where: { collection: collectionName },
    include: { tags: true },
  });

  const listHtml = bookmarks
    .map(
      (b: any) => `
    <li>
      <a href="${b.url}" target="_blank">${b.title}</a>
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
      `${collectionName} Collection`,
      `
    <h1>Bookmarks in ${collectionName} Collection</h1>
    ${bookmarks.length === 0 ? "<p>No bookmarks in this collection.</p>" : `<ul>${listHtml}</ul>`}
  `,
    ),
  );
});
