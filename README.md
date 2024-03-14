# Social Media Backend with Express.js

This repository contains the backend code for a social media platform I built with Express.js. The backend provides APIs for user management, posts.

## 🔧Features

- **User Management:**
  - Create a new user
  - Update password
  - Login user
  - Get user profile
  - Logout profile

- **Posts:**
  - Create a new post
  - Get all posts
  - Get user's posts and posts from friends
  - Get a single post
  - Update a post
  - Delete a post
  - Like/Unlike a post


# Usage :

1. Fork the repo and then clone it or download it.

2. First install all dependencies:

     ```bash
     # with npm
     npm install

     # or with yarn
     yarn
     ```

3. Create a `config/config.js` file and insert the following code it will contains all code variables. Replace values with yours !!!

     ```javascript
     MONGODB_URL
     PORT
     JWT_SECRET
     ```

4. Start the server
     ```javascript
     npm start
     ```
 
## File Structure
- routes: Contains route handlers for different entities (users, posts, comments, notifications, friendships).
- controllers: Implements the logic for route handlers.
- models: Defines Mongoose models for users, posts, notifications, etc.
- app.js: The main application file that sets up Express and connects routes.

## 📦Getting Started
1. Clone the repository:

   ```bash
   git clone https://github.com/amanupadhyay33822/Social-networking-site-backend.git
