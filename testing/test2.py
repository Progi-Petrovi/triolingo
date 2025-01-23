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

time.sleep(2)

profile = driver.find_element("id", "nav-link-calendar")
profile.click()
print("Otvorena stranica kalendara")

time.sleep(1)

cal1 = driver.find_elements("xpath", "//*[@aria-expanded='false']")[1]
cal1.click()
print("Otvoren kalendar za pocetak lekcije")

time.sleep(1)

dan1 = driver.find_elements("xpath", "//*[text()='28']")[1]
dan1.click()
print("Postavljen datum pocetka lekcije na 28.1.2025.")

time.sleep(1)

vrijeme1 = driver.find_elements("xpath", "//*[@type='time']")[0]
vrijeme1.send_keys("1000AM")
print("Postavljeno vrijeme pocetka lekcije na 10:00")

time.sleep(1)

cal2 = driver.find_elements("xpath", "//*[@aria-expanded='false']")[2]
cal2.click()
print("Otvoren kalendar za kraj lekcije")

time.sleep(1)

dan2 = driver.find_elements("xpath", "//*[text()='28']")[1]
dan2.click()
print("Postavljen datum kraja lekcije na 28.1.2025.")

time.sleep(1)

vrijeme2 = driver.find_elements("xpath", "//*[@type='time']")[1]
vrijeme2.send_keys("1100AM")
print("Postavljeno vrijeme pocetka lekcije na 11:00")

time.sleep(1)

jeziksel = driver.find_elements("xpath", "//*[@aria-expanded='false']")[3]
jeziksel.click()
print("Otvoren selektor jezika")

time.sleep(1)

jezik = driver.find_element("xpath", "//div[contains(@class, 'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50')]")
jezik.click()
print("Odabran japanski jezik")

time.sleep(1)

driver.find_element("xpath", "//button[text()='Submit Lesson Opening']").click()
print("Objavljen termin lekcije, test uspjesan")

time.sleep(10000)
#driver.quit()