# Prompt: raporty offline z potwierdzeniem wysyłki i edycją wysłanych raportów

Gotowy prompt do wklejenia w nowej sesji. Kontekst: `docs/backlog-aplikacja-mobilna.md`.

---

Pracujesz nad repozytorium `raporty-budowa` (Next.js, TypeScript, Tailwind, SQLite przez `lib/db.ts`). Obecnie raporty z kontroli budowy istnieją tylko w stanie komponentu `app/dashboard/page.tsx` (pola: `observation`, `action`, `assignee`), bez API raportów i bez zapisu w bazie. Przeczytaj `docs/backlog-aplikacja-mobilna.md`, a potem **zaprojektuj** (najpierw projekt i plan, kod dopiero po mojej akceptacji) obsługę raportów w aplikacji mobilnej działającej offline.

## Zakres

1. **Tworzenie raportu offline.** Raport utworzony bez internetu zapisuje się lokalnie (np. IndexedDB, jeśli to PWA/web mobilny; zaproponuj najlepsze rozwiązanie dla tego stosu) i trafia do kolejki ze statusem „do wysłania”.
2. **Potwierdzenie przed wysyłką.** Po odzyskaniu połączenia raport NIE jest wysyłany automatycznie. Aplikacja pokazuje ekran potwierdzenia z podsumowaniem (obserwacje, działania, osoba odpowiedzialna, data utworzenia offline) i przyciskami „Wyślij”, „Wróć do edycji”, „Zachowaj na później”. Przy wielu raportach: wysyłka pojedyncza lub zbiorcza z jednym potwierdzeniem. Odrzucony raport zostaje w kolejce.
3. **Edycja wysłanego raportu.** Wysłany raport można otworzyć, zmienić i **dopisać do niego kolejne obserwacje** (raport ma listę obserwacji). Zmiany zapisują się lokalnie (też offline), raport dostaje status „zmieniony – do synchronizacji”.
4. **Synchronizacja.** Aktualizacja idzie na ten sam raport serwerowy (bez duplikatów, idempotentnie), również po potwierdzeniu jak w pkt 2.

## Czego oczekuję w odpowiedzi

- Model danych: `Report` (id serwerowe, `localId`, `status`: `draft | pending_confirmation | synced | modified`, `updatedAt`, `observations[]` z własnym `id`/`createdAt`) i tabele SQLite.
- Maszyna stanów raportu i diagram przejść.
- Kontrakt API (tworzenie, aktualizacja, dopisanie obserwacji) z idempotencją (np. klucz `localId`).
- Strategia konfliktów, gdy raport zmieniono równolegle na serwerze lub innym urządzeniu (zaproponuj wariant i uzasadnij).
- Projekt ekranów (lista kolejki, potwierdzenie, edycja) z krótkimi szkicami.
- Przypadki brzegowe: utrata sieci w trakcie wysyłki, wielokrotne kliknięcie, edycja raportu będącego w kolejce, wylogowanie z niewysłanymi raportami.
- Plan wdrożenia w małych krokach i strategia testów.
- Lista pytań otwartych – zadaj je, zanim zaczniesz implementację.

## Ograniczenia

- Funkcja scalania raportów (`docs/projekt-scalanie-raportow.md`) jest osobna i tylko na desktopie; model danych ma jej nie blokować (obserwacje jako osobne rekordy z pochodzeniem).
- Interfejs po polsku. Nie zmieniaj istniejącego logowania.
