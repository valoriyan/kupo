

from flask import Flask
import os

import faiss

##################################################
# FLASK SERVER
##################################################


app = Flask(__name__)


@app.route("/")
def home():
    return "hello world!"




if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
