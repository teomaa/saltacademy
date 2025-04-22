function displayMessage(data){
    //empty old data
    $("#test_container").empty()

    //insert all new data
    $.each(data, function(i, datum){
        let new_row= $("<div>"+datum["msg"]+"</div>")
        $("#test_container").append(new_row)
    })
}

$(document).ready(function(){
    displayMessage(data)
})