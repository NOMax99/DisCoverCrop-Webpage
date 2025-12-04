
// main.js
// Setzt automatisch die "active"-Klasse für den aktuellen Menüpunkt in .site-nav
// Robust gegenüber relativen/absoluten Pfaden, Unterordnern, Trailing Slashes,
// Query-Strings (?x=y) und Hashes (#anchor).

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.site-nav a');

  if (!links.length) return;

  // Hilfsfunktion: extrahiert einen vergleichbaren "Key" aus einer URL oder einem href
  const getKey = (url) => {
    try {
      // Wenn href relativ ist, URL relativ zum aktuellen Standort auflösen
      const u = new URL(url, window.location.origin);

      // Pfad normalisieren:
      // - Entfernt mehrfaches Slash
      // - Entfernt Trailing Slash, außer es ist Root "/"
      let path = u.pathname.replace(/\/+/g, '/');
      if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }

      // Dateiname extrahieren (alles nach dem letzten "/")
      let file = path.split('/').pop();

      // Wenn kein Dateiname (z. B. "/" oder "/about" im Server, der index.html serviert),
      // setze Datei analog zu einer Startseite auf "index.html"
      if (!file) file = 'index.html';

      // Optional: Query-/Hash ignorieren (wir vergleichen rein den Dateinamen)
      return file.toLowerCase();
    } catch (_) {
      // Fallback: wenn URL ungültig war, einfach den String grob behandeln
      const cleaned = (url || '').split('?')[0].split('#')[0];
      const file = cleaned.split('/').pop() || 'index.html';
      return file.toLowerCase();
    }
  };

  // Aktuellen Seiten-Key ermitteln
  const currentKey = getKey(window.location.href);

  // Für jeden Link prüfen, ob sein href zur aktuellen Seite passt
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkKey = getKey(href);

    if (linkKey === currentKey) {
      link.classList.add('active');
      // ARIA-Hinweis für Screenreader
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
