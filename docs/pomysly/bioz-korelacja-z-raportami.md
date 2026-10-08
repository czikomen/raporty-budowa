# Pomysł: korelacja obserwacji z planem BIOZ budowy

Status: **pomysł / rozeznanie** (brak implementacji)
Data: 2026-10-07

## 1. Idea

Każda budowa ma własny plan BIOZ. Jego działy dotyczą konkretnych rodzajów prac
(wykopy, prace na wysokości, substancje chemiczne, gospodarka odpadami itd.).
Chcemy:

1. **zaindeksować plan BIOZ budowy** – rozbić go na punkty i przypisać każdy do
   kategorii prac,
2. przy wpisywaniu obserwacji do raportu **skategoryzować obserwację** (ta sama
   lista kategorii),
3. system **sam znajduje właściwe punkty planu BIOZ tej budowy** i dopisuje do
   obserwacji wniosek: *„Niezgodność z pkt X planu BIOZ: …"* ze wskazaniem punktu,
4. robi to **możliwie bez AI** – AI tylko tam, gdzie reguły nie wystarczą, i nigdy
   jako autor treści wniosku.

## 1a. Czym jest BIOZ (podstawa prawna)

**BIOZ** = *bezpieczeństwo i ochrona zdrowia*. W budownictwie dotyczy dwóch dokumentów:

- **informacja BIOZ** – sporządza ją projektant jako część projektu budowlanego
  (wg mojej wiedzy art. 20 ust. 1 pkt 1b Prawa budowlanego – *do weryfikacji*),
- **plan BIOZ** (plan bezpieczeństwa i ochrony zdrowia) – art. 21a Prawa
  budowlanego; sporządza go lub zapewnia sporządzenie kierownik budowy. To jego
  dotyczy ten pomysł.

Szczegółowy zakres i formę określa **rozporządzenie Ministra Infrastruktury z
23 czerwca 2003 r. w sprawie informacji dotyczącej bezpieczeństwa i ochrony
zdrowia oraz planu bezpieczeństwa i ochrony zdrowia** (Dz.U. 2003 nr 120 poz.
1126; wg rejestru ELI obowiązujące).

**Kiedy plan jest wymagany** (art. 21a ust. 1 Prawa budowlanego): gdy w trakcie
budowy wykonywany będzie co najmniej jeden z rodzajów robót z ust. 2 *albo* roboty
mają trwać dłużej niż 30 dni roboczych i jednocześnie zatrudnionych będzie
co najmniej 20 pracowników lub pracochłonność przekroczy 500 osobodni.

**Roboty szczególnie niebezpieczne (art. 21a ust. 2 + rozporządzenie)** – to
naturalne źródło początkowej listy kategorii prac w systemie. Wg wyników
wyszukiwania obejmują m.in.: ryzyko przysypania ziemią lub upadku z wysokości
(np. wykopy o ścianach pionowych bez rozparcia głębsze niż 1,5 m, wykopy
o bezpiecznym nachyleniu głębsze niż 3,0 m, roboty z ryzykiem upadku z wysokości
ponad 5 m, rozbiórki obiektów powyżej 8 m), substancje chemiczne i czynniki
biologiczne, promieniowanie jonizujące, roboty w pobliżu linii wysokiego
napięcia lub czynnych linii komunikacyjnych, kesony, materiały wybuchowe,
montaż i demontaż ciężkich elementów prefabrykowanych.

**Uwaga o zweryfikowaniu:** pełnego tekstu rozporządzenia i ustawy nie udało się
pobrać (brak dostępu do ELI/ISAP z tego środowiska), a niektóre źródła podają
różne numery pozycji Dz.U. Przed oparciem na tym słownika kategorii i
szablonów trzeba sprawdzić **aktualny tekst jednolity** na
<https://eli.gov.pl/eli/DU/2003/1126/ogl> oraz art. 21a Prawa budowlanego.

**Konsekwencja dla projektu:** plan BIOZ nie ma sztywnej, jednolitej numeracji
(każdy wykonawca ma własny układ), więc dopasowanie opieramy na kategoriach i
indeksie punktów danej budowy (jak w sekcjach poniżej), a słownik kategorii
startowo na katalogu robót z art. 21a ust. 2 i rozporządzenia, uzupełniony o
tematy typowe dla planów (odpady, ppoż., organizacja placu budowy, rusztowania,
transport, elektryka).

