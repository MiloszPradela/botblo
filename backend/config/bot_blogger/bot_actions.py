from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from config.extensions import db
from config.models import PublishedPost
from .login import login_to_wordpress
from .navigation import navigate_to_new_post_via_menu
from .post_creator import fill_and_publish_post

def run_bot_to_publish_post(site, post_data):
    driver = None
    try:
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920,1080')
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

        # Logowanie typu danych prosto z bazy
        print(f"BOT-CORE-DEBUG: Typ hasła z bazy: {type(site.password)}")
        
        raw_password = site.password
        if isinstance(raw_password, memoryview):
            password_for_wp = raw_password.tobytes().decode('utf-8', 'replace')
        elif isinstance(raw_password, bytes):
            password_for_wp = raw_password.decode('utf-8', 'replace')
        else:
            password_for_wp = str(raw_password)

        print(f"BOT-CORE: Próba logowania z hasłem (po konwersji): '{password_for_wp}'")        
        login_to_wordpress(driver, site.url, site.username, password_for_wp)
        navigate_to_new_post_via_menu(driver)

        title = post_data.get('title', '')
        content = post_data.get('content', '')
        categories = post_data.get('categories', [])
        
        published_post_url = fill_and_publish_post(
            driver,
            title=title,
            content=content,
            categories=categories
        )

        if published_post_url:
            new_published_post = PublishedPost(
                title=title, domain=site.url,
                post_url=published_post_url, user_id=site.user_id
            )
            db.session.add(new_published_post)
            db.session.commit()
            print("BOT-CORE: Informacje o wpisie zapisane w bazie danych.")
        
        return {"success": True, "message": "Wpis został pomyślnie opublikowany i zapisany."}

    except Exception as e:
        error_message = str(e)
        print(f"Krytyczny błąd bota: {error_message}")
        if driver:
            screenshot_path = 'error_screenshot.png'
            driver.save_screenshot(screenshot_path)
            print(f"Zrzut ekranu z błędem został zapisany w: {screenshot_path}")
        
        return {"success": False, "message": f"Błąd bota: {error_message}"}
    
    finally:
        if driver:
            driver.quit()

