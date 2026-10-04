# Tasniem Move

Begeleide 7-minuten workouts met lichaamsgewicht voor conditie en spierkracht. Statische, installeerbare PWA in vanilla HTML/CSS/JS: geen account, geen build-stap, geen externe afhankelijkheden.

## Functies

- **Onboarding**: hoofddoel (conditie, spierkracht, gebalanceerd), niveau (beginner, gemiddeld, gevorderd) en low impact. Later aan te passen via Instellingen.
- **Vandaag**: één aanbevolen workout op basis van je doel, met duur, focus, niveau, uitrusting en aantal oefeningen. Weekvoortgang, reeks en recente workouts.
- **Workouts**: Full Body 7, Cardio 7, Strength 7 en de rustige herstelsessie Herstel 6.
- **Begeleide workoutmodus**: voorbereiding, werk en rust met eigen kleur en label, grote timer, instructie per oefening en preview van de volgende. Pauze, hervat, vorige, volgende en stop. Low impact is tijdens de workout om te schakelen.
- **Timer op tijdstempels**: blijft kloppen als de tab op de achtergrond staat of gethrottled wordt.
- **Signalen**: geluid (Web Audio), trillen en Wake Lock waar de browser dat ondersteunt. Zonder werkt alles ook.
- **Voortgang**: totaal workouts en minuten, huidige en langste reeks, beste week, actieve dagen per week, mijlpalen en historie met inspanning en notitie.
- **Privacy**: alles in `localStorage` op het toestel. Back-up downloaden en terugzetten als JSON, wissen met bevestiging.
- **Offline**: service worker cachet alle lokale bestanden; werkt offline na het eerste bezoek.

Toetsen in de workoutmodus: spatie of `k` = pauze/hervat, pijltjes = vorige/volgende, Esc = stoppen.

## Lokaal starten

Een service worker werkt alleen via `http://localhost` of HTTPS, niet via `file://`.

```sh
python3 -m http.server 8766 --directory tasniem-move
```

Open daarna <http://localhost:8766/>.

## Installeren als app

- **iPhone/iPad (Safari)**: Deel → *Zet op beginscherm*.
- **Android (Chrome)**: menu → *App installeren*.
- **Desktop (Chrome/Edge)**: installatie-icoon in de adresbalk.

Installeren vereist HTTPS (of localhost).

## Structuur

| Bestand | Inhoud |
| --- | --- |
| `index.html` | Semantische opbouw van alle schermen |
| `styles.css` | Vormgeving, safe-area, reduced motion |
| `app.js` | Workoutdata, state, timer, voortgang |
| `sw.js` | Offline cache (network-first met cache-fallback) |
| `manifest.json`, `icons/` | PWA-identiteit en iconen |

## Onderhoud

- **Nieuwe release**: verhoog `VERSION` in `sw.js`. Nieuwe lokale bestanden ook toevoegen aan `ASSETS` in `sw.js`.
- **Opslag**: sleutel `tasniem-move:v1`. Onleesbare data wordt bij het laden veiliggesteld onder `tasniem-move:corrupt-backup` en de app start schoon.
- **Eigen gegevens**: de app leest, exporteert en wist uitsluitend zijn eigen `tasniem-move:`-sleutels en eigen `tasniem-move-`-caches; data van andere apps op dezelfde origin blijft onaangeroerd.
- **Paden**: alle verwijzingen zijn relatief, zodat de app ook in een submap zoals `/tasniem-move/` werkt. `.nojekyll` zorgt dat een statische host de bestanden ongewijzigd serveert.

## Veiligheid

Tasniem Move geeft geen medisch advies. Stop bij pijn, duizeligheid of benauwdheid.