## 2. Stan obecny (repo `raporty-budowa`)

Prototyp Next.js + SQLite (`lib/db.ts`, tylko tabela `users`). Raport to dziś
`{ observation, action, assignee }` trzymane w stanie komponentu
(`app/dashboard/page.tsx`). Brak pojęcia budowy, kategorii, planu BIOZ i
trwałego zapisu obserwacji. Rozbudowa wymaga więc najpierw: tabeli `sites`
(budowy), `reports`/`observations` oraz pola `category` przy obserwacji.

## 3. Kluczowa zasada: AI tylko na wejściu, nie w pętli

Sztuczna inteligencja nie jest potrzebna do tego, żeby *wskazać punkt i
zacytować wymaganie*. Cała „inteligencja" przenosi się do **jednorazowego,
zatwierdzanego przez człowieka indeksowania planu**. Potem dopasowanie to zwykłe
zapytanie do bazy.

```
[IMPORT PLANU]  jednorazowo na budowę / wersję planu
  PDF/DOCX → tekst → podział na punkty (nagłówki, numeracja)
           → przypisanie kategorii (reguły + słownik; AI opcjonalnie jako podpowiedź)
           → ZATWIERDZENIE przez BHP-owca (ekran mapowania)

[WPROWADZANIE OBSERWACJI]  za każdym razem, bez AI
  kategoria obserwacji (lista wyboru / słowa kluczowe)
           → punkty BIOZ tej budowy z tą kategorią
           → (opcjonalnie) ranking FTS5/BM25 wewnątrz kategorii
           → wniosek z szablonu + cytat wymagania z planu
```

## 4. Model danych (propozycja)

| Tabela | Najważniejsze pola |
|---|---|
| `sites` | id, nazwa, adres |
| `work_categories` | id, kod, nazwa, słowa_kluczowe (słownik globalny: wykopy, praca_na_wysokości, substancje_chemiczne, odpady, rusztowania, elektryka, transport/ruch, ppoż, …) |
| `bioz_plans` | id, site_id, wersja, plik, data_obowiązywania, status (aktywny/archiwalny) |
| `bioz_sections` | id, plan_id, numer_punktu (np. „4.2.3"), tytuł, treść, strona, kolejność |
| `bioz_section_categories` | section_id, category_id, źródło (`rule`/`manual`/`ai`), zatwierdzone (bool) |
| `observations` | id, report_id, treść, category_id, typ (neg./poz.) … |
| `observation_bioz_links` | observation_id, section_id, źródło (`auto`/`manual`), status (zaproponowane/potwierdzone/odrzucone), wniosek_tekst |

Uwagi:
- punkt może należeć do **wielu** kategorii, kategoria może mieć **wiele** punktów,
- link zapisuje też `plan_id`/wersję (żeby stary raport wskazywał stan planu z dnia kontroli),
- wniosek zapisujemy jako tekst w obserwacji (snapshot), ale trzymamy link do
  sekcji (można odświeżyć/zweryfikować po aktualizacji planu).

## 5. Warianty implementacji

### A. Indeksowanie planu BIOZ

| Wariant | Opis | AI? | Ocena |
|---|---|---|---|
| A1. Ręczne mapowanie | BHP-owiec zaznacza w UI, które punkty należą do których kategorii | brak | Najpewniejsze, ale pracochłonne przy dużych planach |
| **A2. Reguły + słownik + ręczne zatwierdzenie** (rekomendowane) | Parser dzieli plan po nagłówkach/numeracji; słownik słów kluczowych (z odmianami: „wykop/wykopów/wykopach", „wysokości", „substancj*", „odpad*") proponuje kategorie; człowiek akceptuje/poprawia | brak | Dobry kompromis; jakość rośnie z wzbogacaniem słownika |
| A3. A2 + AI jako podpowiedź | AI proponuje kategorie dla punktów, których reguły nie rozpoznały | tak, **jednorazowo na plan** | Opcjonalny dodatek; wynik zawsze zatwierdza człowiek |

Techniczne: ekstrakcja tekstu z PDF (`pdf-parse`/`pdfjs`) i DOCX (`mammoth`); skany
wymagają OCR (Tesseract – nadal bez LLM). Podział na punkty po wzorcu numeracji
(`^\d+(\.\d+)*\s`) i nagłówkach. Szablon planu BIOZ jest w praktyce dość
ustrukturyzowany (rozporządzenie określa zakres), więc heurystyki powinny działać
dobrze; plany niestandardowe → fallback do ręcznego mapowania.

### B. Kategoryzacja obserwacji

| Wariant | Opis | AI? |
|---|---|---|
| **B1. Lista wyboru (rekomendowane)** | Pole „Kategoria prac" przy obserwacji (jedno kliknięcie, ta sama lista co w A) | brak |
| B2. Podpowiedź ze słów kluczowych | Ten sam słownik co w A2 sugeruje kategorię z treści obserwacji (użytkownik potwierdza) | brak |
| B3. Klasyfikator | Lokalny model/embeddingi lub LLM | tak – tylko jeśli B1+B2 okażą się niewystarczające |

### C. Dopasowanie obserwacji → punkty BIOZ

| Wariant | Opis | AI? |
|---|---|---|
| **C1. Lookup po kategorii (rekomendowane)** | `SELECT` sekcji aktywnego planu budowy z daną kategorią | brak |
| **C2. C1 + ranking FTS5/BM25** | Gdy kategoria ma kilka punktów, SQLite FTS5 (już mamy SQLite) szereguje je po podobieństwie do treści obserwacji; użytkownik widzi top 3 i wybiera/potwierdza | brak |
| C3. Embeddingi | Wyszukiwanie semantyczne | tak (lokalne/API) – tylko gdy C2 za słabe |

### D. Generowanie wniosku

**Szablon, nie AI.** Treść wniosku składamy z danych planu:

> Stwierdzono niezgodność z pkt **{numer}** planu BIOZ ({tytuł}, wersja {wersja}):
> „{cytat wymagania z planu}". 

Cytat pochodzi 1:1 z planu (zero ryzyka halucynacji). Można mieć kilka szablonów
per kategoria/typ naruszenia. Użytkownik może wniosek edytować lub odrzucić.

### E. Przypadki brzegowe (też bez AI)

- **Brak punktu w BIOZ dla kategorii** → wniosek: „Brak zapisów w planie BIOZ dla
  tego rodzaju prac – rozważyć aktualizację planu BIOZ" (to samo w sobie wartościowa
  informacja).
