function displayBigGraphic(data){
    let mainContainer = $("#main_container")
    let leftArea = $("<div class='col-6'>")
    //empty old data
    $.each(items, function(i, item){
        let icon = $("<img src='" + items[0]["icon"] + "'>")
        leftArea.append(icon)
    })
    leftArea.append($("<p>").text(data["description"]))

    let rightArea= $("<div class='col-6'><img src='" + item_description["img"] + "' </div>")

    mainContainer.html($("<div class='grid'>"))
    mainContainer.append(leftArea)
    mainContainer.append(rightArea)
    mainContainer.append($("</div>"))
}

$(document).ready(function(){
    if (item_description["layout_type"] === "big_graphic") {
        displayBigGraphic(item_description)
    }
})


        // "id": 1,
        // "layout_type": "big_graphic",
        // # layout like in the matching Canva design, with one large graphical element on the
        // # right, and text with icons above on the left.
        // "title": "Tomatoes, Cucumbers, Eggplants",
        // "description": "todo",
        // "main_graphic": "url",
        // "back_url": "/vegetables"