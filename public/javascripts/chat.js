$(document).ready(function () {

    var socket = io(window.location.host);

    //-----------------------------------------------------------------------------
    // Emit chat message when enter key is pressed.
    //-----------------------------------------------------------------------------
    $("#messageInput").keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            if ($("#messageInput").val() != "") {
                socket.emit("chat-message", { text: $("#messageInput").val(), selectedMessage: selectedMessage });
            };
            $("#messageInput").val("");
        };
    });


    //-----------------------------------------------------------------------------
    // Receive chat message from server.
    //-----------------------------------------------------------------------------
    let currentSledID = 0;
    let messageCount = 0;
    let isFirstCycle = true;
    let currentMessageId = 0;
    socket.on("chat-message", function (message) {

        console.log(message.replyto);

        $(".message[messageID=" + message.replyto + "]").addClass("repliedTo");

        currentMessageId = message.id;

        let messageDiv = $("<div class='message animated slideInRight'>");
        messageDiv.attr("messageID", message.id);
        messageDiv.text("[" + message.nickname + "]: " + message.text);

        $("#displayDiv").append(messageDiv);

        messageCount++;

        if (messageCount > 6) {
            messageCount = 0;
            changeDiv();
        };

    });

    let selectedMessage = 0;
    $(window).keydown(function (e) {

        // If you press Tab
        if (e.keyCode === 9) {
            e.preventDefault();

            
            if (selectedMessage === 0) {
                selectedMessage = currentMessageId;
            } else {
                selectedMessage--;
            }
            console.log(selectedMessage);

            $(".selected").removeClass("selected");
            $(".message[messageID=" + selectedMessage + "]").addClass("selected");
        } else if (e.keyCode === 27) {
            selectedMessage = 0;
            $(".selected").removeClass("selected");
        }

    });

    function changeDiv() {
        let newdiv = $("\
    <div class='col-3 displayDiv' state='initial' sledID='" + (currentSledID + 3) + "' style='z-index: " + (currentSledID + 3) + "; right: 0%;'>\
    </div>\
    <div class='col-3 displayDiv' state='initial'  sledID='" + (currentSledID + 2) + "' style='z-index: " + (currentSledID + 2) + "; right: 25%;'>\
    </div>\
    <div class='col-3 displayDiv' state='initial'  sledID='" + (currentSledID + 1) + "' style='z-index: " + (currentSledID + 1) + "; right: 50%;'>\
    </div>");
        if (currentSledID % 3 === 0 && !isFirstCycle) {
            $(".displayDiv").animate({ right: '+=75%' }, 1000);
            $("[state=full]").animate({ opacity: '0' }, 1000, function () {
                $("[state=toRemove]").remove();
            });
            $("#chatWindow").prepend(newdiv);
        }
        $("[sledID=" + (currentSledID - 1) + "]").attr("state", "toRemove");
        $("[sledID=" + currentSledID + "]").attr("id", "").attr("state", "full");
        $("[sledID=" + (currentSledID + 1) + "]").attr("id", "displayDiv");
        currentSledID++;
        isFirstCycle = false;
    };



});

