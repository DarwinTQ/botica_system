export function descargarCSV(nombreArchivo, filas, columnas) {
  const encabezado = columnas.map((c) => c.etiqueta).join(',');
  const cuerpo = filas
    .map((fila) =>
      columnas
        .map((c) => {
          const valor = c.valor(fila);
          const texto = String(valor ?? '').replace(/"/g, '""');
          return /[",\n]/.test(texto) ? `"${texto}"` : texto;
        })
        .join(',')
    )
    .join('\n');

  const contenido = `${encabezado}\n${cuerpo}`;
  const blob = new Blob([`﻿${contenido}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(url);
}
