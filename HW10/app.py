from flask import Flask,jsonify


import sqlalchemy
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine,inspect,func

import datetime as dt
from datetime import datetime


'sqlite:///app.db?check_same_thread=False'
#connect to hawaii sqlite database
engine = create_engine("sqlite:///Resources/hawaii.sqlite?check_same_thread=False")
Base = automap_base()
Base.prepare(engine, reflect=True)

#Reference to classes
Station = Base.classes.station
Measurement = Base.classes.measurement

#Create a session
session = Session(engine)

app = Flask(__name__)



@app.route("/")
def root():
    return (
        f"Available Routes: <br/>"
        f"<a href = "'/api/v1.0/precipitation'">Precipitation </a><br/>"
        f"<a href = "'/api/v1.0/stations'">Stations</a><br/>"
        f"<a href = "'/api/v1.0/tobs'">Temperature observations</a><br/>"
        f"/api/v1.0/'<'start date (in yyyy-mm-dd format)'>'</code><br/>"
        f"/api/v1.0/'<'start (in yyyy-mm-dd format)'>'/'<'end (in yy-mm-dd format)'>'<br/>"
    )

@app.route("/api/v1.0/precipitation")
def prcp():

    #Latest date
    last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    last_date = last_date[0]

    #One year before last date in data base
    year_ago = dt.date(int(last_date[0:4]),int(last_date[5:7]),int(last_date[8:10])) - dt.timedelta(days = 365)

    #Query to retrieve last 12 months of precipitation data
    query12mth = session.query(Measurement.date, Measurement.prcp).\
    filter(Measurement.date > year_ago).filter(Measurement.date < last_date).order_by(Measurement.date).all()

    #Change query into dictionary
    precip_dict = dict(tuple(query12mth))
    
    #Return the jsonified dictionary 
    return jsonify(precip_dict)

@app.route("/api/v1.0/stations")
def stns():
    stations = []
    for station in session.query(Station.station).distinct():
        stations.append(station[0])
        stations
    return jsonify(stations)

@app.route("/api/v1.0/tobs")
def tempObs():
    #Latest date
    last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    last_date = last_date[0]

    #One year before last date in data base
    year_ago = dt.date(int(last_date[0:4]),int(last_date[5:7]),int(last_date[8:10])) - dt.timedelta(days = 365)

    #last 12 monts of temp observation data for station with most observations
    temp_query = session.query(Measurement.date,Measurement.tobs).\
    filter(Measurement.date >year_ago).filter(Measurement.date <last_date).\
    filter(Measurement.station == 'USC00519281').all()

    temp_dict = dict(tuple(temp_query))

    return jsonify(temp_dict)

@app.route("/api/v1.0/<start>")
def strt(start):
    #Latest date
    last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    last_date = last_date[0]

    summary_list = []

    
    #Queries get dates greater that start date
    min_query = session.query(func.min(Measurement.tobs)).\
    filter(Measurement.date >start).filter(Measurement.date <=last_date).all()

    summary_list.append(list((min_query[0]))[0])

    max_query = session.query(func.max(Measurement.tobs)).\
    filter(Measurement.date >start).filter(Measurement.date <=last_date).all()

    summary_list.append(list((max_query[0]))[0])

    avg_query = session.query(func.avg(Measurement.tobs)).\
    filter(Measurement.date >start).filter(Measurement.date <=last_date).all()

    summary_list.append(list((avg_query[0]))[0])

    summary_dict = {
        "Min Temp":summary_list[0],
        "Max Temp":summary_list[1],
        "Avg Temp":summary_list[2]
    }

    complete_dict = {
        "start_date":start,
        "temp_data":summary_dict
    }

    return(jsonify(complete_dict))

@app.route("/api/v1.0/<start>/<end>")
def strt_end(start,end):

    summary_list = []
    #Queries search for dates between start and end
    min_query = session.query(func.min(Measurement.tobs)).\
    filter(Measurement.date >start).filter(Measurement.date <=end).all()

    summary_list.append(list((min_query[0]))[0])

    max_query = session.query(func.max(Measurement.tobs)).\
    filter(Measurement.date >start).filter(Measurement.date <=end).all()

    summary_list.append(list((max_query[0]))[0])

    avg_query = session.query(func.avg(Measurement.tobs)).\
    filter(Measurement.date >start).filter(Measurement.date <=end).all()

    summary_list.append(list((avg_query[0]))[0])

    summary_dict = {
        "Min Temp":summary_list[0],
        "Max Temp":summary_list[1],
        "Avg Temp":summary_list[2]
    }

    complete_dict = {
        "start_date":start,
        "end_date":end,
        "temp_data":summary_dict
    }

    return(jsonify(complete_dict))

    
 
if __name__ == "__main__":
    # @TODO: Create your app.run statement here
    # YOUR CODE GOES HERE
    app.run(debug=True)    