from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def fill_and_publish_post(driver, title, content, categories):
    """
    Wypełnia formularz dodawania nowego wpisu w WordPressie,
    zaznacza kategorie i klika przycisk publikacji.
    """
    print("BOT: Rozpoczynanie wypełniania formularza...")

    # Krok 1: Wypełnianie tytułu
    try:
        title_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'title'))
        )
        title_field.send_keys(title)
        print("BOT: Tytuł został pomyślnie wypełniony.")
    except Exception as e:
        print(f"BOT: Krytyczny błąd - nie udało się wypełnić tytułu. Błąd: {e}")
        raise e

    # Krok 2: Wypełnianie treści w edytorze TinyMCE
    try:
        # Poczekaj na ramkę edytora i przełącz się na nią
        WebDriverWait(driver, 10).until(
            EC.frame_to_be_available_and_switch_to_it((By.ID, 'content_ifr'))
        )
        # Znajdź edytor i wpisz treść
        editor_body = driver.find_element(By.ID, 'tinymce')
        editor_body.send_keys(content)
        # Wróć do głównego kontekstu strony
        driver.switch_to.default_content()
        print("BOT: Treść została pomyślnie wprowadzona.")
    except Exception as e:
        print(f"BOT: Krytyczny błąd podczas wpisywania treści. Błąd: {e}")
        driver.switch_to.default_content() 
        raise e

    # Krok 3: Zaznaczanie kategorii (jeśli istnieją)
    if categories and isinstance(categories, list):
        print("BOT: Rozpoczynanie zaznaczania kategorii...")
        for category_id in categories:
            try:
                xpath_selector = f"//input[@type='checkbox' and @value='{str(category_id)}']"
                
                category_checkbox = WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.XPATH, xpath_selector))
                )
                driver.execute_script("arguments[0].click();", category_checkbox)
                print(f"BOT: Zaznaczono kategorię o ID: {category_id}")
            except Exception as cat_e:
                print(f"BOT: Ostrzeżenie - nie udało się zaznaczyć kategorii o ID '{category_id}'. Błąd: {cat_e}")

    print("BOT: Pola formularza zostały wypełnione.")

    # Krok 4: Publikacja wpisu
    print("BOT: Przewijanie strony na górę przed publikacją...")
    driver.execute_script("window.scrollTo(0, 0);")

    print("BOT: Próba kliknięcia przycisku 'Opublikuj'...")
    try:
        publish_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "publish"))
        )
        driver.execute_script("arguments[0].click();", publish_button)
        print("BOT: Przycisk 'Opublikuj' został pomyślnie kliknięty.")
    except Exception as click_e:
        print(f"BOT: Krytyczny błąd - nie udało się kliknąć przycisku 'Opublikuj'. Błąd: {click_e}")
        raise click_e

    # Krok 5: Weryfikacja publikacji i pobranie URL
    try:
        success_link_element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div#message.updated a"))
        )
        post_url = success_link_element.get_attribute('href')
        print(f"BOT: Wpis został pomyślnie opublikowany. URL: {post_url}")
        return post_url
    except TimeoutException:
        print("BOT: Błąd krytyczny - nie pojawił się komunikat potwierdzający publikację w oczekiwanym czasie.")
        raise Exception("Nie udało się potwierdzić publikacji wpisu.")

