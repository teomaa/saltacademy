types_of_salt = {
    1: {
        "id": 1,
        "layout_type": "advancable_big_graphic",
        # layout like in the matching Canva design, with one large graphical element in the center and arrows
        # for navigation
        "title": "Table Salt",
        "description": "salt",
        "img": "url",
        "prev_id": None,
        "next_id": 2,
        "back_url": "/basics",
    },
    2: {
        "id": 2,
        "layout_type": "advancable_big_graphic",
        "title": "Kosher Salt",
        "description": "salt",
        "img": "url",
        "prev_id": 1,
        "next_id": 3,
        "back_url": "/basics",
    },
    3: {
        "id": 3,
        "layout_type": "advancable_big_graphic",
        "title": "Maldon Salt",
        "description": "salt",
        "img": "url",
        "prev_id": 2,
        "next_id": None,
        "back_url": "/basics",
    }
}

vegetables = {
    1: {
        "id": 1,
        "name": "Tomato",
        "icon": "url",
        "description_id": 1,
    },
    2: {
        "id": 2,
        "name": "Cucumber",
        "icon": "url",
        "description_id": 1,
    },
    3: {
        "id": 3,
        "name": "Eggplant",
        "icon": "url",
        "description_id": 1,
    },
    4: {
        "id": 4,
        "name": "Mushroom",
        "icon": "url",
        "description_id": 2,
    },
    5: {
        "id": 5,
        "name": "Potato",
        "icon": "url",
        "description_id": 3,
    },
    6: {
        "id": 6,
        "name": "Carrot",
        "icon": "url",
        "description_id": 3,
    },
}

vegetable_descriptions = {
    1: {
        "id": 1,
        "layout_type": "big_graphic",
        # layout like in the matching Canva design, with one large graphical element on the
        # right, and text with icons above on the left.
        "title": "Tomatoes, Cucumbers, Eggplants",
        "description": "todo",
        "main_graphic": "url",
        "back_url": "/vegetables"
    },
    2: {
        "id": 2,
        "layout_type": "big_graphic",
        # layout like in the matching Canva design, with one large graphical element on the
        # right, and text with icons above on the left.
        "title": "Mushrooms",
        "description": "todo",
        "main_graphic": "url",
        "back_url": "/vegetables"
    },
    3: {
        "id": 3,
        "layout_type": "tri_text",
        # layout like in the matching Canva design, with three text segments, each with small graphics above
        "title": "Potatoes and other Veggies",
        "area_1": {
            "description": "todo",
            "icons": [
                "url",
                "url"
            ]
        },
        "area_2": {
            "description": "todo",
            "icons": [
                "url"
            ]
        },
        "area_3": {
            "description": "todo",
            "icons": [
                "url",
                "url"
            ]
        },
        "back_url": "/vegetables"
    }
}

quiz = {
    1: {
        "id": 1,
        "type": "multiple_choice",
        "question": "How much Kosher salt would you add to a pot of boiling pasta?",
        "answers": {
            1: "one pince",
            2: "2 wrist wags worth",
            3: "1 handful",
            4: "2 handfuls",
        },
        "correct_answer": 4
    },
    2: {
        "id": 2,
        "type": "sort_into_categories",
        "question": "Drag the situation to the appropriate type of salt to use.",
        "options": {
            1: {
                "text": "Adding some salt to a meal already cooked",
                "target": 1
            },
            2: {
                "text": "Salting pasta water",
                "target": 2
            },
            3: {
                "text": "Salting tomatoes",
                "target": 2
            },
            4: {
                "text": "Adding salt to a avocado egg toast",
                "target": 3
            },
        },
        "targets": {
            1: "Maldon Salt",
            2: "Kosher Salt",
            3: "Table Salt",
        }
    },
    3: {
        "id": 3,
        "type": "put_in_order",
        "question": "Put these items in order of how far in advance they should be salted.",
        "options": {
            1: {
                "text": "Shrimp",
                "order": 5
            },
            2: {
                "text": "Chicken breast",
                "order": 2
            },
            3: {
                "text": "Whole turkey",
                "order": 1
            },
            4: {
                "text": "Cucumbers",
                "order": 4
            },
            5: {
                "text": "Salmon",
                "order": 3
            },
        }
    },
    4: {
        "id": 4,
        "type": "choose_video",
        "question": "Which of the following videos shows better technique?",
        "options": {
            1: {
                "text": "Video A",
                "video": "url",
                "correct": True,
            },
            2: {
                "text": "Video B",
                "video": "url",
                "correct": False,
            }
        }
    }
}