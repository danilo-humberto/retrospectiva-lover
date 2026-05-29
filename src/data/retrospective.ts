export type RetrospectiveMemory = {
  id: number
  imageUrl?: string
  imagePreviewUrl?: string
}

export type RetrospectiveData = {
  id?: string
  slug?: string
  createdAt?: string
  coupleName: string
  retrospectiveTitle: string
  subtitle: string
  coverUrl?: string
  coverPreviewUrl?: string
  storyPhotoUrl?: string
  storyPhotoPreviewUrl?: string
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
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ],
}
