# MovieScope

MovieScope is a responsive movie search application built with HTML, CSS, and JavaScript. It uses the OMDb API to retrieve movie information, display rich movie details, and provide a clean, user-friendly search experience.

I chose a movie search project because it connects well with my interest in media organization while still meeting the take-home project's requirements for API fetching, dynamic rendering, filtering, loading states, and responsive design.

## Features

- Search movies by title
- Display dynamic movie cards
- Show skeleton loading cards
- Sort results
- Friendly no-results message
- Responsive layout
- Custom MovieScope branding

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- OMDb API

## Project Structure

```text
take-home-interview/
├── css/
│   └── styles.css
├── images/
│   └── Banner.jpg
├── js/
│   ├── api.js
│   ├── app.js
│   └── ui.js
├── index.html
└── README.md
```

## How It Works

The app starts with a default search for `The Matrix`. When a user submits a new search, JavaScript sends a request to the OMDb API, fetches the first six movie matches, then requests detailed information for each movie. Those details are normalized in `api.js`, rendered into cards in `ui.js`, and sorted through the controls managed in `app.js`.

If OMDb returns no matches, the app shows:

```text
No movies found. Try another title.
```
## Lessons Learned

- Working with external APIs using Fetch
- Organizing JavaScript into separate modules
- Handling loading, success, and error states
- Building a responsive user interface

## Future Improvements

- Add a movie details view
- Add favorite or saved movies
- Add pagination for more than six results
- Add advanced filters for genre or movie type
- Add better search suggestions
