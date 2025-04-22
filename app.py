from flask import Flask, render_template

app = Flask(__name__)

data = [
    {
        "id": 1,
        "msg": "hello"
    },
    {
        "id": 2,
        "msg": "hi"
    },
]

# @app.route('/')
# def hello_world():  # put application's code here
#     return 'Hello World!'

@app.route('/')
def hello_world():
    return render_template('hello_world.html', data=data)


if __name__ == '__main__':
    app.run()
