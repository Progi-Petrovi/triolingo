import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome()
driver.get("http://localhost:5173/")

time.sleep(1)

login = driver.find_element("id", "nav-link-login")
login.click()
print("Otvoren login page")
time.sleep(1)

email = driver.find_element("id", "email")
email.send_keys("ucitelj123@gmail.com")
print("Upisan email")

time.sleep(1)

password = driver.find_element("id", "password")
password.send_keys("lozinka!")
print("Upisana lozinka")

time.sleep(1)

login2 = driver.find_element("xpath", "//form/*[text()='Login']")
login2.click()
print("Ucitelj ulogiran")

time.sleep(1)

driver.find_element("id", "nav-link-lesson-requests").click()
print("Otvoren popis zahtjeva za lekciju")

time.sleep(1)

driver.find_element("xpath", "//button[text()='Accept']").click()
print("Prihvacen zahtjev za lekciju")

time.sleep(10000)
#driver.quit()