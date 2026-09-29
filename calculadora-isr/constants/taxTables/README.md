# Tablas fiscales por año

Cada año fiscal vive en su propio archivo (`2025.ts`, `2026.ts`, ...) y se
registra en [`index.ts`](./index.ts). `CURRENT_TAX_YEAR` es siempre el año
más reciente registrado, y toda la app (calculadora, tablas de consulta)
usa ese año automáticamente a través de los exports de conveniencia al
final de `index.ts` — no hay que tocar componentes.

## Dónde vive cada tabla oficialmente

| Régimen | Nombre oficial | Dónde se publica | ¿Cambia cada año? |
|---|---|---|---|
| **Actividad Empresarial** (persona física) | "Tarifa para el cálculo de los pagos provisionales mensuales... artículo 106 de la Ley del ISR" | **Anexo 8** de la Resolución Miscelánea Fiscal (RMF), en el DOF, normalmente última semana de diciembre | Sí — factor de actualización por inflación |
| **RESICO** (persona física) | Tarifas del **Artículo 113-E** de la LISR | Directo en el texto de la ley (no está en el Anexo 8) | No, solo si hay reforma a la ley (raro) |
| **Persona Moral** | Tasa del **Artículo 9** de la LISR | Directo en el texto de la ley | No, 30% fijo desde hace años |

## Cómo agregar el año siguiente (ej. 2027)

1. **Consigue la tarifa oficial.**
   - **Actividad Empresarial** (la que sí cambia siempre): busca
     `"Anexo 8 Resolución Miscelánea Fiscal [año] DOF"`, o entra directo a
     `https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos[año]/rmf/anexos/`
     y busca el PDF `Anexo-8-RMF-[año]_DOF-...pdf`. Dentro, busca la sección
     **"Tarifa del mes de enero de [año]... artículo 106"** — esa es la
     tabla base (mes 1) que usa la app (se multiplica por mes en tiempo de
     cálculo). Si `pdftotext` está disponible, extraer el texto del PDF
     directo es más confiable que copiar de un blog de terceros — ya hubo
     un caso real donde una fuente secundaria tenía un límite de tramo mal
     por un centavo.
   - **RESICO y Persona Moral** (rara vez cambian, pero confirma): texto
     vigente de la LISR en `https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf`
     (se actualiza solo cuando hay reforma real) — busca "Artículo 113-E" o
     "Artículo 9" con Ctrl+F.

2. **Copia la plantilla:**
   ```bash
   cp constants/taxTables/2025.ts constants/taxTables/2027.ts
   ```
   Cambia `year: 2025` → `year: 2027` y el nombre del export
   (`TAX_TABLES_2025` → `TAX_TABLES_2027`), y pega los valores nuevos.

3. **Registra el año** en `index.ts`:
   ```ts
   import { TAX_TABLES_2027 } from './2027';

   const REGISTRY: Record<number, FiscalYearTaxTables> = {
     2025: TAX_TABLES_2025,
     2026: TAX_TABLES_2026,
     2027: TAX_TABLES_2027, // 👈 nuevo
   };
   ```

4. **Corre los tests:**
   ```bash
   npm test
   ```
   - Si algún tramo tiene un hueco, se traslapa, o una cuota fija no es
     continua con el tramo anterior, el test de validación estructural
     (`validate.test.ts`) te dirá exactamente cuál y por qué — normalmente
     apunta a un número mal transcrito.
   - Agrega también 2-4 casos "ancla" para el año nuevo en
     `utils/__tests__/calculations.boundaries.test.ts`, fijando el año
     explícitamente como tercer argumento (ej.
     `calculateActividadEmpresarialISR(844.59, 1, 2026)`): ingresos justo en
     el límite de un tramo (ej. `$844.59` vs `$844.60`) verificados a mano
     contra el PDF oficial. Fijar el año evita que estos casos se rompan
     cuando `CURRENT_TAX_YEAR` avance al año siguiente. Esto es lo único
     que valida que los NÚMEROS sean correctos, no solo que la tabla esté
     bien formada.

5. **Publica sin pasar por revisión de tienda** (mientras no cambies
   dependencias nativas, `runtimeVersion` en `app.config.js` no cambia):
   ```bash
   eas update --branch production --message "Tablas fiscales 2027"
   ```
   Los usuarios con la app instalada reciben la tabla nueva la próxima vez
   que la abran.

## Por qué está estructurado así

- **Un archivo por año, nunca se edita uno existente.** Así una declaración
  de un ejercicio anterior (ej. alguien calculando su anual 2025 en abril
  de 2026) puede seguir usando `getTaxTables(2025)` aunque 2026 ya sea el
  año vigente.
- **Validación automática al importar** (`assertValidFiscalYearTable` en
  `index.ts`): si una tabla nueva rompe una invariante estructural, el
  import truena con un mensaje claro en vez de dejar que la app calcule
  silenciosamente un ISR incorrecto.
- **Nombres sin año en el código que consume las tablas**
  (`RESICO_TAX_TABLE_MENSUAL`, no `RESICO_TAX_TABLE_2025`): evita que quede
  un componente usando literalmente "2025" en 2027 solo porque nadie
  renombró la variable.
