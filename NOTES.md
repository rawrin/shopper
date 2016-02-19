To start server:
1. Run `npm install`
2. Run `npm run watch`

To Do List For Shopper Project:
===============================

In no particular order...

1. Sessions
2. Database persistance
3. Applicant endpoints
4. Funnel endpoints


1. Create Gulpfile instead of relying on NPM scripts
2. Full Test Coverage
3. Front end optimizations
4. .eslintrc
5. Mobile optimizations
6. What happens after the shopper flow is complete?
7. Prop validation in components

I spent about 9-12 hrs on the front end portion of this app. The decision to use a static floating modal in the center of the page was to reduce context switching from the viewer clicking apply to going to a different app. I would like to add more information to draw the user in and make better use of the extra whitespace in the modal but I felt I spent a bit too much time on the design aspect. The code itself for the front end is quite simple, I used React because I personally enjoy the API as well as the sensible architecture. I felt I could've done better in organizing all the components and fleshing out their options more. I'm not entirely happy with the validation API I used (`.checkValidity()` in AppContainer.js) and I felt like a proper next step would be to use React to validate the components itself. For the session data, I decided to use server-side rendering in order to propogate the props throughout the components. The cities input for the form currently is a hardcoded object, but ideally it should come from the backend similarly to the session user data. 

As for the saving of the applicants into the database, I built the form around the prompt and didn't notice the difference in schemas from the development.sqlite3 file, so I decided to separate the different parts of the project into 2 different tables. Ideally they would be in the same one.