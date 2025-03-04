import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bookmarkRoutes } from "./routes/bookmark.route.js";
import { collectionRoute } from "./routes/collections.routes.js";
import { tagRoute } from "./routes/tags.route.js";

// Initialize the main Hono app
const app = new Hono();

// Root route - redirect to bookmarks
app.get("/", (c) => c.redirect("/bookmarks"));

// Mount bookmark routes
app.route("/bookmarks", bookmarkRoutes);
app.route("/collections", collectionRoute);
app.route("/tags", tagRoute);
// Server configuration
const PORT = 3000;

// Start the server
serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
