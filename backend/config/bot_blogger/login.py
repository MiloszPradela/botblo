import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def login_to_wordpress(driver, login_url, username, password):
    print(f"BOT: Próba logowania na: {login_url}")
    driver.get(login_url)
    
    try:
        # Krok 1: Wpisujemy nazwę użytkownika
        username_field = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, 'user_login'))
        )
        username_field.clear()
        for char in username:
            username_field.send_keys(char)
            time.sleep(0.05)
        print("BOT: Wpisano nazwę użytkownika.")

        # Krok 2: Wpisujemy hasło
        password_field = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, 'user_pass'))
        )
        password_field.clear()
        for char in password:
            password_field.send_keys(char)
            time.sleep(0.05)
        print("BOT: Wpisano hasło.")

        # Krok 3: Czekamy, aż przycisk będzie klikalny i go klikamy
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, 'wp-submit'))
        )
        submit_button.click()
        print("BOT: Formularz logowania został wysłany.")
        
        # Krok 4: Weryfikacja wyniku
        WebDriverWait(driver, 15).until(
            EC.any_of(
                EC.presence_of_element_located((By.ID, 'wpadminbar')),
                EC.presence_of_element_located((By.ID, 'login_error'))
            )
        )
        
        try:
            driver.find_element(By.ID, 'login_error')
            error_text = driver.find_element(By.ID, 'login_error').text
            print(f"BOT: Logowanie nieudane. Komunikat ze strony: {error_text}")
            raise Exception("Nieprawidłowa nazwa użytkownika lub hasło.")
        except:
            print("BOT: Logowanie zakończone sukcesem.")
            pass
            
    except TimeoutException:
        print("BOT: Błąd krytyczny - strona logowania nie załadowała się poprawnie lub element nie stał się klikalny w zadanym czasie.")
        raise Exception("Strona logowania nie odpowiada.")
    except Exception as e:
        raise e
