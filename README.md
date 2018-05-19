
Purpose:
A fun/serious not for profit Environmental tool to keep a global log of dog turds.
Displays turd data on map to councils and pressure groups etc. 

Seen a turd? then...
Snapit and Mapit onto the ITS (International Turd Server)


3 Parts
1) App
2) Web
3) Rest

REST:
The International TurdServer.
A PI 3 running a node express REST server at home.

APP:
A virtual cloud app using React and Expo.


WEB:
For the full turd viewing experience on another PI, for councils etc, easy to access.


Developer getting started real basic...
Install expo on your phone
git clone https://github.com/ndmaque/dogturd.git
cd dogturd


# Rest
cd rest
vi rest/turdServer.js 
# and set the const server port to suit
npm install
node turdServer.js
# http://localhost:8095/turds

# open another terminal
# Run the app which will present it as a mobile app on your phone
vi app/App.js 
# set the turdServer address to suit
# start the server
cd app
npm install
npm start

# open expo on yr phone, scan the image and hey presto.