- **Obserwacja pozytywna / neutralna** → nie dopisujemy niezgodności.
- **Zmiana wersji planu** → reindeks, wiadomość o punktach bez odpowiednika.
- **Wiele punktów** → lista kandydatów, wybór człowieka (C2).

## 6. Rekomendacja

Zacząć od **A2 + B1(+B2) + C2 + D**: reguły i słownik, zatwierdzanie przez
człowieka, lookup po kategorii z rankingiem FTS5, wniosek z szablonu z cytatem.
Całość działa **bez AI w trakcie pracy z raportami**. AI (A3/B3/C3) pozostaje
opcjonalnym dodatkiem na później, wyłącznie jako *podpowiedź* do zatwierdzenia.

## 7. Etapy

1. **Fundament:** budowy, trwałe raporty/obserwacje, pole kategorii, słownik kategorii.
2. **Import BIOZ:** upload PDF/DOCX, podział na punkty, ekran mapowania punktów
   na kategorie (z podpowiedziami ze słownika).
3. **Dopasowanie:** po wyborze kategorii pokazanie punktów BIOZ i wstawienie
   wniosku z szablonu; zapis `observation_bioz_links`.
4. **Jakość:** FTS5 ranking, wersjonowanie planu, raport „kategorie bez
   pokrycia w BIOZ", eksport wniosków do PDF raportu.
5. **(Opcjonalnie)** podpowiedzi AI przy imporcie / klasyfikacji.

## 8. Ryzyka i pytania otwarte

- Jakość/format planów BIOZ (skany, niestandardowa numeracja) – ile będzie
  wymagało ręcznej pracy? Warto zebrać 3–5 prawdziwych planów jako zbiór testowy.
- Kto zatwierdza mapowanie (BHP-owiec budowy? administrator?) i czy mapowanie
  można kopiować między budowami o podobnym planie?
- Pełna lista kategorii prac i ich słowników – do ustalenia z użytkownikami BHP.
- Czy wniosek ma być widoczny od razu w obserwacji, czy jako sugestia do
  zaakceptowania (rekomendacja: sugestia, bo odpowiedzialność za wniosek ponosi
  autor raportu)?
- Wymagania dot. plików (rozmiar, przechowywanie, RODO przy danych w planach).
