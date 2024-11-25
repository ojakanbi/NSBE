import requests # Used for making HTTP requests to scrape data from websites
from bs4 import BeautifulSoup # for scrapping the info off of websites via their html
import gspread # for google sheets
from google.oauth2.service_account import Credentials # for google cloud authentication

# selenium for automation (may not be necessary)
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# When doing request we can use request.get(url), if the output is a 200 then it was found, 404 means an error
output = requests.get("https://realpython.com/python-requests/#getting-started-with-pythons-requests-library") #would output 200 if it's found
output.text # is how we get the html text from the webpage

# beautiful soup
# soup has 3 parsers it can use: html, lxml, and html5lib. lxml is the fastest among the 3, if I dind't want speed for some reason I'd prolly go with html
# lxml and html5lib have to be pip installed
soup = (output.text, "lxml" or "html.parser" or "html5lib") #but there are a plethora of ways to parse

links = soup.find("tag") # finds the first tag put within the qutations
links = soup.find_all("tag") # finds all tags put into the parantheses, can also add classes and Ids and allat

# or
links = soup.select("tag") # finds the tags using css selectors, more powerful and flexible then the above, I can get all the ps in all dics by doing select("div p")

# when running a for loop afer using .select() we cn use things like .get(attribute), an attribute example is "href". .attrs prints all attributes of the tag.
# Attributes and content: .get(), .attrs, .name, .text, .prettify(), .strip() (for text cleanup)
# it can also use all the things like .find, .find_all, etc which have to do with traversal