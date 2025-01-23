import time
from selenium import webdriver

driver = webdriver.Chrome()
driver.get("http://localhost:5173/")

time.sleep(1)

login = driver.find_element("id", "nav-link-login")
login.click()
print("Otvoren login page")
time.sleep(1)

email = driver.find_element("id", "email")
email.send_keys("ucenik123@gmail.com")
print("Upisan email")

time.sleep(1)

password = driver.find_element("id", "password")
password.send_keys("lozinka!")
print("Upisana lozinka")

time.sleep(1)

login2 = driver.find_element("xpath", "//form/*[text()='Login']")
login2.click()
print("Korisnik ulogiran")

time.sleep(1)

driver.find_element("xpath", "//a[text()='Test']").click()
print("Otvorena stranica ucitelja")

time.sleep(1)

driver.find_element("xpath", "//a[text()='Book a lesson']").click()
print("Otvorena lista dostupnih termina za lekciju tog ucitelja")

time.sleep(1)

driver.find_element("xpath", "//button[text()='Request lesson']").click()
print("Poslan zahtjev za lekciju, test uspjesan")

time.sleep(10000)
#driver.quit()