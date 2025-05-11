#----------------------------------------------
#--------------------BASICS--------------------
#----------------------------------------------
types_of_salt = {
    1: {
        "id": 1,
        "layout_type": "popover_info",
        "page_title": "Types of Salt",
        "title": "Table Salt",
        "description": "Table salt is the finely ground, heavily processed salt you’ll find in most salt shakers. It usually contains additives like iodine (a nutrient) and anti-caking agents, which can lend a faint bitterness or metallic edge. Because it's so dense and uniform, it's easy to oversalt with.",
        "img": "table_salt.png",
        "prev_id": None,
        "next_id": "/types/2",
        "back_url": "/basics",
        # Direct link for search/navigation
        "url": "/types/1",
    },
    2: {
        "id": 2,
        "layout_type": "popover_info",
        "page_title": "Types of Salt",
        "title": "Kosher Salt",
        "description": "Kosher salt is the kitchen staple. Its large, pure crystals stick well to food and dissolve easily, perfect for seasoning meat, veggies, or pasta water. Less salty by volume than table salt, it gives you more control—taste as you go.",
        "img": "kosher_salt.png",
        "prev_id": "/types/1",
        "next_id": "/types/3",
        "back_url": "/basics",
        "url": "/types/2",
    },
    3: {
        "id": 3,
        "layout_type": "popover_info",
        "page_title": "Types of Salt",
        "title": "Maldon Salt",
        "description": "Maldon is a flaky sea salt for finishing, not cooking. Its light, crunchy texture adds sparkle and contrast—great on salads, roasted veggies, or even chocolate. Think of it as edible glitter for your food.",
        "img": "maldon_salt.png",
        "prev_id": "/types/2",
        "next_id": None,
        "back_url": "/basics",
        "url": "/types/3",
    }
}

measuring_techniques = {
    1: {
        "id": 1,
        "layout_type": "advancable_big_graphic",
        # "page_title": "Types of Salt",
        "title": "The Palmful",
        "description": "The handful is a bold scoop, used when salting big pots of water or large batches of food. It’s about trusting your senses—more feel than measure.",
        "img": "esnupi.gif",
        "prev_id": None,
        "next_id": "measure/2",
        "back_url": "/basics",
        # Direct link for search/navigation
        "url": "/measure/1",
    },
    2: {
        "id": 2,
        "layout_type": "advancable_big_graphic",
        # "page_title": "Types of Salt",
        "title": "The Wrist Wag",
        "description": "The wrist wag is a quick side-to-side flick used to evenly shower salt over food. It’s ideal for seasoning large surfaces, like roasting pans or steaks, from a few inches above.",
        "img": "esnupi.gif",
        "prev_id": "measure/1",
        "next_id": "measure/3",
        "back_url": "/basics",
        "url": "/measure/2",
    },
    3: {
        "id": 3,
        "layout_type": "advancable_big_graphic",
        # "page_title": "Types of Salt",
        "title": "The Pinch",
        "description": "The pinch uses your thumb, index, and middle fingers to grab a small, controlled amount of salt. It’s perfect for tasting and adjusting during cooking or adding a touch to small portions.",
        "img": "esnupi.gif",
        "prev_id": "measure/2",
        "next_id": None,
        "back_url": "/basics",
        "url": "/types/3",
    }
}

#----------------------------------------------
#-------------------VEGGIES--------------------
#----------------------------------------------

vegetable_title = {
    "text": "Choose a veggie to learn more!",
    "url": None
}

vegetables = {
    1: {
        "id": 1,
        "name": "Tomato",
        "icon": "tomato.png",
        "description_id": 1,
    },
    2: {
        "id": 2,
        "name": "Cucumber",
        "icon": "cucumber.png",
        "description_id": 1,
    },
    3: {
        "id": 3,
        "name": "Eggplant",
        "icon": "eggplant.png",
        "description_id": 1,
    },
    4: {
        "id": 4,
        "name": "Mushroom",
        "icon": "mushroom.png",
        "description_id": 2,
    },
    5: {
        "id": 5,
        "name": "Potato",
        "icon": "potato.png",
        "description_id": 3,
    },
    6: {
        "id": 6,
        "name": "Carrot",
        "icon": "carrot.png",
        "description_id": 3,
    },
}

