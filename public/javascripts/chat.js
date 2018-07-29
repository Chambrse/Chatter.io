var socket = io();

//-----------------------------------------------------------------------------
// Emit chat message when enter key is pressed.
//-----------------------------------------------------------------------------
$("#messageInput").keydown(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        if ($("#messageInput").val() === "admin chatsim") {
            chatSim();
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

    $("#holder1").children().append(messageDiv);

    if (checkHeight()) {
        moveDivs();
    };

});

function chatSim() {
    var toplevel = (new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log("successfully resolving");
            resolve();
        }, 5000);
        setTimeout(function() {
            console.log("first timeout, rejecting the promise");
            reject();
        }, 2000);
    })).catch(function() {
        console.log("timed out ... retrying");
        /* at this point, we have timed out, try again and return a new promise which will take over the old one if it fails */
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, 2000);
            setTimeout(reject, 4000);
        });
    });
    toplevel.then(function () {
        console.log("[SUCCESS] Toplevel Promise succeeded");
    }, function () {
        console.log("[FAIL] Toplevel Promise failed");
    });
};

function moveDivs() {

    console.log("movedivs is running");

    $("#holder1").animate([
        // keyframes
        { transform: 'translateY(0px)' },
        { transform: 'translateY(-300px)' }
    ], {
            // timing options
            duration: 1000,
            iterations: Infinity
        });

    $("#holder1").animate({
        right: "+=100%",
    }, 2, function () {
        // Animation complete.
        console.log("animate running");
    });

};

function checkHeight() {

    console.log($("#holder1").height());

    if ($("#holder1").height() > 500) {
        return true;
    } else {
        return false;
    };

};
