webSci_lab6
===========

Description
-----------
Display two buttons that will run nodejs functions to create a tweets.json file and then export that json file to a csv file. There is a basic HTML form that is used to display the buttons, the header, and the alert messages to notify the user of what is going on. Jquery is used to create click events for the buttons to emit events to the server. Twitter bootstrap is used to style the form, buttons and layout. The application is responsive via bootstrap. Communication via the client and the server is handled via the Socket.io module. 

Reflection
----------
Handling events in nodejs can be quite tedious when first looking at them. Using Socket.io allows for easy access to client and server side events via a socket. This allows the client to emit an event to the server and the server to emit to a single socket or to all sockets. Exporting json to csv also isn't that bad when you use a module that can be included via npm. NPM is powerful and allows a developer to easily reuse modules they have devleoped or to use modules from other developers. Nodejs makes it simple to communicate between the server and the client and allow for interactivity.

References
----------
[Socket.io](http://socket.io/ "Socket.io")
[Nodejs.org](http://nodejs.org/ "Nodejs")
[getbootstrap.com](http://getbootstrap.com/ "Twitter Bootstrap")
[node-fs](http://nodejs.org/api/fs.html "Node Filesystem")
[json2csv module](https://github.com/zeMirco/json2csv "json2csv Module")
[expressjs.com](http://expressjs.com/ "ExpressJS")