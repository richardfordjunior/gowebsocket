new Vue({
  el: '#app',

  data: {
    ws: null, //websocket
    newMsg: '',
    chatContent: '',
    email: null,
    username: null,
    joined: false,
    image: null
  },
  created: function () {
    var self = this;
    this.ws = new WebSocket('ws://' + window.location.host + '/ws', ['appProtocol', 'appProtocol-v2']);
    this.ws.addEventListener('message', function (e) {
      var msg = JSON.parse(e.data);
      self.chatContent += '<div class="chip">'
        + '<img src="' + self.gravatarURL(msg.email) + '">' // Avatar
        + msg.username
        + '</div>'
        + emojione.toImage(msg.message) + '<br/>'
        + msg.timestamp
        + '<br/>'; // Parse emojis

      var element = document.getElementById('chat-messages');
      element.scrollTop = element.scrollHeight; // Auto scroll to the bottom
    });
  },
  methods: {
    send: function () {
      if (this.newMsg != '') {
        this.ws.send(
          JSON.stringify({
            email: this.email,
            username: this.username,
            message: $('<p>').html(this.newMsg).text(), // Strip out html
            timestamp: new Date().toDateString()
          }
          ));
        if (document.getElementById('audio').paused) {
          document.getElementById('audio').play();
        }
        else {
          document.getElementById('audio').pause;
        }
        this.newMsg = ''; // Reset newMsg
      }
    },
    join: function () {
      if (!this.email) {
        Materialize.toast('You must enter an email', 2000);
        return
      }
      if (!this.username) {
        Materialize.toast('You must choose a username', 2000);
        return
      }
      this.email = $('<p>').html(this.email).text();
      this.username = $('<p>').html(this.username).text();
      this.joined = true;
    },
    gravatarURL: function (email) {
      return 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(email);
    }
  }
});