from flask import Flask, render_template, request
from data import vegetables, vegetable_descriptions, quiz, meat_techniques_title, meat_types, meat_descriptions, \
    vegetable_title, types_of_salt, game_assets, game_flow, measuring_techniques
from progress import ProgressTracker

app = Flask(__name__)

veggie_data = {
    "items": vegetables,
    "title": vegetable_title,
    "item_descriptions": vegetable_descriptions,
}

meat_data = {
    "items": meat_types,
    "title": meat_techniques_title,
    "item_descriptions": meat_descriptions,
}

basics_data = {
    "types": types_of_salt,
    "measurement": measuring_techniques
    # "item_descriptions": meat_descriptions,
}
# game_config = game_config

pt = ProgressTracker()

@app.route('/')
def home():
    return render_template('home.html', progress=pt.as_dict())

@app.route('/vegetables')
def vegetables():
    pt.add_step("vegetables")
    return render_template('shelved_overview.html', data=veggie_data, progress=pt.as_dict())


@app.route('/meat')
def meat():
    pt.add_step("meat")
    return render_template('shelved_overview.html', data=meat_data, progress=pt.as_dict())


@app.route('/vegetables/<veggie_id>')
def vegetables_detail(veggie_id=None):
    veggie_id = int(veggie_id) if veggie_id.isnumeric() else None
    veggies = [x for x in veggie_data["items"].values() if x["description_id"] == veggie_id] if veggie_id is not None else []
    if veggies is not None and veggies != []:
        pt.add_step(f'vegetables/{veggie_id}')
    return render_template('learning_page.html', items=veggies, item_description=veggie_data["item_descriptions"][veggie_id], progress=pt.as_dict())


@app.route('/meat/<meat_id>')
def meat_detail(meat_id=None):
    meat_id = int(meat_id) if meat_id.isnumeric() else None
    meat = [x for x in meat_data["items"].values() if x["description_id"] == meat_id] if meat_id is not None else []
    if meat is not None and meat != []:
        pt.add_step(f'meat/{meat_id}')
    return render_template('learning_page.html', items=meat, item_description=meat_data["item_descriptions"][meat_id], progress=pt.as_dict())


@app.route('/basics')
def basics_overview():
    pt.add_step('basics')
    return render_template('basics.html', progress=pt.as_dict())

@app.route('/basics/types')
def salt_types():
    # s_id = int(s_id) if s_id.isnumeric() else None
    items = [x for x in basics_data["types"].values()]
    pt.add_step('basics/types')
    return render_template('learning_page.html', items=items, item_description=items[0], progress=pt.as_dict())


@app.route('/basics/measure/<measure_id>')
def measure(measure_id=None):
    measure_id = int(measure_id) if measure_id.isnumeric() else None
    items = [x for x in basics_data["measurement"].values() if x["id"] == measure_id] if measure_id is not None else []
    if items is not None and items != []:
        pt.add_step(f'basics/measure/{measure_id}')
    return render_template('learning_page.html', items=items, item_description=items[0], progress=pt.as_dict())

# @app.route('/basics/types/<s_id>')
# def salt_types(s_id=None):
#     s_id = int(s_id) if s_id.isnumeric() else None
#     # items = [x for x in basics_data["types"].values() if x["id"] == s_id] if s_id is not None else []
#     return render_template('learning_page.html', items=None, item_description=basics_data["types"][s_id])

@app.route('/quiz')
def quiz_page():
    # Pass entire quiz dict to the template
    return render_template('quiz.html', quiz=quiz, progress=pt.as_dict())


@app.route('/search')
def search():
    q = request.args.get('q', '').strip().lower()
    results = []

    if q:
        # 1) Basics (Types of Salt)
        for entry in types_of_salt.values():
            title = entry['title']
            desc  = entry.get('description', '')
            if q in title.lower() or q in desc.lower():
                results.append({
                    'title':   title,
                    'snippet': (desc[:100] + '…') if len(desc) > 100 else desc,
                    'url':     entry['url']
                })

        # 2) Veggie detail pages
        for entry in vegetable_descriptions.values():
            title = entry['title']
            desc  = entry.get('description', '')
            if q in title.lower() or q in desc.lower():
                results.append({
                    'title':   title,
                    'snippet': (desc[:100] + '…') if len(desc) > 100 else desc,
                    'url':     entry['url']
                })

        # 3) Meat detail pages
        for entry in meat_descriptions.values():
            title = entry['title']
            desc  = entry.get('description', '')
            if q in title.lower() or q in desc.lower():
                results.append({
                    'title':   title,
                    'snippet': (desc[:100] + '…') if len(desc) > 100 else desc,
                    'url':     entry['url']
                })

    return render_template('search.html', results=results, progress=pt.as_dict())


@app.route('/game')
def game():
    return render_template(
        'game.html',
        gameAssets=game_assets,
        gameFlow=game_flow,
        progress=pt.as_dict()
    )

if __name__ == '__main__':
    app.run(debug=True, port=5001)
