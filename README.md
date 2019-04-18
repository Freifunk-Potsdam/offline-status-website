Freifunk Berlin Offline Status Website
======================================

**[Beispiel anzeigen][beispiel]** | **[Webseite anzeigen][web]** | **[Herunterladen]**

Dieses Repository beinhaltet eine Kartographierung der Freifunk-Knoten
der [Berliner Firmware][firmware] (OLSR 0.9.3 + JSON-info plugin).
Das ist nützlich, um

- eine lokale Karte zusammenzustellen, die nur ein paar Router beinhaltet.
- eine Offline-Installation mit einer Karte sichtbar zu machen.
- Router auf Bildern mit ihren Verbindungsstärken zu markieren.

Features:
- Plazierung von Routern auf einer Karte.
- Plazierung von Routern auf Bildern.
- Signalstärken zwischen den Routern werden angezeigt.
- Router werden automatisch erkannt.
- Neue Router können auf die Karte geschoben werden und gelöscht werden.
- Die Verbindungsstärke und die Hops bis zum Gateway werden angezeigt.
- Es ist ausreichend, auf nur einem Router das JSON-info-Plugin zu konfigurieren.

Weitere Links
-------------

- [Diskussion zur Einrichtung des JSON-Plugins](https://github.com/freifunk-berlin/firmware/issues/676)
- [Gespräch über die Grundlagen dieser Karte](https://lists.berlin.freifunk.net/pipermail/berlin/2019-March/039316.html)

[firmware]: https://github.com/freifunk-berlin/firmware/
[beispiel]: http://freifunkkarte.quelltext.eu/#%7B%22visibleRouters%22%3A%7B%2210.22.254.111%22%3A%7B%22ip%22%3A%2210.22.254.111%22%2C%22x%22%3A0.28737113402061853%2C%22y%22%3A0.4980673038209532%2C%22shortName%22%3A%22111%22%7D%2C%2210.22.254.132%22%3A%7B%22ip%22%3A%2210.22.254.132%22%2C%22x%22%3A0.3402061855670103%2C%22y%22%3A0.5161269961350717%2C%22shortName%22%3A%22132%22%7D%2C%2210.22.254.161%22%3A%7B%22ip%22%3A%2210.22.254.161%22%2C%22x%22%3A0.4162371134020619%2C%22y%22%3A0.3725999677439192%2C%22shortName%22%3A%22161%22%7D%2C%2210.22.254.173%22%3A%7B%22ip%22%3A%2210.22.254.173%22%2C%22x%22%3A0.5038659793814433%2C%22y%22%3A0.6434953524556972%2C%22shortName%22%3A%22173%22%7D%7D%2C%22invisibleRouters%22%3A%7B%7D%2C%22olsrSourceIps%22%3A%5B%22frei.funk%22%2C%22olsr-info.ffp.quelltext.eu%3A80%22%5D%7D
[web]: http://freifunkkarte.quelltext.eu/
[Herunterladen]: https://github.com/niccokunzmann/freifunk-berlin-offline-status-website/archive/master.zip

