To start server:


1. Run `npm install`


2. Run `npm run watch`


For the funnel endpoint to work, it is assumed there is a development.sqlite3 file with a pre-existing shopper table.


SUMMARY:
========

I spent about 12-13 hrs on the front end portion of this app. The decision to use a static floating modal in the center of the page was to reduce context switching from the viewer clicking apply to going to a different app. I would like to add more information to draw the user in and make better use of the extra whitespace in the modal but I felt I spent a bit too much time on the design aspect. The code itself for the front end is quite simple, I used React because I personally enjoy the API as well as the sensible architecture. I felt I could've done better in organizing all the components and fleshing out their options more. I'm not entirely happy with the validation API I used (`.checkValidity()` in AppContainer.js) and I felt like a proper next step would be to use React to validate the components itself. For the session data, I decided to use server-side rendering in order to propogate the props throughout the components. The cities input for the form currently is a hardcoded object, but ideally it should come from the backend similarly to the session user data. 

As for the saving of the applicants into the database, I built the form around the prompt and didn't notice the difference in schemas from the development.sqlite3 file, so I decided to separate the different parts of the project into 2 files. Ideally they would be in the same one.

In the backend, I decided to use knex for SQL query building to avoid writing string queries, but if the need came down to it you can use the "raw" functionality of knex to write more custom queries. I'm using the async module to run the queries in parallel. Depending on usage, this part can be refactored to a singular transaction and the module I created for the database can be refactored to use transaction promise objects instead. The funnel endpoint as well as the module I created for interacting with the database needs tests. I did a lot of manual testing, but we don't want any future changes to affect pre-existing functionality so tests are absolutely integral. The dates being used for the funnel should be standardized as well instead of giving the end user options for what date formats they would like to use. 

Overall this whole project took about 22 hrs total, some optimizations I can do is saving where the user stopped his or her process and send the stage data back to the client so they can continue where they stopped. A UX improvement definitely with validation messages other than just a colored border on the inputs as well as more information on the landing page. Creating a "stage display" to show what steps the user is currently at as well as the total amount of steps would probably be a UX improvement as well.


To Do List For Shopper Project:
===============================

1. Create Gulpfile instead of relying on NPM scripts
2. Full Test Coverage
3. Front end optimizations
4. .eslintrc (Lint)
5. Mobile optimizations
6. What happens after the shopper flow is complete?
7. Prop validation in components
8. Better validation messages for input fields
9. Optimization for SQL queries

These are some optimizations I was hoping to get to, but I wasn't able to in no particular order.