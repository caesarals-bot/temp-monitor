# Cómo Ejecutar el Esquema en Supabase

Existen dos formas principales de aplicar el esquema SQL en tu proyecto:

## Opción 1: Supabase Dashboard (Recomendada/Fácil)

Esta es la forma más directa si estás empezando:

1.  Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2.  En el menú lateral izquierdo, haz clic en el ícono **SQL Editor** (`>_`).
3.  Haz clic en el botón verde **"+ New query"** (arriba a la izquierda) o selecciona una consulta en blanco.
4.  Copia **TODO** el contenido del archivo `SUPABASE_SCHEMA.sql` que acabamos de generar.
5.  Pega el código en el editor de consultas del Dashboard.
6.  Haz clic en el botón verde **"Run"** (abajo a la derecha).
7.  Verás un mensaje de éxito ("Success") en la parte inferior.

**Nota:** Si obtienes un error, verifica que no hayas ejecutado el script parcialmente. El script está diseñado para correr completo, incluye la creación de extensiones y tablas en el orden correcto.

## Opción 2: Supabase CLI (Avanzado)

Si desarrollas localmente con Docker y el CLI de Supabase:

1.  En tu terminal, navega a la raíz del proyecto.
2.  Ejecuta:
    ```bash
    npx supabase migration new init_schema
    ```
3.  Esto creará un archivo nuevo en `supabase/migrations/`.
4.  Copia el contenido de `SUPABASE_SCHEMA.sql` en ese nuevo archivo `.sql`.
5.  Aplica los cambios:
    ```bash
    npx supabase db reset
    ```

---

**Siguiente Paso:**
Una vez ejecutado, ve a la sección **Table Editor** en el Dashboard para confirmar que las tablas (`organizations`, `profiles`, `restaurants`, etc.) se hayan creado correctamente.
