

const { PeerServer } = require('peer');

const peerServer = PeerServer({
  port: 3001, // Customize the port number according to your preference
  path: '/peer', // Set the path for PeerJS communication
  allow_discovery: true, // Enable Peer discovery
  proxied: true, // Set to true if your app is behind a proxy (like in a deployment)
});

console.log('Peer server is running on port 3001'); // Change the message if you modified the port number
