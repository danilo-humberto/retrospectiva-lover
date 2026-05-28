export type RetrospectiveMemory = {
  id: number
  title?: string
  caption?: string
  imagePreviewUrl?: string
}

export type RetrospectiveData = {
  coupleName: string
  retrospectiveTitle: string
  subtitle: string
  songTitle: string
  artistName: string
  audioUrl: string
  startDate: string
  lyrics: string[]
  memories: RetrospectiveMemory[]
}

export const retrospectiveData: RetrospectiveData = {
  coupleName: 'Danilo & Amor',
  retrospectiveTitle: 'Nossa Retrospectiva',
  subtitle: 'Uma história, uma música e milhares de momentos.',
  songTitle: 'Nossa Música',
  artistName: 'Nossa História',
  audioUrl: '/music.mp3',
  startDate: '2022-06-12',

  lyrics: [
    'Desde o primeiro dia, tudo ficou diferente.',
    'Você chegou sem avisar e virou meu mundo.',
    'Cada momento contigo parece uma música boa.',
    'E se eu pudesse voltar no tempo, escolheria você de novo.',
    'Nossa história é meu lugar favorito.',
    'E eu quero escrever o resto dela do seu lado.',
  ],

  memories: [
    {
      id: 1,
      title: 'Nosso primeiro momento',
      caption: 'O começo de tudo.',
    },
    {
      id: 2,
      title: 'Uma lembrança especial',
      caption: 'Daquelas que ficam para sempre.',
    },
    {
      id: 3,
      title: 'Risadas sinceras',
      caption: 'A felicidade morando nos detalhes.',
    },
    {
      id: 4,
      title: 'Nosso lugar',
      caption: 'Onde o tempo passa diferente.',
    },
    {
      id: 5,
      title: 'Mais uma página',
      caption: 'Uma história escrita com carinho.',
    },
    {
      id: 6,
      title: 'Pra guardar no coração',
      caption: 'Porque algumas memórias viram lar.',
    },
  ],
}
