# IJzer — Workout & Progress Tracking

Een volledig lokale, zelfstandige workout- en progressietracker, gebouwd volgens de briefing.
Geen account, geen backend, geen tracking — alles blijft op je eigen toestel (IndexedDB).

## Lokaal starten

Browsers blokkeren IndexedDB en service workers soms bij het rechtstreeks openen van een
`.html`-bestand (`file://`). Start daarom een simpele lokale server in deze map:

```bash
cd workout-app
python3 -m http.server 8080
```

Open daarna **http://localhost:8080** in Chrome, Safari of Edge — op desktop, tablet of
smartphone (zelfde wifi-netwerk).

Alternatief zonder Python: `npx serve .` (Node.js) doet hetzelfde.

Je kan `index.html` ook rechtstreeks dubbelklikken; de kernfunctionaliteit (workouts loggen,
IndexedDB-opslag) werkt in de meeste Chromium-browsers ook dan, maar de service worker
(offline-cache/PWA-installatie) vereist een echte server of hosting over https.

## Mapstructuur

```
workout-app/
  index.html            App-shell, laadt alle scripts in volgorde
  manifest.json          PWA-manifest
  sw.js                   Service worker (offline app-shell caching)
  css/styles.css          Alle styling + dark/light theme tokens
  icons/                  App-iconen (192px, 512px, svg favicon)
  js/
    utils.js              Datum/getal-helpers, Epley 1RM-formule
    db.js                 Dunne IndexedDB-wrapper (promises)
    seed.js                Oefeningenbibliotheek, gym/kettlebell templates, standaardschema
    store.js               Business logic: instellingen, schema, sessies, records, streaks,
                            export/import — bovenop db.js en seed.js
    app-core.js             App-shell: router (hash-based), toasts, bottom sheet, navigatie
    app-onboarding.js       5-stappen onboarding
    app-dashboard.js        "Vandaag"-scherm + "Meer"-menu
    app-workout.js          Gymtraining loggen, rusttimer, 80%-versie, cardio loggen, samenvatting
    app-kettlebell.js       Kettlebell-timerscherm (rondes, gewicht, express/standaard)
    app-calendar.js         Maandkalender met status-dots + dagdetail
    app-progress.js         Statistieken, oefeningsgrafieken (Chart.js), records
    app-body.js              Lichaamsgewicht + lichaamsmaten
    app-photos.js            Voortgangsfoto's: upload, filter, vergelijken, before/after-slider
    app-settings.js          Instellingen, oefeningenbibliotheek, schema-editor, export/import
    app-boot.js              Opstartsequentie
    vendor/chart.umd.min.js  Chart.js, lokaal ingebed (geen CDN-afhankelijkheid, werkt offline)
```

## Dataopslag

- **IndexedDB** (`workoutTrackerDB`) voor alles: instellingen, schema, oefeningen, workouts,
  gelogde sessies, lichaamsgewicht, lichaamsmaten, foto's (als data-URL), records, notities en
  planningsafwijkingen (skip/verplaats).
- Niets verlaat het toestel. Er is geen netwerkverkeer nodig om de app te gebruiken.
- **Export/import** (Meer → Export & import) maakt een volledig JSON-bestand inclusief
  ingesloten foto's — bruikbaar als back-up of om over te zetten naar een ander toestel.
- Waarschuwing: browseropslag kan verloren gaan als je sitedata/cache wist. Exporteer
  regelmatig als back-up.

## Wat werkt (eerste versie)

Alle punten uit sectie 29 van de briefing zijn geïmplementeerd:
dashboard met trainingskeuze op basis van beschikbare tijd, vier gymworkouts + vier
kettlebellworkouts (standaard + express), cardiologging, sets/reps/gewicht/RIR-registratie met
vorige prestaties en persoonlijke records, workout-completion tracking, trainingskalender met
bewerken/verplaatsen/overslaan, lichaamsgewicht- en lichaamsmatentracking, progressiegrafieken
(gewicht, geschat 1RM via Epley, volume), voortgangsfoto's met filter/vergelijk/slider, volledige
lokale opslag, export/import, responsive mobiele interface, dark mode en offline-gebruik via
service worker.

## Bewuste afwijkingen / vereenvoudigingen

Om de eerste versie werkend en overzichtelijk te houden, zijn een paar punten uit de briefing
lichter geïmplementeerd dan het volledige "wensenlijstje":

- **Foto's bijsnijden/roteren** binnen de app zit er nog niet in (wel: uploaden, hoek/label/
  gewicht/notitie, filteren, twee foto's naast elkaar, before/after-slider, verwijderen). Dit
  stond niet in de minimale lijst van sectie 29.
- **Setnotities** zijn vervangen door notities op workout- en oefeningsniveau (twee van de drie
  gevraagde niveaus). Een losse notitie per set kan later toegevoegd worden als gewenst.
- **Readiness-check en automatische deload-suggestie** (sectie 13–14) zitten nog niet in deze
  versie — dit was expliciet "prioriteit 3" in de briefing. De datastructuur (sessies met
  `status`, RPE-velden) is er wel klaar voor.
- **Pincode/privacy-blur op foto's** (optioneel, sectie 28) is niet gebouwd.
- **Streak-definitie**: een eenvoudige "opeenvolgende dagen met voltooide geplande training"
  in plaats van een complexere weekgebaseerde streak — dit was niet verder gespecificeerd in de
  briefing.

Alles hierboven is bewust gekozen om een **volledig werkende, stabiele eerste versie** af te
leveren in lijn met de "Prioriteit 1 en 2"-lijst uit de briefing, zonder placeholders of
onafgewerkte knoppen. Uitbreiden is eenvoudig: elk scherm is een eigen bestand in `js/`.

## Testen

De kernflows (onboarding, gymtraining loggen inclusief rusttimer en 80%-versie, kettlebell-
timer, cardio loggen, kalender, progressiegrafieken, instellingen, oefeningenbibliotheek,
export/import) zijn end-to-end getest met een headless browser — geen consolefouten.
