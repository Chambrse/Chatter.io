$(document).ready(function () {
    
    $("#nicknameSubmit").on("click", function (event) {
        localStorage.setItem("nickname", $("#nickname").val().trim());
    });

});