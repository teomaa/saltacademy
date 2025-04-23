from flask import Flask, render_template
from data import vegetables, vegetable_descriptions

app = Flask(__name__)

veggie_data = {
    "items": vegetables,
    "item_descriptions": vegetable_descriptions,
}

# @app.route('/')
# def hello_world():  # put application's code here
#     return 'Hello World!'

# @app.route('/')
# def hello_world():
#     return render_template('hello_world.html', data=data)

@app.route('/vegetables')
def vegetables():
    return render_template('shelved_overview.html', data=veggie_data)


@app.route('/vegetables/<veggie_id>')
def vegetables_detail(veggie_id=None):
    veggie_id = int(veggie_id) if veggie_id.isnumeric() else None
    veggies = [x for x in veggie_data["items"].values() if x["description_id"] == veggie_id] if veggie_id is not None else []
    return render_template('learning_page.html', items=veggies, item_description=veggie_data["item_descriptions"][veggie_id])


if __name__ == '__main__':
    app.run()
