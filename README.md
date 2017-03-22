# ss6-react-issues

### zur Abgabe:

##### umgesetzte Funktionen:
  + about: Infos zum User
  + repos: Repos werden angezeigt
  + issues: nach Klick auf Repo wird Repo-spezifische Issue-Page geöffnet
  + add issues: Issues können hinzugefügt werden
  + get issues: Issue-Liste wird angezeigt
  + edit issues: Issues können bearbeitet werden
  + close issues: Issues können geclosed werden

##### Probleme:
  + nach add, edit und close Issue wird die Issue-Liste nicht aktualisiert (nicht mehr neu gerendert)
  + wenn man in einem Repo Issues bearbeitet und dann über den Repo-Link zu einem neuen Repo navigiert, werden die Issues vom vorherigen Repo gezeigt
  + oft dauert das erneute fetchen der Daten ewig
