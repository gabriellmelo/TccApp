export const bairros = [
  "ALTO DA BOA VISTA - JOAO BARBOSA LIMA", "AUGUSTO JOSE MONTEIRO", "BAIRRO SAO JOAQUIM", "BELVEDERE DOS CRISTAIS", "BOA VISTA", "CENTRO - RIBEIRAO CORRENTE", 
  "BAIRRO ESTRADA DA FAZENDA BOM JARDIM", "BAIRRO GROSSO", "BAIRRO MARTINESIA", "BAIRRO SANTA BARBARA", "BAIRRO SANTA RITA", 
  "CENTRO COMERCIAL JARDIM REDENTOR", "CENTRO COMERCIAL VL IMPERADOR E PQ PINHAIS", "CHACARA SANTA MARIA", "CHACARA SAO PAULO - GLEBA 25", "CHACARA SAO PAULO", "CHACARAS OURO VERDE CITY PETROPOLIS", 
  "CONDOMINIO BETEL (LOTEAMENTO)", "CONJ HABIT JARDIM IRMAS MATTOS", "CONJ HABIT JARDIM ZOROASTRO FERREIRA COELHO", "CONJ HABIT PARQUE DO HORTO", 
  "PARQUE", "CONJ HABIT PQ VICENTE LEPORACE 1", "CONJ HABIT PQ VICENTE LEPORACE 2", 
];

export const RuasPorBairro: { [bairro: string]: string[] } = {
  "ALTO DA BOA VISTA - JOAO BARBOSA LIMA": [
    "Rua Monsenhor Rosa",
    "Avenida Presidente Vargas",
    "Rua Major Claudiano",
    "Rua General Osório",
    "Rua do Comércio",
  ],
  "AUGUSTO JOSE MONTEIRO": [
    "Antônio Scarabucci",
    "Rua B",
    "Rua C",
  ],
  "BAIRRO SAO JOAQUIM": [
    "Avenida Doutor Abrahão Brickmann",
    "Avenida Geralda Rocha Silva",
    "Avenida Lisete Coelho Lourenço",
  ],
  "BELVEDERE DOS CRISTAIS": [
    "Avenida Paulo VI",
    "Rua K",
    "Rua L",
  ],
  "BOA VISTA": [
    "Avenida Paulo VI",
    "Rua K",
    "Rua L",
  ],
  "CENTRO - RIBEIRAO CORRENTE": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
  ],
  "BAIRRO ESTRADA DA FAZENDA BOM JARDIM": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
  ],
  "BAIRRO GROSSO": [
    "Avenida Doutor Abrahão Brickmann",
    "Avenida Geralda Rocha Silva",
    "Avenida Lisete Coelho Lourenço",
  ],
  "BAIRRO MARTINESIA": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
  ],
  "BAIRRO SANTA BARBARA": [
    "Avenida Doutor Abrahão Brickmann",
    "Avenida Geralda Rocha Silva",
    "Avenida Lisete Coelho Lourenço",
  ],
  "BAIRRO SANTA RITA": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
  ],
  "CENTRO COMERCIAL JARDIM REDENTOR": [
    "Avenida Doutor Abrahão Brickmann",
    "Avenida Geralda Rocha Silva",
    "Avenida Lisete Coelho Lourenço",
  ],
  "CENTRO COMERCIAL VL IMPERADOR E PQ PINHAIS": [
    "Rua Monsenhor Rosa",
    "Avenida Presidente Vargas",
    "Rua Major Claudiano",
    "Rua General Osório",
    "Rua do Comércio",
  ],
  "CHACARA SANTA MARIA": [
    "Rua Monsenhor Rosa",
    "Avenida Presidente Vargas",
    "Rua Major Claudiano",
    "Rua General Osório",
    "Rua do Comércio",
  ],
  "CHACARA SAO PAULO - GLEBA 25": [
    "Rua Monsenhor Rosa",
    "Avenida Presidente Vargas",
    "Rua Major Claudiano",
    "Rua General Osório",
    "Rua do Comércio",
  ],
  "CHACARA SAO PAULO": [
    "Rua Monsenhor Rosa",
    "Avenida Presidente Vargas",
    "Rua Major Claudiano",
    "Rua General Osório",
    "Rua do Comércio",
  ],
  "CHACARAS OURO VERDE CITY PETROPOLIS": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
  ],
  "CONDOMINIO BETEL (LOTEAMENTO)": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
  ],
  "CONJ HABIT JARDIM IRMAS MATTOS": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
  ],
  "CONJ HABIT JARDIM ZOROASTRO FERREIRA COELHO": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
  ],
  "CONJ HABIT PARQUE DO HORTO": [
    "Avenida Paulo VI",
    "Rua K",
    "Rua L",
  ],
  "PARQUE": [
    "Avenida Paulo VI",
    "Rua K",
    "Rua L",
  ],
  "CONJ HABIT PQ VICENTE LEPORACE 1": [
    "Avenida Paulo VI",
    "Rua K",
    "Rua L",
  ],
  "CONJ HABIT PQ VICENTE LEPORACE 2": [
    "Avenida Paulo VI",
    "Rua K",
    "Rua L",
  ],
};

