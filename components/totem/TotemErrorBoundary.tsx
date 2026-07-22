"use client";

import { Component, type ReactNode } from "react";

/**
 * Se uma view do totem quebrar, cai graciosamente no attract (via onErro)
 * em vez de deixar o quiosque numa tela branca. O pai deve passar uma
 * `key` diferente a cada troca de estado — é isso que remonta a boundary
 * e limpa `comErro`, senão ela ficaria travada em "com erro" para sempre.
 */
export class TotemErrorBoundary extends Component<
  { children: ReactNode; onErro: () => void },
  { comErro: boolean }
> {
  constructor(props: { children: ReactNode; onErro: () => void }) {
    super(props);
    this.state = { comErro: false };
  }

  static getDerivedStateFromError() {
    return { comErro: true };
  }

  componentDidCatch() {
    this.props.onErro();
  }

  render() {
    if (this.state.comErro) return null;
    return this.props.children;
  }
}
