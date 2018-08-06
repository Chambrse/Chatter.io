$(document).ready(function () {

    var socket = io();
    let userNickName;

    $(window).on('load', function () {
        $('#exampleModal').modal('show');
    });

    //-----------------------------------------------------------------------------
    // Emit chat message when enter key is pressed.
    //-----------------------------------------------------------------------------
    $("#messageInput").keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            if ($("#messageInput").val() != "") {
                socket.emit("chat-message", { text: $("#messageInput").val(), nickname: userNickName });
            };
            $("#messageInput").val("");
        };
    });

    $("#nickNameButton").on("click", function () {
        userNickName = $("#nickName").val().trim();
    });

    //-----------------------------------------------------------------------------
    // Receive chat message from server.
    //-----------------------------------------------------------------------------
    let currentSledID = 0;
    let messageCount = 0;
    let isFirstCycle = true;
    socket.on("chat-message", function (message) {

        console.log(message);

        let messageDiv = $("<div class='message animated slideInRight' messageID =>");
        messageDiv.attr("messageID", message.id);
        if (message.nickname) {
            messageDiv.text(message.nickname + ": " + message.text);
        } else {
            messageDiv.text(message.text);
        };

        $("#displayDiv").append(messageDiv);

        messageCount++;
        console.log(messageCount);

        if (messageCount > 6) {
            messageCount = 0;
            changeDiv();
        };

    });

    function changeDiv() {
        let newdiv = $("\
<div class='col-3 displayDiv' state='initial' sledID='" + (currentSledID + 3) + "' style='z-index: " + (currentSledID + 3) + "; right: -75%;'>\
</div>\
<div class='col-3 displayDiv' state='initial'  sledID='" + (currentSledID + 2) + "' style='z-index: " + (currentSledID + 2) + "; right: -50%;'>\
</div>\
<div class='col-3 displayDiv' state='initial'  sledID='" + (currentSledID + 1) + "' style='z-index: " + (currentSledID + 1) + "; right: -25%;'>\
</div>");


        if (currentSledID % 3 === 0 && !isFirstCycle) {
            $("#chatWindow").prepend(newdiv);

            $(".displayDiv").transition({ right: '+=75%' }, 1000);
            $("[state=full]").transition({ opacity: '0' }, 1000, function () {
                $("[state=toRemove]").remove();
            });
        };
            $("[sledID=" + (currentSledID - 1) + "]").attr("state", "toRemove");
            $("[sledID=" + currentSledID + "]").attr("id", "").attr("state", "full");
            $("[sledID=" + (currentSledID + 1) + "]").attr("id", "displayDiv");
            currentSledID++;
            isFirstCycle = false;
    };

    });

