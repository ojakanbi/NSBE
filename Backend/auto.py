from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time
from datetime import datetime


dates = ['09/09/2024', '09/16/2024', '09/23/2024', '09/30/2024', '10/07/2024', 
         '10/14/2024', '10/21/2024', '10/28/2024', '11/04/2024', '11/11/2024', '11/18/2024',
         '12/02/2024', '12/09/2024', '01/27/2025', '02/03/2025', '02/10/2025', '02/17/2025', 
         '02/24/2025', '03/03/2025', '03/17/2025', '03/24/2025', '03/31/2025', '04/07/2025', '04/14/2025', '04/21/2025', '04/28/2025']

today = datetime.today()
completedDates = {
    '09/09/2024': 'Completed',
    '09/16/2024': 'Completed',
    '09/23/2024': 'Completed',
    '09/30/2024': 'Completed',
    '10/07/2024': 'Completed',
    '10/14/2024': 'Completed',
    '10/21/2024': 'Completed',
    '10/28/2024': 'Completed',
    '11/04/2024': 'Completed',
    '11/11/2024': 'Completed'
}

driver = webdriver.Chrome()

for date in dates:
    if date in completedDates:
        continue
    date_obj = datetime.strptime(date, "%m/%d/%Y")
    if date_obj >= today:
        break
    driver.get("https://www.surveymonkey.com/r/DF6R2PB")


    # membership number
    memNumber = driver.find_element(By.ID, "78279161").send_keys("467641")

    #email
    email = driver.find_element(By.ID, "78279158").send_keys("abdulkeita03@gmail.com")

    #first name
    firstName = driver.find_element(By.ID, "78279159").send_keys("Abdul")

    #last name
    lastName = driver.find_element(By.ID, "78279160").send_keys("Keita")

    #position, dropdown
    position = Select(driver.find_element(By.ID, "78279163"))
    position.select_by_visible_text("Academic Excellence Chair")

    # region
    region = driver.find_element(By.ID, "78279162_622730950_label").click()

    #chapter type
    chapType = driver.find_element(By.ID, "80489216_637809835_label").click()

    #next
    next = driver.find_element(By.XPATH, "//*[@id='patas']/main/article/section/form/div[2]/button").click()

    driver.implicitly_wait(10)  # Waits up to 5 seconds for elements to appear

    #school
    school = Select(driver.find_element(By.ID, "78279165")).select_by_visible_text("Pennsylvania State University - University Park")
    next = driver.find_element(By.XPATH, "//*[@id='patas']/main/article/section/form/div[2]/button[2]").click()
    
    #type of program
    typeProgram = driver.find_element(By.ID, '78279170_622731535_label').click()
    next = driver.find_element(By.XPATH, "//*[@id='patas']/main/article/section/form/div[2]/button[2]").click()
    
    #activity category
    category = Select(driver.find_element(By.ID, "86624520"))
    category.select_by_visible_text("Retention Program - Study Hall/Tutoring")
    next = driver.find_element(By.XPATH, "//*[@id='patas']/main/article/section/form/div[2]/button[2]").click()
    driver.implicitly_wait(10)
    
    testbank = driver.find_element(By.ID, '147433612_1088902710_label').click()
    prof = driver.find_element(By.ID, '147433840_1088903698_label').click()
    tutors = driver.find_element(By.ID, '147445134').send_keys("Penn State Engineering Academic Excellence Center")
    
    next = driver.find_element(By.XPATH, "//*[@id='patas']/main/article/section/form/div[2]/button[2]").click()
    driver.implicitly_wait(10)
    #tutors = driver.find_element(By.ID, '147445134').send_keys("Penn State Engineering Academic Excellence Center")
    
    next = driver.find_element(By.XPATH, "//*[@id='patas']/main/article/section/form/div[2]/button[2]").click()
    driver.implicitly_wait(10)

    #event title
    event = driver.find_element(By.ID, "78279193").send_keys("NSBE Study Night")

    #date
    currentDate = driver.find_element(By.ID, "78279194_622731640_DMY").send_keys(date)
    time.sleep(3)
    
    #event duration
    totalHours = driver.find_element(By.ID, "78279195_634958635").send_keys("2")
    
    #program description
    description = driver.find_element(By.ID, "78279196").send_keys("A study night where students can gather and study for various subjects with fellow engineers. They can also receive tutoring via the academic excellence center which works in tandem with the organization.")
    
    # audience
    option1 = driver.find_element(By.XPATH, '//*[@id="question-field-78279197"]/fieldset/div/div/div[7]/div/label').click() #freshman/sophomore
    option2 = driver.find_element(By.XPATH, '//*[@id="question-field-78279197"]/fieldset/div/div/div[8]/div/label').click() #junior/senior
    option2 = driver.find_element(By.XPATH, '//*[@id="question-field-78279197"]/fieldset/div/div/div[9]/div/label').click() #grad student
    
    #attendance
    attend = driver.find_element(By.ID, '78279198').send_keys("80")
    members = driver.find_element(By.ID, '78279199').send_keys("60")
    costs = driver.find_element(By.ID, '78279200').send_keys("110")
    itemList = driver.find_element(By.ID, '88229653').send_keys("12 boxes of pizza(6 cheese, 6 pepperoni), 6 bottles of soda, plates, and cups.")
    
    sponsor = driver.find_element(By.ID, '80058156_634963012_label').click()
    food = driver.find_element(By.ID, '88229788_690829342_label').click()
    foodDescription = driver.find_element(By.ID, '88229788_other').send_keys("12 boxes of pizza(6 cheese, 6 pepperoni), 6 bottles of soda.")
    eboard = driver.find_element(By.ID, '88229870').send_keys("Academic Excellence Chair, Treasuer")
    partnerChapter = driver.find_element(By.ID, '78279201_622731628_label').click()
    partnerOrg = driver.find_element(By.ID, '78279202_622731629_label').click()
    otherOrgs = driver.find_element(By.ID, '78279202_other').send_keys("Society Of Hispanic Professional Engineers (SHPE), Society of Asian Scientists and Engineers (SASE), Out in Science, Technology, Engineering, and Mathematics (oSTEM)")
    virtual = driver.find_element(By.ID, '81546286_645313342_label').click()
    #time.sleep(10)
    next = driver.find_element(By.XPATH, "//*[@id='patas']/main/article/section/form/div[2]/button[2]").click()
    #//*[@id="patas"]/main/article/section/form/div[2]/button[2]
    driver.implicitly_wait(10)
    
    ques32 = driver.find_element(By.ID, 88229957).send_keys("Make the Study Night in a place that is easily accesible for everyone between Freshman-Senior year. Have light food and refreshments so people aren't studying in on an empty stomach. Provide a comfortable environment so people can feel comfortable communicating and collaborating with other, even if they're strangers. Also provide tutors for a vast range of STEM topics to help enhance the studying experience.")
    ques33 = driver.find_element(By.ID, 88229996).send_keys("N/A")
    ques34 = driver.find_element(By.ID, '88230017_690830791_label').click()
    fileButton = driver.find_element(By.XPATH, '//*[@id="file-upload-86679153"]').click()
    
    #photo upload
    time.sleep(10)
    filepath = "C:/Users/keita/Downloads/Study_Night_Flyer.jpg"
    fileUpload = driver.find_element(By.XPATH, "//*[@id='addFileDialog']//input[@type='file']").send_keys(filepath)
    
    time.sleep(15)
    finalSubmit = driver.find_element(By.XPATH, '//*[@id="patas"]/main/article/section/form/div[2]/button[2]').click()
    time.sleep(10)
    completedDates[date] = 'Completed'