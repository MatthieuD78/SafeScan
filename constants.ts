
import { RecallAlert } from './types';

export const OFFICIAL_RECALLS: RecallAlert[] = [
  {
    id: '1',
    name: 'Jambon Cuit Supérieur sans couenne -25% sel',
    brand: 'Herta',
    lot: '223410',
    reason: 'Présence de Listeria monocytogenes',
    date: '2023-10-25'
  },
  {
    id: '2',
    name: 'Yaourt à la fraise onctueux',
    brand: 'Danone',
    lot: 'L203A',
    reason: 'Risque de présence de corps étrangers métalliques',
    date: '2023-11-02'
  },
  {
    id: '3',
    name: 'Lait Entier Bio 1L',
    brand: 'Lactel',
    lot: '23098B',
    reason: 'Défaut de stérilité (caillage précoce)',
    date: '2023-11-05'
  },
  {
    id: '4',
    name: 'Saucisson Sec Pur Porc',
    brand: 'Justin Bridou',
    lot: 'JB-776',
    reason: 'Présence de Salmonella',
    date: '2023-10-15'
  },
  {
    id: '5',
    name: 'Fromage de Chèvre Sainte-Maure',
    brand: 'Soignon',
    lot: 'S-455',
    reason: 'Contamination E. Coli',
    date: '2023-11-10'
  }
];

export const RECEIPT_EXAMPLES = [
  "HERTA JAMB S/C -25% SEL\nDANONE YOG FRAISE\nPAIN CAMPAGNE\nCOCA COLA 1.5L\nBEURRE DOUX 250G",
  "LAIT ENT. BIO 1L\nOEUFS X12 PLEIN AIR\nSAUCISSON PUR PORC JB\nSOIGNON ST MAURE 200G\nLOT: JB-776",
  "HARIBO TAGADA\nCEREALES LION\nBISCUITS CHOCO\nSIROP GLUCOSE TEST\nYAOURT NATURE X4"
];
