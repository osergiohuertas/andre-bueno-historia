"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ZonaAlcance } from "@/components/totem/ZonaAlcance";

export function PonteQR({
  titulo,
  url,
  onExplorarMais,
}: {
  titulo: string;
  url: string;
  onExplorarMais: () => void;
}) {
  const [estadoQr, setEstadoQr] = useState<
    { status: "carregando" } | { status: "pronto"; dataUrl: string } | { status: "erro" }
  >({ status: "carregando" });

  useEffect(() => {
    // Sem reset síncrono de estado aqui: cada QR novo é uma instância nova
    // de PonteQR (a key da tela "qr" inclui a url — ver TotemApp.tsx), então
    // o estado inicial "carregando" já vale pra cada montagem.
    let cancelado = false;
    QRCode.toDataURL(url, {
      width: 480,
      margin: 1,
      color: { dark: "#0E1B33", light: "#F7F3EC" },
    })
      .then((dataUrl) => {
        if (!cancelado) setEstadoQr({ status: "pronto", dataUrl });
      })
      .catch(() => {
        if (!cancelado) setEstadoQr({ status: "erro" });
      });
    return () => {
      cancelado = true;
    };
  }, [url]);

  return (
    <>
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-end px-10 text-center"
        style={{ height: "20vh" }}
      >
        <p className="meta text-ouro">Continue no seu celular</p>
        <h1 className="mt-3 font-display text-xl text-paper line-clamp-2">
          {titulo}
        </h1>
      </div>

      <ZonaAlcance className="items-center justify-center gap-5">
        <div className="flex h-52 w-52 items-center justify-center bg-paper p-3">
          {estadoQr.status === "carregando" && (
            <div className="h-full w-full animate-pulse bg-paper-mid" aria-hidden />
          )}
          {estadoQr.status === "pronto" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={estadoQr.dataUrl} alt="QR code" className="h-full w-full" />
          )}
          {estadoQr.status === "erro" && (
            <p className="meta px-4 text-center text-lacre">
              Não deu pra gerar o código agora
            </p>
          )}
        </div>

        <p className="meta text-paper/60">
          {estadoQr.status === "erro" ? "tente de novo em instantes" : "leia offline depois"}
        </p>

        <button
          type="button"
          onClick={onExplorarMais}
          className="mt-4 flex items-center gap-3 border border-paper/25 bg-paper/5 px-6 text-paper transition-transform active:scale-[0.98] active:bg-ouro/15"
          style={{ minHeight: "58px" }}
        >
          Explorar mais
        </button>
      </ZonaAlcance>
    </>
  );
}
