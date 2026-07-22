export const PERIODOS = [
  {
    id: 'pre-colonial',
    label: 'Pré-Colonial e Sociedades Originárias',
    inicio: null,
    fim: 1500,
  },
  {
    id: 'america-portuguesa',
    label: 'América Portuguesa e Formação da Sociedade Colonial',
    inicio: 1500,
    fim: 1822,
  },
  {
    id: 'brasil-monarquico',
    label: 'Brasil Monárquico e Construção do Estado Nacional',
    inicio: 1822,
    fim: 1889,
  },
  {
    id: 'brasil-republicano',
    label: 'Brasil Republicano e Transformações Contemporâneas',
    inicio: 1889,
    fim: null,
  },
  { id: 'transversal', label: 'Transversal', inicio: null, fim: null },
] as const

export type PeriodoId = typeof PERIODOS[number]['id']
export type Periodo = typeof PERIODOS[number]

export function getPeriodo(id: PeriodoId): Periodo {
  const periodo = PERIODOS.find((p) => p.id === id)
  if (!periodo) {
    throw new Error(`Período desconhecido: ${id}`)
  }
  return periodo
}

export function isPeriodoId(id: string): id is PeriodoId {
  return PERIODOS.some((p) => p.id === id)
}

/**
 * Retorna o período cujo intervalo [inicio, fim) contém o ano informado.
 * `transversal` nunca é retornado — não tem eixo temporal.
 */
export function periodoDeAno(ano: number): Periodo | undefined {
  return PERIODOS.find((p) => {
    if (p.id === 'transversal') return false
    const depoisDoInicio = p.inicio === null || ano >= p.inicio
    const antesDoFim = p.fim === null || ano < p.fim
    return depoisDoInicio && antesDoFim
  })
}

/**
 * Os 4 períodos do eixo cronológico, na ordem da timeline. `transversal`
 * fica de fora — ele vive numa faixa própria, não no eixo.
 */
export function periodosOrdenados(): Periodo[] {
  return PERIODOS.filter((p) => p.id !== 'transversal')
}
