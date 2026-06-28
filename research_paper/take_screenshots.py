from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--window-size=1920,1080")
# Add arguments to prevent sandbox issues if any
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    print("Opening base URL...")
    driver.get("http://127.0.0.1:3000/")
    driver.execute_script("sessionStorage.setItem('obe_session', JSON.stringify({id: 'usr-vw', name: 'Vaishali Wangikar', role: 'faculty'}));")
    driver.execute_script("sessionStorage.setItem('selected_course_id', 'crs-eda');")
    
    print("Taking CO-PO map screenshot...")
    driver.get("http://127.0.0.1:3000/faculty/co-po-map.html")
    time.sleep(3)
    driver.save_screenshot("images/copo_map.png")
    
    print("Taking Attainment screenshot...")
    driver.get("http://127.0.0.1:3000/faculty/attainment.html")
    time.sleep(3)
    driver.save_screenshot("images/attainment.png")
    
    print("Screenshots saved successfully!")
except Exception as e:
    print(f"Error: {e}")
finally:
    driver.quit()

