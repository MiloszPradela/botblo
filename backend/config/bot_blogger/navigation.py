from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def navigate_to_new_post_via_menu(driver):
    """
    Nawiguje do strony tworzenia nowego wpisu w dwóch krokach:
    1. Klika na główne menu "Wpisy", aby je rozwinąć.
    2. Klika na link "Dodaj wpis" w rozwiniętym podmenu.
    """
    print("BOT: Rozpoczynanie nawigacji przez menu w dwóch krokach...")
    
    try:
        # ETAP 1: Kliknięcie w główne menu "Wpisy"
        posts_menu_link = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//li[@id='menu-posts']/a[@href='edit.php']"))
        )
        print("BOT: Znaleziono główny przycisk menu 'Wpisy'.")
        
        # Klikamy, aby rozwinąć podmenu
        posts_menu_link.click()
        print("BOT: Kliknięto w menu 'Wpisy', oczekiwanie na podmenu...")

        # ETAP 2: Kliknięcie w  "Dodaj wpis"
        # Czekamy, aż pojawi się "Dodaj wpis"
        add_new_post_link = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//li[@id='menu-posts']//a[@href='post-new.php']"))
        )
        print("BOT: Znaleziono link 'Dodaj wpis' w podmenu.")
        
        # Klikamy właściwy link
        add_new_post_link.click()

        # Etap 3: Ładowanie strony tworzenia wpisu
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'title'))
        )
        print("BOT: Nawigacja przez menu do strony 'Dodaj wpis' zakończona sukcesem.")

    except TimeoutException:
        print("BOT: Błąd - nie udało się znaleźć elementu menu w określonym czasie. Sprawdź selektory lub stan strony.")
        # Zapisz zrzut ekranu, z widokiem menu
        driver.save_screenshot('menu_navigation_error.png')
        raise  # Exceptions, aby główny proces bota go obsłużył
    except Exception as e:
        print(f"BOT: Wystąpił nieoczekiwany błąd podczas nawigacji w menu: {e}")
        raise e