export const AcidenteDadosPorRua: {
  [rua: string]: {
    bairro: string;
    indiceAcidentes: number;
    horarioMaiorIncidencia: string;
    causasMaisFrequentes: string[];
    rotasAlternativas: string[];
  };
} = {
  "Rua Monsenhor Rosa": {
    bairro: "Centro",
    indiceAcidentes: 10,
    horarioMaiorIncidencia: "18h às 20h",
    causasMaisFrequentes: [
      "Desrespeito à sinalização",
      "Excesso de velocidade",
      "Falta de atenção",
    ],
    rotasAlternativas: [
      "Avenida Presidente Vargas",
      "Rua Major Claudiano",
      "Rua General Osório",
    ],
  },
  "Antônio Scarabucci": {
    bairro: "Vila Santa Cruz",
    indiceAcidentes: 5,
    horarioMaiorIncidencia: "17h às 19h",
    causasMaisFrequentes: [
      "Falta de atenção",
      "Desrespeito à sinalização",
      "Condições climáticas adversas",
    ],
    rotasAlternativas: [
      "Rua B",
      "Rua C",
    ],
  },
  "Avenida Doutor Abrahão Brickmann": {
    bairro: "Parque Vicente Leporace",
    indiceAcidentes: 8,
    horarioMaiorIncidencia: "16h às 18h",
    causasMaisFrequentes: [
      "Excesso de velocidade",
      "Desrespeito à sinalização",
      "Falta de atenção",
    ],
    rotasAlternativas: [
      "Avenida Geralda Rocha Silva",
      "Avenida Lisete Coelho Lourenço",
    ],
  },
  "Avenida Presidente Vargas": {
    bairro: "Centro",
    indiceAcidentes: 3,
    horarioMaiorIncidencia: "08h às 10h",
    causasMaisFrequentes: [
      "Falta de atenção",
      "Desrespeito à sinalização",
    ],
    rotasAlternativas: [
      "Rua do Comércio",
      "Rua General Osório",
    ],
  },
  "Rua B": {
    bairro: "Vila Santa Cruz",
    indiceAcidentes: 2,
    horarioMaiorIncidencia: "12h às 14h",
    causasMaisFrequentes: [
      "Falta de atenção",
      "Excesso de velocidade",
    ],
    rotasAlternativas: [
      "Antônio Scarabucci",
      "Rua C",
    ],
  },
  "Avenida Paulo VI": {
    bairro: "Jardim Alvorada",
    indiceAcidentes: 7,
    horarioMaiorIncidencia: "16h às 18h",
    causasMaisFrequentes: [
      "Desrespeito à sinalização",
      "Falta de atenção",
    ],
    rotasAlternativas: [
      "Rua K",
      "Rua L",
    ],
  },
  "Avenida Major Nicácio": {
    bairro: "Cidade Nova",
    indiceAcidentes: 4,
    horarioMaiorIncidencia: "14h às 16h",
    causasMaisFrequentes: [
      "Excesso de velocidade",
      "Falta de atenção",
    ],
    rotasAlternativas: [
      "Avenida Presidente Vargas",
      "Rua Álvaro Abranches",
    ],
  },
};
