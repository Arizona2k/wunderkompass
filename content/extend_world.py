"""Append curated topics without changing existing identifiers or save keys."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / 'app/world-catalog.json').read_text())
new = []

def topic(id, category, title, intro, paragraphs, facts, more, surprise, related, sources, question, **extra):
    entry = dict(id=id, category=category, title=title, intro=intro, paragraphs=paragraphs,
                 facts=[dict(label=k, text=v) for k, v in facts], more=more, surprise=surprise,
                 related=related, sources=[dict(label=k, url=v) for k, v in sources],
                 question=dict(prompt=question[0], answers=question[1], correct=0, why=question[2]),
                 aliases=[], locations=[], links=[], **extra)
    new.append(entry)
    return entry

def animal(id, title, latin, group, habitat, continent, diet, skill, size, protection, intro,
           paragraphs, more, surprise, related, source, location, question):
    minimum, maximum, unit, measurement, size_text = size
    t = topic('animal-'+id, 'animals', title, intro, paragraphs,
              [('Tiergruppe', group), ('Lebensraum', habitat), ('Nahrung', diet),
               ('Größe', size_text), ('Besondere Fähigkeit', skill), ('Schutz', protection)],
              more, surprise, related, [source], question, image=id)
    t['aliases'] = [latin, title.split()[0]]
    t['locations'] = [dict(label=location[0], lat=location[1], lon=location[2])]
    t['animal'] = dict(group=group, habitat=habitat, continent=continent, diet=diet, skill=skill,
                      size=dict(min=minimum, max=maximum, unit=unit, measurement_de=measurement, text_de=size_text),
                      protection=dict(text_de=protection, scope='explained_on_card', checked_at='2026-10-09'))
    t['sourceNote'] = 'Größen sind typische Bereiche mit genannter Messrichtung, keine Rekordmaße. Schutzangaben geprüft am 9. Oktober 2026; regionale und weltweite Bewertungen unterscheiden sich.'
    t['links'] = [dict(label='Lebensräume erforschen', mode='journeys', id='nature')]

animal('whale-shark', 'Walhai', 'Rhincodon typus', 'Fische', 'Ozean', 'Mehrere Kontinente',
       'Kleine Tiere im Plankton', 'Nahrung aus Wasser filtern',
       (5.5, 10, 'm', 'Typische Körperlänge', 'Oft etwa 5,5–10 Meter lang; einzelne Tiere werden größer.'),
       'Weltweit stark gefährdet. Sichere Meeresgebiete und Abstand zu Booten helfen.',
       'Der größte lebende Fisch schwimmt in warmen Meeren. Er ist ein Hai und kein Wal.',
       ['Mit Kiemen nimmt er Sauerstoff aus dem Wasser auf. Er sammelt winzige Nahrungsteilchen mit seinem großen Maul.',
        'Sein helles Fleckenmuster hilft Forschenden, einzelne Walhaie wiederzuerkennen.'],
       ['Plankton bedeutet: kleine Lebewesen, die im Wasser treiben. Ein großes Tier kann von sehr kleiner Nahrung leben.',
        'Netze und Zusammenstöße mit Booten bedrohen Walhaie. Beim Beobachten nicht berühren oder verfolgen.'],
       'Ein Blauwal ist ein Säugetier. Ein Walhai ist trotz seines Namens ein Fisch.',
       ['animal-blue-whale', 'science-foodweb', 'science-currents'],
       ('Georgia Aquarium · Walhai', 'https://www.georgiaaquarium.org/animal/whale-shark/'),
       ('Bucht von La Paz, Mexiko – Beispielregion', 24.2, -110.3),
       ('Warum ist der Walhai ein Fisch?', ['Er atmet mit Kiemen.', 'Er säugt seine Jungen.', 'Er besitzt Federn.'], 'Kiemen nehmen Sauerstoff aus Wasser auf. Wale brauchen dagegen Luft.'))

animal('garden-cross-spider', 'Gartenkreuzspinne', 'Araneus diadematus', 'Spinnentiere', 'Wiesen und Gärten', 'Europa',
       'Insekten', 'Ein Radnetz aus Seide bauen',
       (9, 18, 'mm', 'Körperlänge ohne Beine', 'Größere Tiere sind etwa 9–18 Millimeter lang; die Beine zählen nicht mit.'),
       'In vielen Gegenden häufig. Vielfältige Gärten bieten Nahrung und Verstecke.',
       'Du kannst sie auch in unserer Nähe entdecken. Helle Flecken auf dem Rücken bilden oft ein Kreuz.',
       ['Spinnen haben acht Beine. Insekten haben sechs. Die Kreuzspinne gehört deshalb nicht zu den Insekten.',
        'Bewegt sich ein Insekt im Netz, spürt die Spinne die Erschütterung der Fäden.'],
       ['Netzfäden übernehmen unterschiedliche Aufgaben: Manche tragen das Netz, andere helfen beim Fangen.',
        'Beobachte Netze, ohne sie zu zerstören. Heimische Pflanzen und weniger Spritzmittel helfen kleinen Tieren im Garten.'],
       'Spinnenseide entsteht im Körper und wird durch kleine Spinnwarzen abgegeben.',
       ['animal-honey-bee', 'science-foodweb'],
       ('The Wildlife Trusts · Garden spider', 'https://www.wildlifetrusts.org/wildlife-explorer/invertebrates/spiders/garden-spider'),
       ('Mitteleuropa – Beispielregion', 51, 10),
       ('Woran unterscheidest du eine Spinne von einem Insekt?', ['Spinnen haben acht Beine.', 'Spinnen haben immer Flügel.', 'Spinnen haben sechs Beine.'], 'Acht Beine gehören zu den Spinnentieren; Insekten besitzen sechs.'))

animal('dromedary', 'Dromedar', 'Camelus dromedarius', 'Säugetiere', 'Wüste', 'Afrika und Asien',
       'Gräser und andere Pflanzen', 'Mit Trockenheit umgehen',
       (1.8, 2, 'm', 'Schulterhöhe erwachsener Männchen', 'Erwachsene Männchen sind an der Schulter etwa 1,8–2 Meter hoch.'),
       'Dromedare werden überwiegend als Haustiere gehalten. Gute Versorgung und genügend Wasser sind wichtig.',
       'Ein Dromedar besitzt einen Höcker. Menschen halten es in trockenen Regionen Afrikas und Asiens.',
       ['Im Höcker steckt Fett als Energievorrat. Er ist kein Wassertank.',
        'Breite, gepolsterte Füße helfen auf Sand. Lange Wimpern schützen die Augen vor Staub.'],
       ['Haustier heißt: Menschen züchten und versorgen diese Tiere seit vielen Generationen. Verwilderte Dromedare leben auch in Australien.',
        'Auch ein gut an Trockenheit angepasstes Tier braucht Wasser. Ein Foto eines Jungtiers zeigt noch nicht die Größe eines ausgewachsenen Dromedars.'],
       'Das Trampeltier ist eine andere Kamelart mit zwei Höckern.',
       ['science-energy', 'animal-african-savanna-elephant'],
       ('Animal Diversity Web · Dromedar', 'https://animaldiversity.org/accounts/Camelus_dromedarius/'),
       ('Südmarokko – Beispiel für Haltung', 30.9, -4.3),
       ('Was speichert ein Dromedar im Höcker?', ['Fett als Energievorrat', 'Einen Tank voller Trinkwasser', 'Sand zur Kühlung'], 'Der Höcker enthält Fett. Dromedare sparen Wasser auf andere Weise.'))

animal('white-tailed-eagle', 'Seeadler', 'Haliaeetus albicilla', 'Vögel', 'Küsten und Seen', 'Europa und Asien',
       'Fische, Vögel und auch tote Tiere', 'Mit breiten Flügeln gleiten',
       (2, 2.4, 'm', 'Spannweite ausgebreiteter Flügel', 'Die Flügel erreichen etwa 2–2,4 Meter Spannweite.'),
       'Schutz hat vielen Beständen geholfen. Ungestörte Brutplätze bleiben wichtig.',
       'Dieser große Greifvogel lebt oft an Gewässern. Erwachsene Tiere haben einen weißen Schwanz.',
       ['Breite Flügel tragen ihn beim Gleiten. Er sucht nach Nahrung an Seen, Flüssen und Küsten.',
        'Junge Seeadler sehen dunkler aus. Das weiße Schwanzgefieder entwickelt sich später.'],
       ['Spannweite misst von einer Flügelspitze zur anderen. Sie ist etwas anderes als Körperlänge oder Körperhöhe.',
        'Beobachte Brutplätze nur aus großer Entfernung. Schutzgebiete und die Verringerung von Umweltgiften haben zur Erholung beigetragen.'],
       'Gleiten spart Flügelschläge. Aufsteigende Luft kann einem großen Vogel beim Höhengewinn helfen.',
       ['science-flight', 'science-foodweb', 'animal-emperor-penguin'],
       ('RSPB · Große Greifvögel', 'https://www.rspb.org.uk/birds-and-wildlife/birds-of-the-month/august-birds-of-the-month'),
       ('Nordostdeutsche Seen – Beispielregion', 53.5, 13.3),
       ('Was bedeutet eine Spannweite von zwei Metern?', ['Der Abstand zwischen den ausgebreiteten Flügelspitzen.', 'Die Höhe des Vogels im Stehen.', 'Die Länge eines einzelnen Schwanzfeder.'], 'Spannweite wird von Flügelspitze zu Flügelspitze gemessen.'))

def history(id, title, intro, year, date, era, paragraphs, facts, more, surprise, related, sources, location, question):
    t = topic('history-'+id, 'history', title, intro, paragraphs, facts, more, surprise, related, sources, question,
              history=dict(year=year, date=date, era=era, sensitive=False))
    t['locations'] = [dict(label=location[0], lat=location[1], lon=location[2])]
    t['sourceNote'] = 'Der Zeitanker ordnet das Thema ein. Er ist weder ein genauer Beginn noch ein Ende einer ganzen Kultur. Heutige Küsten auf der Karte zeigen keine historischen Grenzen.'
    return t

history('maya', 'Die Maya: Wissen gestern und heute', 'Die Geschichte der Maya gehört zu Amerika. Maya-Sprachen und Gemeinschaften gibt es bis heute.',
        250, 'Klassische Zeit: ungefähr 250–900 n. Chr.', 'Frühe Kulturen',
        ['In Städten wie Tikal bauten Menschen Tempel und Plätze. Sie schrieben mit eigenen Schriftzeichen und beobachteten den Himmel.',
         'Die Maya entwickelten genaue Kalender und verwendeten die Null in ihrem Zahlensystem. Ihre Geschichte beginnt lange vor diesem Zeitanker.'],
        [('Wo?', 'Teile des heutigen Mexiko und Mittelamerikas.'), ('Zeitanker', '250 steht hier für den Beginn der klassischen Zeit.'), ('Heute', 'Maya-Gemeinschaften pflegen ihre Sprachen und ihr Wissen.')],
        ['Ein Kalender hilft, Tage und wiederkehrende Ereignisse zu ordnen. Verschiedene Kalender können verschiedene Aufgaben erfüllen.',
         'Alte Städte sind archäologische Quellen. Für das Leben der Maya heute hören wir auch den Menschen selbst zu.'],
        'Maya-Kultur ist keine verschwundene Kultur, die nur in einem Museum lebt.',
        ['history-zero', 'history-writing', 'science-solar-system'],
        [('Smithsonian · Living Maya Time', 'https://americanindian.si.edu/nk360/resources/Living-Maya-Time/'), ('Smithsonian · Klassische Zeit', 'https://americanindian.si.edu/collections-search/object/NMAI_176567')],
        ('Tikal im heutigen Guatemala', 17.22, -89.62),
        ('Welche Aussage über die Maya stimmt?', ['Maya-Gemeinschaften und Sprachen gibt es heute.', 'Die Maya lebten nur in Europa.', 'Alle Maya verschwanden im Jahr 900.'], 'Ein Zeitabschnitt endet, aber Menschen und ihre Kulturen verschwinden deshalb nicht einfach.'))

history('polynesia', 'Über den Pazifik ohne GPS', 'Polynesische Seefahrerinnen und Seefahrer nutzten genaue Naturbeobachtung für weite Reisen.',
        1000, 'Über viele Jahrhunderte · Zeitanker um 1000', 'Forschungsreisen',
        ['Sterne, Sonne und gleichmäßige Wellen helfen bei der Orientierung. Dieses Wissen wurde über Generationen gelernt und weitergegeben.',
         'Doppelrumpfkanus konnten Menschen und Vorräte über große Entfernungen tragen. Verschiedene Inselgruppen wurden zu unterschiedlichen Zeiten besiedelt.'],
        [('Meer', 'Pazifik'), ('Hilfsmittel', 'Sternrichtungen, Wellen und genaue Beobachtung.'), ('Zeitanker', '1000 ist ein ungefährer Orientierungspunkt, kein einzelnes Reisedatum.')],
        ['Ein Stern bleibt nicht die ganze Nacht an derselben Stelle. Erfahrene Navigatoren wechseln deshalb den Orientierungspunkt.',
         'Traditionelle Navigation wird auch heute gelehrt. Europäische Ankünfte waren nicht der Beginn der Geschichte dieser Inseln.'],
        'Eine Landkarte kann auch als Wissen im Kopf und in Erzählungen weitergegeben werden.',
        ['history-compass', 'science-gps', 'science-currents'],
        [('Te Ara · Traditionelle Navigation', 'https://teara.govt.nz/en/canoe-navigation/page-2')],
        ('Samoa – eine Inselgruppe Polynesiens', -13.8, -171.75),
        ('Was half bei der traditionellen Navigation?', ['Sterne und Meereswellen beobachten', 'Nur auf Zufall vertrauen', 'Ein Smartphone benutzen'], 'Die Orientierung beruhte auf sorgfältig gelerntem Wissen über Himmel und Meer.'))

history('timbuktu', 'Timbuktu: eine Stadt des Wissens', 'In Westafrika trafen Handel, Bücher und gelehrte Menschen aufeinander.',
        1500, 'Besonders bedeutend im 15. und 16. Jahrhundert', 'Frühe Neuzeit',
        ['Timbuktu liegt im heutigen Mali. Reisende brachten Waren, Nachrichten und Wissen über Handelswege dorthin.',
         'In Schulen und an religiösen Lernorten wurden Texte gelesen und besprochen. Handschriften bewahrten Wissen.'],
        [('Ort', 'Mali in Westafrika.'), ('Zeitanker', 'Um 1500: eine wichtige Zeit der Gelehrsamkeit.'), ('Bauweise', 'Berühmte Moscheen wurden mit Erde und traditionellen Handwerkstechniken gebaut.')],
        ['Eine Handschrift wird von Hand geschrieben. Kopieren und Bewahren brauchten viel Arbeit und sorgfältige Aufbewahrung.',
         'Wissen entwickelte sich gleichzeitig an vielen Orten der Welt. Handelswege waren auch Wege für Ideen.'],
        'Alte Gebäude aus Erde bleiben erhalten, wenn Menschen sie regelmäßig pflegen und reparieren.',
        ['history-paper', 'person-al_khwarizmi', 'history-printing'],
        [('UNESCO · Timbuktu', 'https://whc.unesco.org/en/list/119/')],
        ('Timbuktu, Mali', 16.77, -3),
        ('Warum ist Timbuktu für die Wissensgeschichte wichtig?', ['Die Stadt war ein Zentrum des Lernens und Handels.', 'Hier begann die erste Mondreise.', 'Dort gab es nie Bücher.'], 'Handel, Handschriften und gelehrte Menschen verbanden unterschiedliche Orte.'))

history('greece', 'Fragen stellen im alten Griechenland', 'Menschen beschäftigten sich mit Mathematik, Theater, Kunst und politischen Regeln.',
        -450, 'Klassische Zeit · Zeitanker um 450 v. Chr.', 'Antike',
        ['Griechenland bestand aus vielen Stadtstaaten mit unterschiedlichen Regeln. Athen und Sparta waren zwei davon.',
         'In Athen durften männliche Bürger über manche Entscheidungen abstimmen. Frauen, versklavte Menschen und viele andere waren ausgeschlossen.'],
        [('Epoche', 'Antike'), ('Beispiele', 'Theater, Geometrie und politische Diskussionen.'), ('Genau hinschauen', 'Die damalige Demokratie gab nicht allen Menschen gleiche Rechte.')],
        ['Eine Frage kann zu einer Untersuchung führen: Was beobachten wir? Welche Erklärung passt dazu? Auch andere Kulturen entwickelten solche Wege des Denkens.',
         'Unsere heutigen Vorstellungen von gleichen Rechten gehen über die eingeschränkte Mitbestimmung im antiken Athen hinaus.'],
        'Ein Stadtstaat war eine Stadt mit einem eigenen politischen Gebiet und eigenen Regeln.',
        ['history-rome', 'science-shadows', 'history-zero'],
        [('Metropolitan Museum · Klassisches Griechenland', 'https://www.metmuseum.org/essays/the-art-of-classical-greece-ca-480-323-b-c')],
        ('Athen im heutigen Griechenland', 37.98, 23.73),
        ('Durften im antiken Athen alle Menschen mitbestimmen?', ['Nein, viele Menschen waren ausgeschlossen.', 'Ja, alle Kinder und Erwachsenen.', 'Nur Besucher aus anderen Ländern.'], 'Die politische Mitbestimmung war auf einen Teil der Bevölkerung begrenzt.'))

history('rome', 'Römische Straßen und Wasserwege', 'Ein großes Reich verband Orte durch Straßen, Handel und gemeinsame Verwaltung.',
        -27, 'Beginn der Kaiserzeit: 27 v. Chr.', 'Antike',
        ['Das Römische Reich umfasste zeitweise Gebiete in Europa, Nordafrika und Westasien. Seine Grenzen veränderten sich.',
         'Straßen verbanden Städte. Aquädukte führten Wasser mit leichtem Gefälle zu Siedlungen.'],
        [('Zeitanker', '27 v. Chr.: Beginn der Kaiserzeit unter Augustus.'), ('Technik', 'Straßen, Wasserleitungen, Bögen und Gewölbe.'), ('Zusammenleben', 'Eroberung und Versklavung waren ebenfalls Teil dieser Geschichte.')],
        ['Ein Aquädukt ist eine Wasserleitung. Nicht jeder Abschnitt ist eine hohe Brücke; vieles verläuft nahe am Boden oder durch Tunnel.',
         'Große Bauwerke erzählen auch von harter Arbeit und ungleichen Rechten. Technische Leistungen machen diese Ungerechtigkeiten nicht richtig.'],
        'Ein Steinbogen verteilt Gewicht seitlich zu seinen Stützen. Dies kannst du bei den Bauwerken untersuchen.',
        ['building-colosseum', 'history-greece', 'building-golden-gate-bridge'],
        [('Metropolitan Museum · Römisches Reich', 'https://www.metmuseum.org/essays/the-roman-empire-27-b-c-393-a-d')],
        ('Rom im heutigen Italien', 41.9, 12.49),
        ('Wozu diente ein Aquädukt?', ['Wasser zu Siedlungen leiten', 'Elektrische Nachrichten senden', 'Raketen starten'], 'Wasser floss durch eine Leitung mit leichtem Gefälle.'))

def science(id, title, intro, paragraphs, facts, more, surprise, related, sources, question):
    t = topic('science-'+id, 'science', title, intro, paragraphs, facts, more, surprise, related, sources, question, model=id)
    t['sourceNote'] = 'Fachlich geprüft am 9. Oktober 2026. Die Interaktion vereinfacht den Sachverhalt. Ihre Grenzen stehen direkt am Modell; sie ist keine Messung oder Vorhersage.'
    return t

science('atmosphere', 'Die Lufthülle der Erde', 'Unsere Atmosphäre wird nach dem Temperaturverlauf in fünf große Schichten eingeteilt.',
        ['Nahe am Boden ist die Luft am dichtesten. In der Troposphäre entstehen die meisten Wolken und unser Wetter.',
         'Weiter oben ändern sich Temperatur und Dichte. Die Übergänge sind keine festen Decken.'],
        [('Troposphäre', 'Hier findet das meiste Wetter statt.'), ('Stratosphäre', 'Sie enthält den größten Teil der schützenden Ozonschicht.'), ('Ganz außen', 'Die Exosphäre geht allmählich in den Weltraum über.')],
        ['Ozon nimmt einen Teil der schädlichen ultravioletten Strahlung auf. Die Ozonschicht ist nicht dasselbe wie die ganze Atmosphäre.',
         'Die Ionosphäre überlappt mehrere Schichten. Andere Einteilungen betrachten andere Eigenschaften der Luft.'],
        'Luft wird nach oben immer dünner, aber es gibt keine scharfe Kante zum Weltraum.',
        ['science-magnetism', 'invention-satellite'],
        [('NASA · Atmosphärenschichten', 'https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/'), ('UCAR · Schichten der Atmosphäre', 'https://scied.ucar.edu/learning-zone/atmosphere/layers-earths-atmosphere')],
        ('In welcher Schicht entsteht das meiste Wetter?', ['Troposphäre', 'Exosphäre', 'Innerer Erdkern'], 'Die Troposphäre ist die unterste Luftschicht. Dort befinden sich die meisten Wolken.'))

science('magnetism', 'Die Erde und ihr Magnetfeld', 'Ein unsichtbares Feld wirkt auf Kompassnadeln und viele geladene Teilchen.',
        ['Bewegungen von leitfähigem, flüssigem Metall im äußeren Erdkern tragen zur Entstehung des Magnetfelds bei.',
         'Der Sonnenwind besteht aus geladenen Teilchen. Das Erdmagnetfeld lenkt viele davon um. Es ist keine feste Schutzwand.'],
        [('Ursprung', 'Bewegungen im flüssigen äußeren Kern.'), ('Im Alltag', 'Ein Kompass richtet sich ungefähr nach dem Magnetfeld aus.'), ('Zusätzlicher Schutz', 'Auch die Atmosphäre ist wichtig.')],
        ['Das Feld ist im Weltraum auf der Sonnenseite zusammengedrückt und auf der anderen Seite lang ausgezogen.',
         'Einige Teilchen gelangen in polnahe Gebiete. Dort können sie Leuchterscheinungen auslösen: Polarlichter.'],
        'Im Inneren der Erde steckt kein riesiger Stabmagnet.',
        ['invention-compass', 'science-atmosphere'],
        [('NASA · Magnetosphäre', 'https://science.nasa.gov/heliophysics/focus-areas/magnetosphere-ionosphere/')],
        ('Wo entsteht das Erdmagnetfeld hauptsächlich?', ['Im bewegten flüssigen äußeren Kern', 'In einem eingebauten Stabmagneten', 'In den Wolken'], 'Bewegtes leitfähiges Metall im äußeren Kern erzeugt elektrische Ströme und trägt zum Magnetfeld bei.'))

science('currents', 'Warum bewegt sich Meerwasser?', 'Wind und Dichteunterschiede treiben Meeresströmungen an.',
        ['Wind schiebt Oberflächenwasser an. Erdrotation und Küsten beeinflussen die Wege.',
         'Kaltes oder salzigeres Wasser kann bei gleichem Druck dichter sein. Dichteres Wasser sinkt unter weniger dichtes Wasser.'],
        [('Dichte', 'Wie viel Masse in einem bestimmten Raum steckt.'), ('An der Oberfläche', 'Wind ist ein wichtiger Antrieb.'), ('In der Tiefe', 'Temperatur und Salzgehalt beeinflussen die Dichte.')],
        ['Strömungen transportieren Wärme und verbinden Lebensräume. Ein einzelner Wasserstrom erklärt das Klimasystem aber nicht vollständig.',
         'Der Vergleich hier verändert nur ein Wasserpaket gegenüber seiner Umgebung. Das echte Meer hängt von vielen Bedingungen ab.'],
        'Das Meer ist ständig in Bewegung, auch tief unter den sichtbaren Wellen.',
        ['science-foodweb', 'animal-whale-shark'],
        [('NOAA · Meeresströmungen', 'https://oceanservice.noaa.gov/facts/current.html')],
        ('Welches Wasser sinkt im vereinfachten Vergleich eher?', ['Kälteres, salzigeres Wasser', 'Wärmeres, weniger salziges Wasser', 'Wasser ohne jede Masse'], 'Kälte und mehr Salz erhöhen im Modell die Dichte des Wasserpakets.'))

science('motor', 'Wie wird Strom zu Bewegung?', 'Ein Elektromotor nutzt magnetische Kräfte, um eine Drehung anzutreiben.',
        ['Strom fließt durch eine Spule aus Draht. Im Magnetfeld wirken Kräfte auf die stromdurchflossenen Drahtstücke.',
         'Bei einem einfachen Gleichstrommotor wird die Stromrichtung passend umgeschaltet. So dreht sich die Spule weiter.'],
        [('Spule', 'Ein mehrfach gewickelter Draht.'), ('Energie', 'Elektrische Energie wird unter anderem in Bewegung und Wärme umgewandelt.'), ('Alltag', 'Motoren stecken zum Beispiel in Ventilatoren und Waschmaschinen.')],
        ['Der Stromwender heißt Kommutator. In diesem einfachen Modell wechselt er bei jeder halben Drehung die Anschlüsse.',
         'Moderne Motoren können anders aufgebaut sein. Manche schalten elektronisch und brauchen keine Bürsten.'],
        'Ein Motor erzeugt keine Energie aus dem Nichts. Er braucht eine Energiequelle.',
        ['science-circuit', 'science-energy', 'invention-car'],
        [('National MagLab · Gleichstrommotor', 'https://nationalmaglab.org/magnet-academy/watch-play/interactive-tutorials/dc-motor/')],
        ('Wozu dient der Stromwender im einfachen Motor?', ['Die Stromrichtung passend zur Drehung wechseln', 'Die Batterie unbegrenzt aufladen', 'Die Räder festhalten'], 'Das Umschalten hilft, die Spule weiter in derselben Drehrichtung anzutreiben.'))

science('foodweb', 'Wer gibt wem Energie?', 'Nahrung verbindet Lebewesen. Die Sonne liefert Energie für die meisten Nahrungsketten.',
        ['Pflanzen und manche winzigen Wasserlebewesen nutzen Licht, um energiereiche Stoffe aufzubauen.',
         'Tiere erhalten Energie, indem sie Pflanzen oder andere Tiere fressen. Ein Pfeil zeigt hier vom Futter zum Fresser.'],
        [('Produzenten', 'Lebewesen, die mit Licht energiereiche Stoffe aufbauen.'), ('Konsumenten', 'Lebewesen, die andere Lebewesen fressen.'), ('Nahrungsnetz', 'Viele miteinander verbundene Nahrungsketten.')],
        ['Im Meer beginnt eine Kette oft mit Phytoplankton: winzigen Lebewesen, die Licht nutzen. Krill frisst davon; Blauwale fressen Krill.',
         'In echten Lebensräumen hat ein Tier oft mehrere Nahrungsquellen. Zersetzer wie Pilze und Bakterien bringen Stoffe wieder in den Kreislauf.'],
        'Energie fließt durch Nahrungsketten. Stoffe können in Kreisläufen immer wieder genutzt werden.',
        ['animal-blue-whale', 'animal-lion', 'animal-honey-bee'],
        [('NOAA · Aquatische Nahrungsnetze', 'https://www.noaa.gov/education/resource-collections/marine-life/aquatic-food-webs')],
        ('Wohin zeigt ein Nahrungspfeil in unserem Modell?', ['Vom Futter zum Fresser', 'Immer zum größten Tier', 'Immer in Richtung Norden'], 'Der Pfeil zeigt, wohin Energie mit der Nahrung weitergegeben wird.'))

science('sound', 'Warum klingt ein Ton hoch oder tief?', 'Ein Ton beginnt mit einer Schwingung und breitet sich durch ein Material aus.',
        ['In Luft bewegen sich Teilchen hin und her. Dabei wandern Bereiche mit mehr und weniger Druck weiter.',
         'Mehr Schwingungen pro Sekunde ergeben eine höhere Tonhöhe. Eine größere Schwingung kann einen stärkeren Ton erzeugen.'],
        [('Frequenz', 'Schwingungen pro Sekunde, gemessen in Hertz.'), ('Amplitude', 'Die Stärke der Schwingung.'), ('Im Weltraum', 'Im leeren Vakuum kann sich Schall nicht ausbreiten.')],
        ['Die Kurve zeigt hier den Druck an einem Ort über die Zeit. Luftteilchen fliegen nicht wie diese Kurve auf und ab durchs Zimmer.',
         'Lautstärke hängt außerdem von Entfernung, Material und unserem Gehör ab. Das Modell bleibt absichtlich stumm.'],
        'Licht kann durch leeren Raum reisen. Schall braucht ein Material wie Luft, Wasser oder Metall.',
        ['invention-phone', 'science-atmosphere'],
        [('NASA · Die Wissenschaft des Schalls', 'https://www3.nasa.gov/specials/Quesst/science-of-sound.html')],
        ('Was macht einen Ton höher?', ['Mehr Schwingungen pro Sekunde', 'Weniger Schwingungen pro Sekunde', 'Eine andere Farbe des Instruments'], 'Eine höhere Frequenz bedeutet eine höhere Tonhöhe.'))

science('solar-system', 'Planeten: groß und weit entfernt', 'Acht Planeten bewegen sich um die Sonne. Größen und Abstände sind sehr verschieden.',
        ['Merkur, Venus, Erde und Mars sind die inneren Gesteinsplaneten. Weiter außen liegen Jupiter, Saturn, Uranus und Neptun.',
         'Ein Größenbild und eine Abstandskarte brauchen unterschiedliche Maßstäbe. Sonst passen die kleinen Planeten kaum noch auf den Bildschirm.'],
        [('Jupiter', 'Sein Durchmesser ist etwa 11,2-mal so groß wie der der Erde.'), ('Entfernungseinheit', 'Eine Astronomische Einheit ist ungefähr der mittlere Abstand Erde–Sonne.'), ('Neptun', 'Sein mittlerer Sonnenabstand beträgt etwa 30 solcher Einheiten.')],
        ['Durchmesser ist die Strecke durch die Mitte einer Kugel. Elf Erddurchmesser bedeuten nicht elfmal so viel Volumen.',
         'Die Abstände sind Mittelwerte. Planeten stehen nicht ordentlich auf einer geraden Linie und ihre Bahnen sind keine perfekten Kreise.'],
        'Der nächstgelegene Planet zur Sonne ist Merkur; der größte Planet ist Jupiter.',
        ['science-energy', 'invention-satellite', 'history-apollo11'],
        [('NASA · Planetendaten im Vergleich zur Erde', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html')],
        ('Warum trennen wir Größe und Entfernung in zwei Bilder?', ['Damit beide Vergleiche einen ehrlichen Maßstab haben.', 'Weil alle Planeten gleich groß sind.', 'Weil Entfernungen keine Rolle spielen.'], 'Ein Bild mit einem gemeinsamen Maßstab wäre für beide Vergleiche kaum lesbar.'))

science('energy', 'Sonnenstrom auch am Abend?', 'Eine Solarzelle wandelt Licht in elektrische Energie um. Ein Akku kann Energie für später speichern.',
        ['Bei viel Sonnenlicht entsteht mehr elektrische Energie als bei wenig Licht. Nachts liefert die Solarzelle hier nichts.',
         'Ein Akku kann einen Überschuss speichern. Ist er leer, fehlt diese Reserve.'],
        [('Solarzelle', 'Wandelt einen Teil der Lichtenergie in elektrische Energie um.'), ('Speicher', 'Ein Akku ist begrenzt und wird beim Entladen leerer.'), ('Stromnetz', 'In der Wirklichkeit helfen weitere Erzeuger, Speicher und Leitungen zusammen.')],
        ['Produktion und Verbrauch müssen zusammenpassen. Ein kleiner Speicher reicht nicht beliebig lange.',
         'Das Modell rechnet mit Spiel-Energiepunkten. Reale Anlagen haben zusätzlich Verluste und viele technische Regeln.'],
        'Ein Akku erzeugt keine neue Energie. Er speichert zuvor zugeführte Energie.',
        ['science-circuit', 'science-motor', 'invention-light'],
        [('US Department of Energy · Solarzellen', 'https://www.energy.gov/cmei/systems/solar-photovoltaic-cell-basics')],
        ('Was passiert nachts mit einer leeren Batterie im Modell?', ['Es fehlt Energie für das Haus.', 'Die Solarzelle liefert plötzlich doppelt so viel.', 'Die Batterie füllt sich von allein.'], 'Ohne Licht und ohne gespeicherte Energie braucht das Haus eine andere Versorgung.'))

science('patterns', 'Kann ein Computer Muster erkennen?', 'Computer können Beispiele vergleichen. Bei lernenden Systemen beeinflussen die Beispiele, was sie erkennen.',
        ['Ein Computer kann Bilder nach Farbe oder Form sortieren. Doch passende Merkmale hängen von der Aufgabe ab.',
         'Maschinelles Lernen nutzt Beispiele, um Muster zu finden. Fehler sind möglich, besonders bei ungewohnten oder einseitigen Beispielen.'],
        [('Merkmal', 'Eine Eigenschaft wie Farbe oder Form.'), ('Beispiele', 'Sie helfen einem lernenden System, Muster zu finden.'), ('Menschen', 'Wir müssen Ergebnisse prüfen und gute Fragen stellen.')],
        ['Ein rotes Quadrat passt zur Regel „rot“, aber nicht zur Regel „rund“. Dieselben Bilder können deshalb unterschiedlich sortiert werden.',
         'Unsere Übung hat feste Regeln und ist keine echte künstliche Intelligenz. Sie zeigt, warum die Wahl eines Merkmals wichtig ist.'],
        'Ein Computer kann bei einer bestimmten Aufgabe gut sein und bei einer anderen trotzdem viele Fehler machen.',
        ['science-computer', 'invention-computer', 'person-grace_hopper'],
        [('Google Developers · Maschinelles Lernen', 'https://developers.google.com/machine-learning/intro-to-ml/what-is-ml')],
        ('Warum kann dasselbe Bild unterschiedlich eingeordnet werden?', ['Weil verschiedene Regeln verschiedene Merkmale prüfen.', 'Weil ein Computer nie Fehler macht.', 'Weil alle Bilder dieselbe Form haben.'], 'Die Aufgabe bestimmt, ob zum Beispiel Farbe oder Form wichtig ist.'))

# Idempotent append/update of these additions only; legacy cards remain byte-for-byte equivalent.
by_id = {t['id']: t for t in new}
catalog = [by_id.pop(t['id'], t) for t in catalog] + list(by_id.values())
known = {t['id'] for t in catalog}
for t in catalog:
    missing = set(t['related']) - known
    if missing:
        raise ValueError(f"{t['id']}: unknown connections {missing}")
(ROOT / 'app/world-catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+'\n')
fields = ['id', 'category', 'title', 'intro', 'aliases', 'locations', 'image', 'model']
index = []
for t in catalog:
    p = {k: t[k] for k in fields if k in t}
    if t.get('animal'): p.update({k: t['animal'][k] for k in ['group', 'habitat', 'continent']})
    if t.get('history'): p.update({k: t['history'][k] for k in ['year', 'era', 'sensitive']})
    if t.get('invention'): p['year'] = t['invention']['year']
    index.append(p)
(ROOT / 'app/world-index.json').write_text(json.dumps(index, ensure_ascii=False, indent=2)+'\n')
print('Curated catalog:', len(catalog), 'cards')
