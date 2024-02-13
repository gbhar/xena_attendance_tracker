# Bootcamp Guide

Please refer to the following guide to run through the React/Node.js workshop of
the Commercial Technology Software Development Bootcamp.

1. Set up the bootcamp project locally by following the instructions in the
   Running Locally paragraph below.
2. Refer to the docs for both React and Node.js
   [here](https://sourcecode.jnj.com/pages/asx-xena/xena-training/master/browse/docs/#/application-development-fundamentals/index)
   for help if you run into issues with the following bootcamp tasks.
3. **Bootcamp Tasks:** For each task, please refer to the file mentioned and
   fill in the omitted sections indicated by the _TODO_ comments.
   - **Node**
     - **_Starters_**
       1. Check out the `skeleton-be` branch
       2. `backend/public/swagger.yaml`: Add a path definition for the
          `/api/students` route
       3. `backend/src/constants/index.js`: Fill in the constants object with
          the correct HTTP status code depending on the response type
       4. `backend/src/routes/students/findOneStudent.js`: Refactor this file to
          use the constants file you filled in above; this avoids
          "[magic numbers](https://stackoverflow.com/questions/47882/what-is-a-magic-number-and-why-is-it-bad)"
          when sending back the HTTP status code in the routes
       5. `backend/src/routes/students/findAllStudents.test.js`: Fill in the
          `it` body for the "_should return a 200 with all the students_" test
       6. `backend/src/routes/students/index.js`: Add another route definition
          for finding all students
     - **_Extra Enhancements_** (there are no TODOs for these in the mentioned
       files but these are extra tasks you can do once you finish the ones
       above)
       1. Add another route for deleting a student to
          `backend/src/routes/students/index.js` using the `DELETE` HTTP Verb
       2. Add another route for updating a student to
          `backend/src/routes/students/index.js` using the `PUT` HTTP Verb
       3. Add another route to `backend/src/routes/students/index.js` to search
          for a student by passing in various input filters (such as number of
          current lates, first name, homeroom teacher name, etc.)
   - **React**
     - **_Starters_**
       1. Check out the `skeleton-fe` branch
       2. `frontend/src/components/StudentTable/StudentTable.component.js`: Map
          through `students` and render a TableRow for each element
       3. `frontend/src/components/ProgressBar/ProgressBar.test.js`: Write test
          file for ProgressBar component
       4. `frontend/src/components/UserForm/UserForm.component.js`: Update
          handleChange function
     - **_Extra Enhancements_** (there are no TODOs for these in the mentioned
       files but these are extra tasks you can do once you finish the ones
       above)
       1. In `StudentTable.component.js` there are 5 TableCell components with
          repeated code. Create another component that renders a TableCell and
          render that component instead
       2. Create a new theme and add a ThemeContext. Create a dropdown/toggle to
          switch between themes.
       3. Add a Delete button to the table that calls the DELETE route created
          in the Node Extra Enhancements
       4. When a user clicks a row in the table, it should open a popup and make
          a call to `/students/:id` and populate a table with data

## Running the Project Locally

1. Run `npm install` (this will install the necessary node packages in the root,
   backend, and frontend directories, including Husky based Git hooks,
   formatting tools like Prettier, and more)
2. Copy `.env.example` into your own local environment file (`.env`)
3. Fill in the `MYSQL_PASSWORD` with your own local DB password
4. Run `docker-compose up -d`
5. Access the backend at [localhost:5000](http://localhost:5000) (all routes are
   prefixed with `/api`, e.g. <http://localhost:5000/api/students>)
6. View the DB with [adminer](https://www.adminer.org/) at
   [localhost:8000](http://localhost:8000)
   1. Credentials are as follows for the **development database**:
      1. **System:** MySQL
      2. **Server:** at-db
      3. **Username:** at-admin
      4. **Password:** _The password you put in for `MYSQL_PASSWORD` in your
         `.env` file._
      5. **Database:** _attendance-tracker_
   2. Credentials are as follows for the **testing database** (any test data
      generated by test files)
      1. **System:** MySQL
      2. **Server:** at-test-db
      3. **Username:** at-admin
      4. **Password:** _The password you put in for `MYSQL_PASSWORD` in your
         `.env` file._
      5. **Database:** _attendance-tracker_
7. Access the frontend at [localhost:3000](http://localhost:3000)

## Running Backend Tests

If you'd like to run the backend tests, please use the following steps:

1. Enter the backend docker container using
   `docker-compose exec at-backend bash`
2. Run `npm run test` inside the backend container
3. Exit by typing `^C`

## Running Frontend Tests

If you'd like to run the frontend tests, please use the following steps:

1. Enter the frontend docker container using
   `docker-compose exec at-frontend bash`
2. Run `npm run test` inside the frontend container
3. Exit by typing `^C`

## Logs

You can view backend logs at `/backend/logs` where they're ordered by the date.