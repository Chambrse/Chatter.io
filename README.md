# Chatter.io
Have you ever been live streaming an important event or popular streamer on facebook or twitch and tried to participate in chat? If there are a lot of people, the chat goes by so fast that you can't keep up; let alone hold a back and forth conversation with someone else in the room.

The purpose of this project is to experiment with alternative chat user interfaces that allow for easier readability, less wasted space, and enhanced reply and thread management functionality.

## Student project
This is my passion/side project while I'm a student in the Coding Boot Camp at the University of Arizona. The idea came to me before my web development education started, and I've been regularly refactoring it as I learn new tools. It started as a static web page with an input box and a mock-up of what the UI structure could look like. Then, upon learning express, mysql, and heroku, I had enough to actually make a chat room. I improved the UI slightly, and added user authentication using passport. Going forward, I plan to incorporate mocha and chai for testing, and conform to a standard coding style using eslint.

## Deployed version
https://chatter-48124.herokuapp.com/

### Contributors
Shane Chambry

### Key tools/technologies
* socket-io  
  The fundamental building block for the chat room. Messages are received by the server listening to the socket and emitted to all sockets.
* Express  
  For creating our server.
* handlebars  
  The view engine.
* Sequelize  
  For database interactions.
* Passport  
  For user authentication.

