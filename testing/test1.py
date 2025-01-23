import time
from selenium import webdriver

driver = webdriver.Chrome()
driver.get("http://localhost:5173/")

time.sleep(2)

login = driver.find_element("id", "nav-link-login")
login.click()
print("Otvoren login page")
time.sleep(2)

email = driver.find_element("id", "email")
email.send_keys("ucenik123@gmail.com")
print("Upisan email")

time.sleep(2)

password = driver.find_element("id", "password")
password.send_keys("lozinka!")
print("Upisana lozinka")

time.sleep(2)

login2 = driver.find_element("xpath", "//form/*[text()='Login']")
login2.click()
print("Korisnik ulogiran")

time.sleep(2)

profile = driver.find_element("id", "nav-link-profile")
profile.click()
print("Otvorena stranica profila")

time.sleep(2)

change = driver.find_element("class name", "bg-inherit")
change.click()
print("Otvoren dijalog za promjenu lozinke")

time.sleep(2)

oldpass = driver.find_element("name", "oldPassword")
oldpass.send_keys("lozinka!")
print("Upisana stara lozinka ('lozinka!')")

time.sleep(2)

newpass = driver.find_element("name", "newPassword")
newpass.send_keys("lozinka!!")
print("Upisana nova lozinka ('lozinka!!')")

time.sleep(2)

confpass = driver.find_element("name", "confirmNewPassword")
confpass.send_keys("lozinka!!")
print("Potvrdena nova lozinka ('lozinka!!')")

time.sleep(5)

changepass = driver.find_element("xpath", "//form/div/*[text()='Change password']")
changepass.click()
print("Promijenjena lozinka")

time.sleep(5)

print("Korisnik vracen na stranicu profila, test uspjesan")
#driver.quit()