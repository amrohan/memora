import { Hono } from "hono";
import { got } from "got";
import metascraper from "metascraper";
import metascraperTitle from "metascraper-title";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import { prisma } from "../lib/prisma.js";
import { layout } from "../components/layout.js";
import { cardComponent } from "../components/cardComponent.js";

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
      <form action="/bookmarks/create" method="post">
        <label for="url">Bookmark URL</label>
        <input type="url" id="url" name="url" placeholder="Enter URL" required>
        <button type="submit">Scrape Bookmark</button>
      </form>
    `,
      "Create a New Bookmark"
    )
  );
});

// POST /bookmarks/create – Scrape and create bookmark
bookmarkRoutes.post("/create", async (c) => {
  const body = await c.req.parseBody();
  const urlField = body.url;

  if (typeof urlField !== "string" || urlField.trim() === "") {
    return c.html(
      layout("Create Bookmark", "<p>Error: URL is required.</p>"),
      400
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
        `<p>Error scraping URL: ${(err as Error).message}</p>`
      ),
      500
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
          `<option value="${col.name}" ${
            bookmark.collection === col.name ? "selected" : ""
          }>${col.name}</option>`
      )
      .join("");

    const tagOptions = tags
      .map(
        (tag: any) =>
          `<option value="${tag.name}" ${
            bookmark.tags.some((t: any) => t.name === tag.name)
              ? "selected"
              : ""
          }>${tag.name}</option>`
      )
      .join("");

    const formHtml = `
      <form action="/bookmarks/edit/${bookmark.id}" method="post">
        <p><strong>URL:</strong> ${bookmark.url}</p>
        
        <label for="title">Title</label>
        <input type="text" id="title" name="title" value="${
          bookmark.title
        }" required>
        
        <label for="description">Description</label>
        <textarea id="description" name="description" rows="4">${
          bookmark.description || ""
        }</textarea>
        
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
        
        ${
          bookmark.cover
            ? `<img src="${bookmark.cover}" alt="Cover Image">`
            : ""
        }
        <button type="submit">Save Bookmark</button>
      </form>
    `;
    return c.html(layout("Edit Bookmark", formHtml, "Edit Bookmark"));
  } catch (error) {
    console.error(error);
    return c.html(
      layout("Edit Bookmark", "<p>Error loading bookmark.</p>"),
      500
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
      500
    );
  }
});

// GET /bookmarks/list – List all bookmarks
bookmarkRoutes.get("/list", async (c) => {
  const bookmarks = await prisma.bookmark.findMany({
    include: { tags: true },
  });

  const listHtml = bookmarks.map((b: any) => cardComponent(b)).join("");
  return c.html(
    layout(
      "Your Bookmarks",
      `
      <div class="bookmark-list">
        ${bookmarks.length === 0 ? "<p>No bookmarks added yet.</p>" : listHtml}
      </div>
    `,
      "Your Bookmarks"
    )
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
      500
    );
  }
});
