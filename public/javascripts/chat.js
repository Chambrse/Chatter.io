var socket = io();

//-----------------------------------------------------------------------------
// Emit chat message when enter key is pressed.
//-----------------------------------------------------------------------------
$("#messageInput").keydown(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        if ($("#messageInput").val() === "admin chatsim") {
            socket.emit("chatsim");
        }
        else if ($("#messageInput").val() != "") {
            socket.emit("chat-message", $("#messageInput").val());
        };
        $("#messageInput").val("");
    }
});

//-----------------------------------------------------------------------------
// Receive chat message from server.
//-----------------------------------------------------------------------------
socket.on("chat-message", function (message) {

    let messageDiv = $("<div class='message animated slideInUp'>");
    messageDiv.text(message);

    $("#holder1").append(messageDiv);

    if (checkHeight()) {
        moveDivs();
    };

});

function moveDivs() {

    let goCol2 = $("#holder1").detach();
    goCol2.addClass("animated slideInRight");
    $("#col2").attach(goCol2);

};

function checkHeight() {

    console.log($("#holder1").height());

    if ($("#holder1").height() > 500) {
        return true;
    } else {
        return false;
    };

};
