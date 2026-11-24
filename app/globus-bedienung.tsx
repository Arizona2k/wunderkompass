// Bedienelemente, die erst der Globus und das alte Quiz brauchen: Ortssuche, Auswahllisten und der Tag-Regler.
// Sie liegen in einem eigenen Programmteil (React.lazy in earth-explorer.tsx), damit das Startpaket klein bleibt:
// Combobox und Auswahlliste bringen zusammen rund 250 KB Programm mit (BACKLOG „Startpaket fast an seiner festen Grenze“).
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Place } from "./earth-data";

// „Wohin möchtest du reisen?“ unter dem Globus. Die Beschriftung steht in earth-explorer.tsx (place-picker-label).
export function OrtAuswahl({ places, selectedId, onPick }: { places: Place[]; selectedId?: string; onPick: (place: Place) => void }) {
  return <Combobox items={places} value={places.find(p => p.id === selectedId) ?? null} onValueChange={p => { if (p) onPick(p); }} itemToStringLabel={p => p.name} isItemEqualToValue={(a, b) => a.id === b.id}>
    <ComboboxInput className="place-combobox" placeholder="Ort suchen …" aria-labelledby="place-picker-label"/>
    <ComboboxContent><ComboboxEmpty>Kein Ort gefunden.</ComboboxEmpty><ComboboxList>{(p: Place) => <ComboboxItem className="earth-place-option" key={p.id} value={p}>{p.name}</ComboboxItem>}</ComboboxList></ComboboxContent>
  </Combobox>;
}

// Auswahlliste mit Einträgen [Wert, Name]. Beschriftet über aria-label oder aria-labelledby.
export function AuswahlListe({ value, onValueChange, eintraege, className, ...beschriftung }: { value: string; onValueChange: (value: string) => void; eintraege: readonly (readonly [string, string, ...string[]])[]; className?: string; "aria-label"?: string; "aria-labelledby"?: string }) {
  return <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className={className} {...beschriftung}><SelectValue/></SelectTrigger>
    <SelectContent>{eintraege.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}</SelectContent>
  </Select>;
}

// Uhrzeit im Modell „Tag und Nacht“ (0 bis 24 Uhr). Die Beschriftung steht in earth-explorer.tsx (day-slider-label).
export function TagRegler({ stunde, onStunde }: { stunde: number; onStunde: (stunde: number) => void }) {
  return <Slider value={[stunde]} min={0} max={24} step={.1} onValueChange={v => onStunde(v[0])} aria-labelledby="day-slider-label"/>;
}
