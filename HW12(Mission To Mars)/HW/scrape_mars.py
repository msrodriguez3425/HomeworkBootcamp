from bs4 import BeautifulSoup as bs
import requests
import pymongo
import pandas as pd
import time
from splinter import Browser

def init_browser():
    executable_path = {'executable_path': 'chromedriver.exe'}
    return Browser('chrome', **executable_path, headless=False)


def scrape():

    browser = init_browser()

    #Latest News
    url = 'https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'
    browser.visit(url)
    html = browser.html
    soup = bs(html,"html.parser")
    latest_news_title = soup.find_all("ul",class_="item_list")[0].find("div",class_="content_title").a.text
    latest_news_paragraph = soup.find_all("ul",class_="item_list")[0].find("div",class_="article_teaser_body").text

    #featured image
    featured_image_url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(featured_image_url)
    browser.click_link_by_partial_text('FULL IMAGE')
    time.sleep(10)
    browser.click_link_by_partial_text("more info")
    html_image = browser.html
    soup=bs(html_image,"html.parser")
    featured_image_url = soup.find("figure",class_="lede").a["href"]
    jpl_url = "https://" + soup.find("div",class_="jpl_logo").a["href"]
    jpl_url = jpl_url[:-1]
    featured_image_url = jpl_url + featured_image_url

    #Latest weather
    mars_weather_url = "https://twitter.com/marswxreport?lang=en"
    browser.visit(mars_weather_url)
    weather_html = browser.html
    weather_soup = bs(weather_html,"html.parser")
    mars_weather = weather_soup.find("div",class_="tweet", attrs={"data-screen-name" : "MarsWxReport"})\
    .find("div",class_="js-tweet-text-container").p.text
    mars_weather  = mars_weather.split("\n")[:-1]

    #Facts table
    facts_url = "https://space-facts.com/mars/"
    # Use Panda's `read_html` to parse the url
    mars_facts = pd.read_html(facts_url)

    # clean table and create data frame with column names
    mars_df = mars_facts[0]
    mars_df.columns = ['Description','Value']

    # Create a dictionary to use latter
    #data = mars_df.to_dict(orient='records')

    # Save html code to folder Assets

    data = mars_df.to_html()
    

    #Hemispheres
    astro_geo_url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    hemispheres = ["Cerberus Hemisphere Enhanced","Schiaparelli Hemisphere Enhanced","Syrtis Major Hemisphere Enhanced","Valles Marineris Hemisphere Enhanced"]
    hem_urls = []
    for hemisphere in hemispheres:
        browser.visit(astro_geo_url)
        time.sleep(5)
        browser.click_link_by_partial_text(hemisphere)
        astro_html = bs(browser.html,"html.parser")
        hem_urls.append(astro_html.find_all("div",class_="downloads")[0].a["href"])

    scraped_dict = {
        "latest_news":latest_news_title,
        "latest_paragraph":latest_news_paragraph,
        "featured_image":featured_image_url,
        "weather":mars_weather,
        "facts":data,
        "cerberus":hem_urls[0],
        "schiaparelli":hem_urls[1],
        "syrtis":hem_urls[2],
        "valles":hem_urls[3]
    }

    return scraped_dict
