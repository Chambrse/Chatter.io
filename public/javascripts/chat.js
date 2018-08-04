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
let currentSledID = 0;
let messageCount = 0;
let isFirstCycle = true;
socket.on("chat-message", function (message) {

    console.log(message);

    let messageDiv = $("<div class='message animated slideInRight'>");
    messageDiv.text(message.text);
    messageDiv.attr("messageID", message.messageID)

    $("#displayDiv").append(messageDiv);

    messageCount++;
    console.log(messageCount);

    if (messageCount > 6) {
        messageCount = 0;
        changeDiv();
    };

});

function moveDivs() {

    console.log("movedivs");
    $("#chatWindow").children().last().remove();
    $(".displayDiv").css("z-index", "-=1");
    $(".displayDiv").animate({ right: '+=25%' }, 1000);
    $("#displayDiv").attr("id", null);
    let newdiv = $("<div class='col-3 displayDiv animated slideInLeft' id='displayDiv' style='z-index: 4;right: 0%;'></div>");
    $("#chatWindow").prepend(newdiv);

};

function changeDiv() {
    let newdiv = $("\
<div class='col-3 displayDiv' sledID='" + (currentSledID + 3) + "' style='z-index: 4; right: 0%;'>\
</div>\
<div class='col-3 displayDiv' sledID='" + (currentSledID + 2) + "' style='z-index: 3; right: 25%;'>\
</div>\
<div class='col-3 displayDiv' sledID='" + (currentSledID + 1) + "' style='z-index: 2; right: 50%;'>\
</div>");
    if (currentSledID % 3 === 0 && !isFirstCycle) {
        $(".displayDiv").animate({ right: '+=75%' }, 1000);/* .then(function() {
            $("[sledid<" + currentSledID + "]").remove();
        }); */
        $("#chatWindow").prepend(newdiv);
        $("[sledID=" + currentSledID + "]").css("z-index", "1");
        console.log("sledid", currentSledID);

    }
    $("[sledID=" + currentSledID + "]").attr("id", "");
    $("[sledID=" + (currentSledID + 1) + "]").attr("id", "displayDiv");
    currentSledID++;
    isFirstCycle = false;
}


