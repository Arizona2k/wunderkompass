#!/usr/bin/env bash
# Nur für die CI (quality.yml, vor „playwright install --with-deps“): Ubuntu-Pakete vom offiziellen Spiegel holen.
# Die GitHub-Rechner bringen einen Spiegel ihres Rechenzentrums mit (Azure oder AWS, z. B. us-east-2.ec2) mit
# Priorität 1. Gilt für den offiziellen Spiegel dieselbe Priorität, verteilt apt die Pakete auf beide. Am 24.11.2026
# lieferte der AWS-Spiegel so 170 kB/s: 13½ Minuten im Pflicht-Check, der nur 20 hat (Lauf 45330432651).
# Darum hat nur der offizielle Spiegel Priorität 1. Alle anderen bleiben in ihrer Reihenfolge als Ersatz dahinter
# (alte Priorität + 10; ein zweiter Aufruf ändert nichts mehr). Alle Spiegel liefern dieselben signierten Pakete.
# Aufruf: bash scripts/ci-paketspiegel.sh [spiegelliste]   (ohne Angabe /etc/apt/apt-mirrors.txt)
set -euo pipefail
datei="${1:-/etc/apt/apt-mirrors.txt}"
if [ ! -f "$datei" ]; then
  echo "Keine Spiegelliste ($datei): apt nutzt seine Standardquellen."
  exit 0
fi
neu="$(mktemp)"
awk -v OFS='\t' '
  /^[ \t]*(#|$)/ { print; next }
  {
    if ($1 ~ /^https?:\/\/archive\.ubuntu\.com\/ubuntu\/?$/) { gefunden = 1; rang = 1 }
    else {
      alt = 0; if (match($0, /priority:[0-9]+/)) alt = substr($0, RSTART + 9, RLENGTH - 9) + 0
      rang = alt >= 10 ? alt : alt + 10
    }
    zeile = $0
    if (zeile ~ /priority:[0-9]+/) sub(/priority:[0-9]+/, "priority:" rang, zeile)
    else zeile = zeile "\tpriority:" rang
    print zeile
  }
  END { if (!gefunden) print "https://archive.ubuntu.com/ubuntu/", "priority:1" }
' "$datei" > "$neu"
if [ -w "$datei" ]; then cat "$neu" > "$datei"; else sudo cp "$neu" "$datei"; fi
rm -f "$neu"
echo "Spiegelliste für apt ($datei):"
cat "$datei"
