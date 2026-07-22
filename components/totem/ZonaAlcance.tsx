import type { ReactNode } from "react";

/**
 * Numa tela de totem de ~1,80m, o terço superior e a faixa inferior são
 * zonas mortas — ninguém alcança confortavelmente em pé. Todo elemento
 * TOCÁVEL vive aqui dentro. Usa vh (não px) de propósito: escala igual em
 * qualquer tamanho de tela.
 *
 * Começa em 22vh, não 20vh: os cabeçalhos de cada tela terminam em 20vh
 * (bottom-anchored), e sem esse respiro de 2vh o título da tela e o
 * primeiro item tocável ficam visualmente colados um no outro.
 *
 * A área de conteúdo rolável vai até 80vh — os 20vh finais ficam
 * reservados pro <BotaoInicio>, que é um irmão fixo, não filho daqui (ele
 * mora perto do fundo, em bottom:6vh). Sem essa reserva, conteúdo longo
 * (que rola dentro desta zona) visualmente colide com o botão de início.
 */
export function ZonaAlcance({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-x-0 flex flex-col overflow-y-auto ${className}`}
      style={{ top: "22vh", height: "58vh" }}
    >
      {children}
    </div>
  );
}
