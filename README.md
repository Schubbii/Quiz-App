🎯 Ziel

    Jeder entwickelt auf seinem eigenen Branch, nicht auf main.

    Am Ende des Tages oder vor dem Schlafengehen:

        git pull

        Änderungen committen

        git push auf seinen Branch.

🛠 Grundvoraussetzung

    Git installieren

        Download: https://git-scm.com

        Installieren, danach Terminal/PowerShell/CMD oder Git Bash öffnen.

    Git konfigurieren
    Einmalig ausführen (Name und Mail anpassen):

    bash
    git config --global user.name "Dein Name"
    git config --global user.email "deine@email.de"



1. Repo clonen (am Anfang nur einmal)

Jeder macht nur einmal am Anfang:

bash
git clone https://github.com/username/quiz-app.git
cd quiz-app

Jetzt habt ihr den Code lokal auf dem Rechner.



2. Deinen eigenen Branch erstellen

Vor dem ersten Coding einmalig:

bash
git checkout main
git pull origin main
git checkout -b feature/<dein-name>-quiz-ui

Beispiele:

bash
git checkout -b feature/lara-quiz-ui
git checkout -b feature/tim-auth
git checkout -b feature/lena-admin

    feature/ ist nur ein Präfix.

    Danach arbeitet jeder nur auf seinem eigenen Branch, nicht auf main!



3. Änderungen machen, committen und pushen

Jeder macht das, wenn er Code schreibt:
1. Änderungen ansehen

bash
git status

    Zeigt, welche Dateien geändert wurden.

2. Änderungen „hinzufügen“

bash
git add .

    . bedeutet: alle geänderten Dateien.
    Alternativ nur eine Datei:

    bash
    git add src/renderer.js

3. Commit schreiben

bash
git commit -m "Quiz-UI: Button-Styles und Frageanzeige hinzugefügt"

    -m = Message (Kurzbeschreibung, was du geändert hast).

    Schreibe kurze, verständliche Texte, z.B.

        Kategorieauswahl implementiert

        Fragen in JSON geladen

4. Pushen auf deinen Branch

bash
git push origin feature/<dein-name>-branch

Beispiel:

bash
git push origin feature/lara-quiz-ui

Wenn dein Branch noch nicht auf GitHub existiert, wird er beim ersten push automatisch erstellt.



4. Zwischendurch: Immer pullen!

Bevor du am Tag weiterarbeitest oder vor du etwas committest, mach das:

bash
git checkout feature/<dein-name>-branch
git pull origin feature/<dein-name>-branch

Damit holst du alle Änderungen von eurem Partner auf deinen Branch herunter.



5. Wenn du mit deinem Teil fertig bist (z.B. bis Montag)

Wenn dein Feature vollständig fertig ist:

    Vergewissere dich, dass du auf deinem Branch bist:

    bash
    git branch

    Du musst was wie feature/lara-quiz-ui sehen (mit * davor).

    Nochmal sichern:

    bash
    git add .
    git commit -m "Feature: Quiz-UI fertig, alles getestet"
    git push origin feature/lara-quiz-ui

    Dann im GitHub‑Browser:

        Auf „Pull requests“ klicken.

        „Compare & pull request“ wählen.

        base: main und compare: feature/lara-quiz-ui → erstellen.

Euer Team kann dann den Code reviewen und mergen.



6. Wichtige Merkregeln

    Nicht auf main arbeiten!
    Nur deinen Branch nutzen: feature/...

    Message beim Commit immer schreiben

        „Was hast du geändert?“ kurz beschreiben.

        Kein git commit ohne -m.

    Immer pullen, bevor du beginnst

    bash
    git pull origin feature/dein-branch

    Wenn sich etwas komisch verhält oder conflict kommt, ruhig melden – dann zeigen wir gemeinsam, wie du das löst.


7. Typische Befehle im Überblick

bash
git status              # zeigt, was geändert wurde
git add .               # alle Änderungen vorbereiten
git commit -m "Text"    # mit Text committen
git push origin feature/dein-branch   # auf deinen Branch pushen
git pull origin feature/dein-branch   # von deinem Branch pullen