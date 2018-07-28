var socket = io();

//-----------------------------------------------------------------------------
// Emit chat message when enter key is pressed.
//-----------------------------------------------------------------------------
$("#messageInput").keydown(function(event) {
      if (event.keyCode == 13) {
          event.preventDefault();
          if ($("#messageInput").val() != "") {
              socket.emit("chat-message", $("#messageInput").val());
              $("#messageInput").val("");
          }
      }
});

//-----------------------------------------------------------------------------
// Receive chat message from server.
//-----------------------------------------------------------------------------
socket.on("chat-message", function(message) {
    $("#col1").append(message + "<br />")
});
