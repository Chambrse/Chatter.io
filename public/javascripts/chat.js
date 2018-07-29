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

let messageCount = 0;
socket.on("chat-message", function (message) {

    let messageDiv = $("<div class='message animated slideInRight'>");
    messageDiv.text(message);

    $("#displayDiv").append(messageDiv);

    messageCount++;
    console.log(messageCount);

    if (messageCount > 6) {
        console.log(messageCount);
        messageCount = 0;
        moveDivs();
    };

});

function moveDivs() {

    console.log("movedivs");
    $("#chatWindow").children().last().remove();
    $(".displayDiv").css("z-index", "-=1");
    $("#displayDiv").attr("id", null);
    let newdiv = $("<div class='col-3 displayDiv animated slideInLeft' id='displayDiv' style='z-index: 4'></div>");
    $("#chatWindow").prepend(newdiv);

};
