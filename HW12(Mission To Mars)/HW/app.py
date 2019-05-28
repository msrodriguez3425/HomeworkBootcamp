from flask import Flask, render_template, redirect,jsonify
import pymongo
from scrape_mars import scrape

app = Flask(__name__)


# Conexion a BD Mongo
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.mars_db


@app.route("/scrape")
def scraper():
    dictionary = scrape()

    db.scraped_data.drop()

    db.scraped_data.insert(dictionary)
    return redirect("/", code=302)

@app.route("/")
def index():
    
    mars_data = db.scraped_data.find()
    
    return render_template("index.html", dict=mars_data)

if __name__ == "__main__":
    app.run(debug=True)