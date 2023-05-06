import csv
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Chrome()
driver.get('https://www.ted.com/talks')

while True:
    try:
        load_more_button = driver.find_element_by_xpath('//*[@class="load-more"]')
        load_more_button.click()
    except:
        break

talks = driver.find_elements_by_xpath('//*[@class="col"]')

with open('ted_talks.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['Title', 'Speaker', 'Date', 'Duration', 'Description'])
    for talk in talks:
        title = talk.find_element_by_xpath('.//*[@class="media__message"]/h4/a')
        speaker = talk.find_element_by_xpath('.//*[@class="media__message"]/h4/a[@class="ga-link"]')
        date = talk.find_element_by_xpath('.//*[@class="meta"]/span[@class="meta__item"]/text()')
        duration = talk.find_element_by_xpath('.//*[@class="thumb__duration"]/span')
        description = talk.find_element_by_xpath('.//*[@class="media__message"]/p')
        writer.writerow([title.text, speaker.text, date.text, duration.text, description.text])

driver.close()
