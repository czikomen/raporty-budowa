# Scalanie raportów (wersja desktop)

Stan na 2026-10-30. Funkcja tylko dla aplikacji webowej na komputerze, **nie** w aplikacji mobilnej.

## Cel

Połączenie dwóch osobnych raportów z obserwacjami w jeden wspólny raport zawierający wszystkie obserwacje z obu.

## Przebieg użytkownika

1. Na liście raportów (`/dashboard`) użytkownik zaznacza dokładnie dwa raporty (checkboxy) i klika „Scal raporty”.
2. Ekran scalania pokazuje oba raporty obok siebie oraz podgląd raportu wynikowego.
3. Użytkownik wybiera raport bazowy (jego metadane – tytuł, data, osoba odpowiedzialna – przechodzą do wyniku) i może je poprawić.
4. Lista obserwacji wynikowych = obserwacje z obu raportów; użytkownik może zmienić kolejność, usunąć duplikaty (aplikacja podpowiada podobne wpisy).
5. Potwierdzenie: „Scalić raporty A i B w jeden?” → raport wynikowy powstaje, raporty źródłowe znikają z listy.

## Decyzje projektowe (propozycja)

- **Źródła nie są kasowane, tylko archiwizowane** (`mergedInto = <id raportu wynikowego>`), co umożliwia cofnięcie scalenia i zachowuje historię.
- Obserwacje zachowują informację o pochodzeniu (`sourceReportId`) i oryginalną datę utworzenia.
- Operacja jest atomowa po stronie serwera (jedna transakcja): utworzenie wyniku + oznaczenie źródeł.
- Endpoint: `POST /api/reports/merge` z `{ reportIds: [a, b], baseId, metadata }`.
- Wymaga modelu raportu z listą obserwacji (zależność od punktu 2 w `backlog-aplikacja-mobilna.md`).
- Raporty niezsynchronizowane (offline / zmienione lokalnie) nie mogą być scalane, dopóki nie zostaną wysłane.

## Do ustalenia

- Czy scalać można tylko raporty tej samej budowy/projektu i tego samego autora?
- Kto ma uprawnienia do scalania (autor, kierownik, admin)?
- Czy dozwolone jest scalanie więcej niż dwóch raportów naraz (np. po kolei, czy zbiorczo)?
- Czy cofnięcie scalenia ma być dostępne w UI i jak długo?
- Reguła dla pól kolidujących (np. dwie różne osoby odpowiedzialne): wybór bazowego, czy zachowanie per obserwacja?