vegetable_descriptions = {
    1: {
        "id": 1,
        "layout_type": "big_graphic",
        "title": "Tomatoes, Cucumbers, Eggplants",
        "description": "Tomatos, Cucumbers, Eggplants, and other Vegetables with large, watery cells should be salted a few minutes in advance of cooking or preparing into a salad. ",
        "main_graphic": "tomato_cucumber.gif",
        "back_url": "/vegetables",
        "url": "/vegetables/1",
    },
    2: {
        "id": 2,
        "layout_type": "big_graphic",
        "title": "Mushrooms",
        "description": "Mushrooms are 80% water, which they release when salted. To preserve their texture, then, only salt once browned in the pan. ",
        "main_graphic": "frying_mushrooms.gif",
        "back_url": "/vegetables",
        "url": "/vegetables/2",
    },
    3: {
        "id": 3,
        "layout_type": "tri_text",
        "title": "Potatoes and other Veggies",
        "area_1": {"description": "Potatoes and most other veggies contain pectin, and can be softened by breaking that pectin down. This happens when heated, and is aided by salt. ", "icons": ["potato.png","carrot.png"]},
        "area_2": {"description": "When cooked in water, veggies should be treated like anything else cooked in water. ", "icons": ["boiling_pot.png"]},
        "area_3": {"description": "When fried or cooked in any other way, most veggies should be salted at any time before cooking. When in doubt, salt ahead!", "icons": ["oven.png","frying_pan.png"]},
        "back_url": "/vegetables",
        "url": "/vegetables/3",
    }
}

#----------------------------------------------
#---------------------MEAT---------------------
#----------------------------------------------

meat_techniques_title = {
    "text": "Choose a type of meat to learn more!",
    # "text": "Learn meat cooking techniques here, then return to learn more about the items below!",
    # "url": "/meat/5"
    "url": None
}

meat_types = {
    1: {
        "id": 1,
        "name": "Beef",
        "icon": "beef.png",
        "description_id": 1,
    },
    2: {
        "id": 2,
        "name": "Chicken",
        "icon": "chicken.png",
        "description_id": 2,
    },
    3: {
        "id": 3,
        "name": "Seafood",
        "icon": "shrimp.png",
        "description_id": 3,
    },
    4: {
        "id": 4,
        "name": "Fish",
        "icon": "fish.png",
        "description_id": 4,
    }
}

meat_descriptions = {
    1: {
        "id": 1,
        "layout_type": "big_graphic",
        "title": "Beef, Pork and Lamb",
        "description": "Beef, Pork and Lamb benefits from early salting. A few hours before cooking is ideal for most cuts. Generally, the larger a cut, the longer in advance you should salt. It makes a real difference!",
        "icon": "beef.png",
        "main_graphic": "steak.gif",
        "back_url": "/meat",
        "url": "/meat/1",
    },
    2: {
        "id": 2,
        "layout_type": "big_graphic",
        "title": "Chicken",
        "description": "Chicken benefits from early salting. If you can, the earlier the better. A day in advance is generally best, or up to three days for whole chicken.",
        "main_graphic": "chicken.gif",
        "back_url": "/meat",
        "url": "/meat/2",
    },
    3: {
        "id": 3,
        "layout_type": "big_graphic",
        "title": "Seafood",
        "description": "Unlike meat and most fish, seafood is degraded by early salting. Make sure to only salt right before cooking.",
        "main_graphic": "shrimp.gif",
        "back_url": "/meat",
        "url": "/meat/3",
    },
    4: {
        "id": 4,
        "layout_type": "big_graphic",
        "title": "Fish",
        "description": "Fish degrades when salted too early. Salt most fish fifteen minutes or less before cooking. Thick steaks of meatier fish, like tuna, can be salted up to thirty minutes in advance.",
        "main_graphic": "fish.gif",
        "back_url": "/meat",
        "url": "/meat/4",
    },
    5: {
        "id": 5,
        "layout_type": "advancable_big_graphic",
        "title": "Salting Meat",
        "description": "salt",
        "img": "url",
        "prev_id": None,
        "next_id": 6,
        "back_url": "/meat",
        "url": "/meat/5",
    },
    6: {
        "id": 6,
        "layout_type": "advancable_big_graphic",
        "title": "Time is key!",
        "description": "salt",
        "img": "calendar.png",
        "prev_id": 5,
        "next_id": None,
        "back_url": "/meat",
        "url": "/meat/6",
    },
}

#----------------------------------------------
#---------------------QUIZ---------------------
#----------------------------------------------

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
                "target": 3
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
                "target": 1
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
    },
    5: {
            "id": 5,
            "type": "multiple_choice",
            "question": "You are preparing a beef steak with a side of mushrooms. How should you salt your two dishes "
                        "to make both dishes taste their best?",
            "answers": {
                1: "Salt the mushrooms a few hours in advance, and salt the steak only once browned in the pan.",
                2: "Salt the steak a few hours in advance, and salt the mushrooms only once browned in the pan.",
                3: "Salt the steak ten minutes in advance, and salt the mushrooms only once browned in the pan.",
                4: "Salt the mushrooms ten minutes in advance, and salt the steak only once browned in the pan.",
            },
            "correct_answer": 2
        },
}


