import { Hono } from "hono";
import { layout } from "../components/layout.js";
import { prisma } from "../lib/prisma.js";

export const tagRoute = new Hono();
// Tags Routes
tagRoute.get("/", async (c) => {
  const tags = await prisma.tag.findMany();

  const tagsHtml = tags
    .map(
      (tag: any) => `
      <li>
        ${tag.name}
        <a href="/tags/bookmarks/${tag.name}">View Bookmarks</a>
      </li>
    `,
    )
    .join("");

  return c.html(
    layout(
      "Tags",
      `
      <form action="/tags/new" method="post">
        <label for="name">New Tag Name</label>
        <input type="text" id="name" name="name" required>
        <button type="submit">Create Tag</button>
      </form>
      <h5>Existing Tags</h5>
      <ul>${tags.length ? tagsHtml : "<p>No tags yet.</p>"}</ul>
    `,
      "Tags",
    ),
  );
});

// Continuation of tags routes
tagRoute.post("/new", async (c) => {
  const body = await c.req.parseBody();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return c.html(layout("New Tag", "<p>Error: Name is required.</p>"), 400);
  }

  try {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    return c.redirect("/tags");
  } catch (error) {
    console.error(error);
    return c.html(layout("New Tag", "<p>Error creating tag.</p>"), 500);
  }
});

// View bookmarks with a specific tag
tagRoute.get("/bookmarks/:name", async (c) => {
  const tagName = c.req.param("name");

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      tags: {
        some: { name: tagName },
      },
    },
    include: { tags: true },
  });

  const listHtml = bookmarks
    .map(
      (b: any) => `
    <li>
      <a href="${b.url}" target="_blank">${b.title}</a>
      <small>(${b.collection})</small>
      <div>
        ${b.tags
          .map((tag: any) => `<span class="tag">${tag.name}</span>`)
          .join(", ")}
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
      `${tagName} Tag`,
      `
    ${bookmarks.length === 0
        ? "<p>No bookmarks with this tag.</p>"
        : `<ul>${listHtml}</ul>`
      },
  `,
      `Bookmarks with ${tagName} Tag`,
    ),
  );
});
