# MovieScope React

A React refactor of my original JavaScript movie search project, completed for Frontend Simplified coursework.

## Features

- Search movies using the OMDb API.
- Sort displayed results by title or year.
- View individual movie details through dynamic routes.
- Return to results with the selected sort preserved.
- Display loading skeletons and API error messages.
- Responsive layouts for desktop, tablet, and mobile.

## Built With

React, React Router, Vite, JavaScript, CSS, and the OMDb API.

## Run Locally

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```dotenv
VITE_OMDB_API_KEY=your_omdb_api_key
```

Start the development server:

```bash
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Notes

Search and sort apply to the results returned by the current API request.
The React version preserves the original MovieScope design and adds a movie details page.