# Memora

Memora is a web application designed to manage bookmarks, collections, and tags efficiently. It provides a user-friendly interface for organizing and accessing your saved content.

## Features

- **Authentication**: Secure login and registration system.
- **Bookmark Management**: Add, edit, and delete bookmarks.
- **Collections**: Organize bookmarks into collections.
- **Tags**: Add tags to bookmarks for better categorization.
- **Search**: Quickly find bookmarks using the search feature.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Project Structure

The project is built using Angular and follows a modular structure:

- `src/app/components`: Reusable UI components.
- `src/app/core`: Core functionalities like guards, interceptors, and layouts.
- `src/app/models`: TypeScript models for data structures.
- `src/app/pages`: Page components for different views (e.g., Dashboard, Bookmarks, Collections).
- `src/app/services`: Services for handling API calls and state management.
- `src/environments`: Environment-specific configurations.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PNPM](https://pnpm.io/) (Package manager)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
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

   The application will be available at `http://localhost:4200`.

4. Run tests (optional):
   ```bash
   pnpm test
   ```

## Configuration

### Environment Variables

#### Development

Set the following variables in `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api", //  where your backend application is runing...
  authTokenKey: "auth_token",
  enableDebug: true,
};
```

#### Production

Create a `.env` file in the root directory and set the following variables:

```
API_URL=https://your-production-api.com/api
AUTH_TOKEN_KEY=auth_token
ENABLE_DEBUG=false
```

### Additional Configuration

- Update environment-specific settings in `src/environments/`.
- Modify `angular.json` for build and project configurations.

## Deployment

To build the project for production:

```bash
pnpm build
```

The production-ready files will be available in the `dist/` directory.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
\*\*
