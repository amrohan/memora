# Memora

Memora is a modern web application designed to help you efficiently manage bookmarks, collections, and tags. It features a clean, intuitive interface that makes organizing and accessing your saved content effortless.

## Features

- **Authentication**: Secure login and registration system.
- **Bookmark Management**: Add, edit, and delete bookmarks with ease.
- **Collections**: Group bookmarks into customizable collections.
- **Tags**: Use tags for flexible and enhanced categorization.
- **Search**: Quickly locate bookmarks using the powerful search functionality.
- **Link Sharing to Memora PWA**: Users can share links directly to the Memora Progressive Web App from their browser or mobile device, and the shared links get saved automatically in the app.
- **Responsive Design**: Fully optimized for both desktop and mobile devices.

---

## Architectural Overview

Memora employs Angular's component-based architecture to deliver a responsive, maintainable, and scalable user interface. The frontend connects to a dedicated backend API (memora-backend) through RESTful endpoints for all data operations.

### Core Functionalities

- **Secure Authentication**: Uses JWT stored in localStorage with HTTP interceptors injecting tokens into API requests automatically.
- **Bookmark Management**: Supports full CRUD with real-time UI updates via Angular services.
- **Collections & Tags**: Implements hierarchical collections and multi-label tagging systems using recursive components and centralized state management.
- **Search**: Utilizes Angular reactive forms with debounce strategies for instant search results across multiple metadata fields.
- **PWA Support**: Features offline access, background sync, and native install prompts via Angular service workers.
- **Web Share API Integration**: Allows sharing bookmarks directly from device share dialogs into the Memora app.

---

## Project Structure

Built with Angular, the project follows a modular architecture:

- `src/app/components`: Reusable UI components.
- `src/app/core`: Core logic including guards, interceptors, and layouts.
- `src/app/models`: TypeScript models representing data structures.
- `src/app/pages`: Page-level components (Dashboard, Bookmarks, Collections, etc.).
- `src/app/services`: Services managing API interactions and application state.
- `src/environments`: Environment-specific configuration files.

---

## Development Environment Configuration

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [PNPM](https://pnpm.io/) (package manager)
- Angular CLI (v17+)
- TypeScript (v5+)

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/amrohan/memora
   cd memora
   ```

2. Install dependencies using PNPM:

   ```bash
   pnpm install
   ```

3. Configure environment variables for development:

   ```typescript
   // src/environments/environment.development.ts
   export const environment = {
     production: false,
     apiUrl: "http://localhost:3000/api",
     enableDebug: true,
   };
   ```

4. Start the development server with hot reload:

   ```bash
   pnpm start
   ```

   Access the app at `http://localhost:4200`.

### Production Deployment Configuration

1. Create `.env` file with production variables:

   ```
   API_URL=https://your-production-api.com/api
   ENABLE_DEBUG=false
   ```

2. Build optimized production bundle:

   ```bash
   pnpm build
   ```

3. Deploy the generated `dist/memora` directory to your hosting platform.

---

## State Management Strategy

Memora uses service-based state management with RxJS observables. Services like `BookmarkService` and `CollectionService` cache API data locally to minimize network calls and ensure responsive UI updates.

---

## Advanced Features Implementation

### Progressive Web App (PWA) Functionality

- Offline access to bookmarks via cached API responses.
- Background synchronization of pending changes.
- Native-like installation prompts compliant with Lighthouse standards.

### Web Share API Integration

Allows users to share bookmarks from any app or browser directly to Memora:

```typescript
async shareBookmark(bookmark: Bookmark) {
  try {
    await navigator.share({
      title: bookmark.title,
      text: bookmark.description,
      url: bookmark.url
    });
  } catch (error) {
    console.error('Sharing failed:', error);
  }
}
```

---

## Performance Optimization Techniques

- Lazy loading of feature modules.
- Tree shaking and AOT compilation.
- Compressed assets and image optimization.
- Use of OnPush change detection for complex components.
- Virtual scrolling in lists.
- Debounced input for search.

---

## Testing Strategy

- **Unit Tests**: Jasmine and Karma with coverage targets.
- **End-to-End Tests**: Cypress for critical user flows.
- **Performance Checks**: Lighthouse CI integrated in CI pipelines.

Run tests using:

```bash
pnpm test
```

---

## Backend Repository

The backend API supporting this project is available here:
[https://github.com/amrohan/memora-backend](https://github.com/amrohan/memora-backend)

---

## Contribution Guidelines

- Branch from `develop`.
- Add TypeDoc comments for new features.
- Write/update unit and E2E tests.
- Follow Angular ESLint and Prettier style.
- Use conventional commits for PRs.
- Ensure CI checks pass before merging.

---

## Roadmap and Future Enhancements

- Browser extension for one-click bookmarking.
- Collaborative collections with sharing permissions.
- Full-text search powered by Elasticsearch.
- Cross-device sync via WebSockets.
- Analytics dashboard for user insights.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
