"use client";

import { useEffect, useRef, useState } from "react";

export function PDFViewer({ url, titulo }: { url: string; titulo: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    const container = containerRef.current;
    if (!container) return;

    async function renderizar() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const pdf = await pdfjsLib.getDocument({ url }).promise;
        if (cancelado || !container) return;

        container.innerHTML = "";

        for (let numeroPagina = 1; numeroPagina <= pdf.numPages; numeroPagina++) {
          if (cancelado) return;

          const pagina = await pdf.getPage(numeroPagina);
          const viewport = pagina.getViewport({ scale: 1.4 });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "w-full border border-borda bg-paper";
          container.appendChild(canvas);

          const contexto = canvas.getContext("2d");
          if (!contexto) continue;

          await pagina.render({ canvas, canvasContext: contexto, viewport })
            .promise;
        }

        if (!cancelado) setCarregando(false);
      } catch {
        if (!cancelado) {
          setErro("Não foi possível carregar o PDF.");
          setCarregando(false);
        }
      }
    }

    renderizar();

    return () => {
      cancelado = true;
    };
  }, [url]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="meta text-chumbo-lt">Documento original</p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="meta text-lacre hover:underline"
        >
          Abrir PDF em nova aba
        </a>
      </div>

      {carregando && (
        <p className="meta text-chumbo-lt">Carregando documento…</p>
      )}
      {erro && <p className="font-serif text-sm text-lacre">{erro}</p>}

      <div
        ref={containerRef}
        aria-label={`Visualizador de PDF: ${titulo}`}
        className="flex flex-col gap-4"
      />
    </div>
  );
}
