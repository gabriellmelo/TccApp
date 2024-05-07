export const bairros = [
  "Centro",
  "Vila Santa Cruz",
  "Parque Vicente Leporace",
  "Jardim Alvorada",
  "Cidade Nova",
];

export const RuasPorBairro: { [bairro: string]: string[] } = {
  Centro: [
    "Rua Monsenhor Rosa",
    "Avenida Presidente Vargas",
    "Rua Major Claudiano",
    "Rua General Osório",
    "Rua do Comércio",
  ],
  "Vila Santa Cruz": [
    "Antônio Scarabucci",
    "Rua B",
    "Rua C",
  ],
  "Parque Vicente Leporace": [
    "Avenida Doutor Abrahão Brickmann",
    "Avenida Geralda Rocha Silva",
    "Avenida Lisete Coelho Lourenço",
  ],
  "Jardim Alvorada": [
    "Avenida Paulo VI",
    "Rua K",
    "Rua L",
  ],
  "Cidade Nova": [
    "Avenida Presidente Vargas",
    "Avenida Major Nicácio",
    "Rua Álvaro Abranches",
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
