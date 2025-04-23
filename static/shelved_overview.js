function displayTitle(){
    //empty old data
    $("#title_container").html($("<h1>").text("Choose a veggie to learn more!"))
}

function displayShelf(data){
    //empty old data
    $("#shelf_container").empty()

    //insert all new data
    $.each(data["items"], function(i, item){
        let new_row= $("<div><a href='" + window.location.href + "/" + item["description_id"] + "'>"+item["name"]+"</a></div>")
        $("#shelf_container").append(new_row)
    })
}

$(document).ready(function(){
    displayTitle()
    displayShelf(data)
})