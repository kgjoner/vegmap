export const denunciationReasons = [
  'Restaurante não existe',
  'Não há opção vegana nem vegetariana',
  'Conteúdo ofensivo',
  'Outro',
]

export const errorMessages = {
  EMPTY_FIELD: {
    NAME: 'Informe o nome do restaurante.',
    TYPE: 'Informe o tipo do restaurante.',
    OPTION: 'O restaurante deve atender ao menos uma das opções.',
    FOODS: 'Informe ao menos uma comida oferecida.',
    ADDRESS: 'Informe o endereço do restaurante.',
    COORDS: 'Informe as coordenadas do restaurante.',
    REASON: 'Informe o motivo.'
  }
}

export const successMessages = {
  ADD_RESTAURANT: 'Restaurante adicionado!',
  UPDATE_RESTAURANT: 'Restaurante alterado!',
  DENUNCIATION: 'Denúncia recebida!',
  COPY_COORDS: 'Coordenadas copiadas!'
}

export const infoMessages = {
  OFFLINE: 'Não há conexão. O app continuará funcionando no modo offline.',
  ONLINE: 'Conexão restabelecida! O app volta a funcionar no modo online.'
}