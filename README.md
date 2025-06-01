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

## Project Structure

Built with Angular, the project follows a modular architecture:

- `src/app/components`: Reusable UI components.
- `src/app/core`: Core logic including guards, interceptors, and layouts.
- `src/app/models`: TypeScript models representing data structures.
- `src/app/pages`: Page-level components (Dashboard, Bookmarks, Collections, etc.).
- `src/app/services`: Services managing API interactions and application state.
- `src/environments`: Environment-specific configuration files.

## Prerequisites

Ensure you have the following installed before setting up the project:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [PNPM](https://pnpm.io/) (package manager)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/amrohan/memora
   cd memora
   ```

2. Install dependencies using PNPM:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm start
   ```

   Access the app at `http://localhost:4200`.

## Configuration

### Environment Variables

#### Development

Configure development environment variables in `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api", // Backend API endpoint
  authTokenKey: "auth_token",
  enableDebug: true,
};
```

#### Production

For production, create a `.env` file in the root directory with:

```
API_URL=https://your-production-api.com/api
AUTH_TOKEN_KEY=auth_token
ENABLE_DEBUG=false
```

### Additional Notes

- Update environment configurations in `src/environments/`.
- Modify build and project settings in `angular.json` as needed.

## Deployment

To build for production:

```bash
pnpm build
```

Production-ready files will be located in the `dist/` directory.

## Backend Repository

The backend API supporting this project is available here:
[https://github.com/amrohan/memora-backend](https://github.com/amrohan/memora-backend)

## License

This project is licensed under the MIT License. See the LICENSE file for details.
