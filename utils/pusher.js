
const Pusher = require("pusher");

const isPusherConfigured = () => {
    return process.env.PUSHER_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET;
};

const pusher = isPusherConfigured() ? new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true
}) : null;

const broadcast = (message = '') => {
    if (pusher) {
        pusher.trigger("dezigned", 'scraping', { message: message }, (error, request, response) => {
            if (error) {
              console.error('Error triggering Pusher event:', error);
            } else {
              console.log('Pusher event triggered successfully');
            }
        });
    }
}

module.exports = {
    broadcast
}