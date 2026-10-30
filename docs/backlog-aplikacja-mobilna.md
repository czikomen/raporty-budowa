# Backlog – aplikacja mobilna (raporty z budowy)

Zapisane wymagania do wdrożenia. Stan na 2026-10-30.

## 1. Potwierdzenie przed wysyłką raportu utworzonego offline

- Raport stworzony bez internetu trafia do lokalnej kolejki ze statusem „do wysłania”.
- Po odzyskaniu połączenia aplikacja **nie wysyła raportu automatycznie** – najpierw pokazuje użytkownikowi ekran potwierdzenia.
- Ekran potwierdzenia: podsumowanie raportu (obserwacja, działania naprawcze, osoba odpowiedzialna, data utworzenia offline) oraz przyciski „Wyślij” / „Wróć do edycji” / „Zachowaj na później”.
- Przy kilku raportach w kolejce: lista z możliwością wysłania pojedynczo lub wszystkich naraz (z jednym potwierdzeniem zbiorczym).
- Raport odrzucony przez użytkownika zostaje w kolejce, nie jest usuwany.

## 2. Edycja raportu już wysłanego + ponowna synchronizacja

- Wysłany raport można ponownie otworzyć i edytować (obserwacja, działania, osoba odpowiedzialna).
- Możliwość **dopisania kolejnych obserwacji** do istniejącego raportu (raport ma listę obserwacji, nie jedno pole).
- Edycje zapisują się lokalnie (także offline) i oznaczają raport jako „zmieniony – do synchronizacji”.
- Synchronizacja aktualizuje raport na serwerze (ten sam `id`, brak duplikatu); tu również obowiązuje potwierdzenie z pkt 1.
- Do ustalenia: obsługa konfliktu, gdy raport zmieniono równolegle na serwerze/na innym urządzeniu; historia zmian (kto, kiedy); uprawnienia do edycji cudzych raportów.

## Uwagi do implementacji

- W repo jest na razie tylko web (Next.js: `app/dashboard/page.tsx` – raporty w stanie lokalnym, brak API raportów i brak modelu danych). Warstwa mobilna/offline/synchronizacji jeszcze nie istnieje.
- Potrzebne: model `Report` z `id` serwerowym, `localId`, `status` (`draft | pending_confirmation | synced | modified`), `updatedAt`, `observations[]`; endpointy tworzenia i aktualizacji raportu.