# File paths for all PNG assets used in game.html
game_assets = {
    'background':        'kitchen_bg.png',
    'faucet':            'faucet.png',
    'pot_empty':         'pot_empty.png',
    'pot_filled':        'pot_filled.png',
    'stove':             'stove.png',
    'water_drop':        'water_drop.png',
    'salt_shaker':       'salt_shaker.png',
    'pinch_icon':        'pinch.png',
    'handful_icon':      'handful.png',
    'potato':            'potato.png',
    'tomato':            'tomato.png',
    'tomato_sliced':     'tomato_sliced.png',
    'cucumber':          'cucumber.png',
    'cucumber_sliced':   'cucumber_sliced.png',
    'cutting_board':     'cutting_board.png',
    'knife':             'knife.png',
    'bowl':              'bowl.png'
}

# Sequence of game steps; each step advances on correct drag (or prompt), resets only that step on failure
game_flow = [
    # 1. Fill pot under faucet
    {
        'action': 'drag',
        'item': 'pot_empty',       # draggable id
        'target': 'faucet',        # drop-target id
        'on_success': {
            'update_item': {'pot_empty': 'pot_filled'}
        },
        'on_fail_msg': "That's not the pot! Try again."
    },
    # 2. Heat the filled pot on stove
    {
        'action': 'drag',
        'item': 'pot_filled',
        'target': 'stove',
        'on_success': {},
        'on_fail_msg': "Drop the filled pot on the stove to heat it!"
    },
    # 3. Season boiling water
    {
        'action': 'drag',
        'item': 'salt_shaker',
        'target': 'water_drop',
        'on_success': {'prompt': 'season_water'},
        'on_fail_msg': "Drop the salt shaker into the water to season it!"
    },
    # Prompt for water salt amount
    {
        'action': 'prompt',
        'id': 'season_water',
        'question': 'How much salt would you add to the pot of boiling water?',
        'options': [
            {'id': 'pinch',  'label': '+1 Pinch',  'icon': 'pinch_icon'},
            {'id': 'handful','label': '+1 Handful','icon': 'handful_icon'}
        ],
        'correct': 'handful',
        'on_fail_msg': "Too much or too little! Try again."
    },
    # 4. Add potato to simmering water
    {
        'action': 'drag',
        'item': 'potato',
        'target': 'pot_filled',
        'on_success': {},
        'on_fail_msg': "Drop the potato into the pot to cook it!"
    },
    # 5. Bring tomato to cutting board
    {
        'action': 'drag',
        'item': 'tomato',
        'target': 'cutting_board',
        'on_success': {},
        'on_fail_msg': "Drop the tomato on the board to prep it!"
    },
    # 6. Slice tomato with knife
    {
        'action': 'drag',
        'item': 'knife',
        'target': 'cutting_board',
        'on_success': {
            'update_item': {'tomato': 'tomato_sliced'}
        },
        'on_fail_msg': "Use the knife on the tomato to slice it!"
    },
    # 7. Add sliced tomato to bowl
    {
        'action': 'drag',
        'item': 'tomato_sliced',
        'target': 'bowl',
        'on_success': {},
        'on_fail_msg': "Drop the sliced tomato into the bowl!"
    },
    # 8. Bring cucumber to cutting board
    {
        'action': 'drag',
        'item': 'cucumber',
        'target': 'cutting_board',
        'on_success': {},
        'on_fail_msg': "Drop the cucumber on the board to prep it!"
    },
    # 9. Slice cucumber with knife
    {
        'action': 'drag',
        'item': 'knife',
        'target': 'cutting_board',
        'on_success': {
            'update_item': {'cucumber': 'cucumber_sliced'}
        },
        'on_fail_msg': "Use the knife on the cucumber to slice it!"
    },
    # 10. Add sliced cucumber to bowl
    {
        'action': 'drag',
        'item': 'cucumber_sliced',
        'target': 'bowl',
        'on_success': {},
        'on_fail_msg': "Drop the sliced cucumber into the bowl!"
    },
    # 11. Season the salad
    {
        'action': 'drag',
        'item': 'salt_shaker',
        'target': 'bowl',
        'on_success': {'prompt': 'season_salad'},
        'on_fail_msg': "Drop the salt shaker into the bowl to season the salad!"
    },
    # Prompt for salad salt amount
    {
        'action': 'prompt',
        'id': 'season_salad',
        'question': 'How much salt would you add to the salad?',
        'options': [
            {'id': 'pinch',  'label': '+1 Pinch',  'icon': 'pinch_icon'},
            {'id': 'handful','label': '+1 Handful','icon': 'handful_icon'}
        ],
        'correct': 'pinch',
        'on_fail_msg': "Too much or too little! Try again."
    },
    # 12. Finalize and click Done
    {
        'action': 'click',
        'item': 'done-btn'
    }
]
