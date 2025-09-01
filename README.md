# BotBlo - Aplikacja do Zarządzania Uwierzytelnianiem

## Autor

*   **Miłosz Pradela**

## Opis Projektu

BotBlo to w pełni funkcjonalna aplikacja webowa typu full-stack, zaprojektowana do obsługi kompletnego cyklu życia użytkownika. Aplikacja implementuje bezpieczną rejestrację, logowanie z użyciem tokenów JWT, wieloetapowy proces zatwierdzania kont przez administratora oraz bezpieczny mechanizm resetowania hasła.

Projekt cechuje się nowoczesną i modularną architekturą, zarówno na backendzie, jak i na frontendzie, co ułatwia jego dalszy rozwój i utrzymanie.

### Technologie

*   **Backend:**
    *   **Framework:** Flask (Python)
    *   **Baza Danych:** PostgreSQL
    *   **ORM:** SQLAlchemy
    *   **Bezpieczeństwo:** Flask-Bcrypt (hashowanie haseł), Flask-JWT-Extended (tokeny JWT)
    *   **Wysyłka e-maili:** Flask-Mail (SMTP)
    *   **Architektura:** Blueprints

*   **Frontend:**
    *   **Framework:** React z TypeScript
    *   **Narzędzia Budowania:** Vite
    *   **Routing:** React Router DOM
    *   **Komunikacja HTTP:** Axios

## Kluczowe Funkcjonalności

*   **Rejestracja Użytkownika:** Formularz rejestracji, który po przesłaniu inicjuje proces weryfikacji.
*   **Proces Zatwierdzania przez Administratora:** Nowo zarejestrowane konto jest nieaktywne do momentu, gdy administrator otrzyma powiadomienie e-mail i zatwierdzi je za pomocą unikalnego linku.
*   **Bezpieczne Logowanie:** Uwierzytelnianie na podstawie e-maila i hasła, które zwraca token JWT do autoryzacji dalszych zapytań.
*   **Kompletny Cykl Resetowania Hasła:**
    1.  Formularz "Zapomniałem hasła" do wpisania adresu e-mail.
    2.  Wysyłka e-maila z bezpiecznym, ograniczonym czasowo linkiem do resetu.
    3.  Dedykowana strona do ustawienia nowego hasła.
*   **Chronione Ścieżki (Protected Routes):** Dostęp do głównego panelu aplikacji jest możliwy tylko dla zalogowanych użytkowników.
*   **Globalny Layout:** Spójny interfejs użytkownika (nagłówek, stopka, menu boczne) dla wszystkich stron po zalogowaniu.

## Instalacja i Uruchomienie

Aby uruchomić projekt lokalnie, postępuj zgodnie z poniższymi krokami.

### Wymagania Wstępne

*   Python (wersja 3.8+)
*   Node.js i npm (wersja 16+)
*   Działający serwer PostgreSQL

### 1. Backend

1.  **Sklonuj repozytorium:**
    ```
    git clone <adres-twojego-repozytorium>
    cd <nazwa-folderu>/backend
    ```

2.  **Utwórz i aktywuj środowisko wirtualne:**
    ```
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # macOS / Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Zainstaluj zależności:**
    *   Najpierw upewnij się, że masz plik `requirements.txt`. Jeśli go nie ma, stwórz go komendą (będąc w środowisku `venv`):
        ```
        pip freeze > requirements.txt
        ```
    *   Następnie zainstaluj pakiety:
        ```
        pip install -r requirements.txt
        ```

4.  **Skonfiguruj zmienne środowiskowe:**
    *   Stwórz plik `.env` w folderze `backend`.
    *   Wypełnij go wymaganymi danymi:
        ```
        DATABASE_URL="postgresql://uzytkownik:haslo@host:port/nazwa_bazy"
        JWT_SECRET_KEY="twoj-super-tajny-klucz"
        
        MAIL_SERVER=smtp.gmail.com
        MAIL_PORT=587
        MAIL_USE_TLS=True
        MAIL_USERNAME="twoj-email@gmail.com"
        MAIL_PASSWORD="twoje-haslo-do-aplikacji-gmail"
        ADMIN_EMAIL="email-na-ktory-przychodza-powiadomienia"
        ```

5.  **Uruchom serwer backendu:**
    ```
    python app.py
    ```
    Serwer będzie działał na `http://localhost:5000`.

### 2. Frontend

1.  **Przejdź do folderu frontendu i zainstaluj zależności** (w osobnym terminalu):
    ```
    cd ../frontend
    npm install
    ```

2.  **Uruchom serwer deweloperski Vite:**
    ```
    npm run dev
    ```
    Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

## Struktura Projektu

