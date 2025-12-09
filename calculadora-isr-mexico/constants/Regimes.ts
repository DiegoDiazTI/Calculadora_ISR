// constants/Regimes.ts
// Configuración de regímenes fiscales

import { RegimeConfig } from '@/types';
import { RESICO_CHARACTERISTICS, PERSONA_MORAL_CHARACTERISTICS } from './TaxTables';

export const REGIMES: RegimeConfig[] = [
  {
    id: 'RESICO',
    title: 'RESICO',
    subtitle: 'Persona Física',
    icon: 'account',
    enabled: true,
    characteristics: RESICO_CHARACTERISTICS,
  },
  {
    id: 'MORAL',
    title: 'Persona Moral',
    subtitle: 'Régimen General',
    icon: 'office-building',
    enabled: true,  // ← Asegúrate que dice true
    characteristics: PERSONA_MORAL_CHARACTERISTICS,
  },
  {
    id: 'TABLES',
    title: 'Tablas ISR',
    subtitle: 'Consulta las tablas',
    icon: 'table',
    enabled: true,
    characteristics: [],
  },
];