import React, {useState} from 'react'
import { submitFormToNetlify } from '../services/api'
import { useSelector, useDispatch } from 'react-redux'
import { closePopup } from '../store/popup/actions'

import './denunciationForm.css'

function DenunciationForm() {
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    submitFormToNetlify({ reason, comment, user }).then(
      () => setIsDone(true),
      err => setError(err)
    ).finally(() => setIsLoading(false))
  }

  return (
    <div className="denunciation-form">
      {isDone ?
      <div className="denunciation-form__done">
        Recebemos sua denúncia e iremos avaliá-la. Obrigado.
        <button className="denunciation-form__btn"
          onClick={() => dispatch(closePopup())}>Ok</button>
      </div> :

      <form className="denunciation-form__form" name="Denounce" 
        onSubmit={handleSubmit} method="post" 
        data-netlify="true" data-netlify-honeypot="bot-field">

          <input type="hidden" name="form-name" value="Denounce" />

          <div className="input-block">
            <label htmlFor="reason">Motivo</label>
            <select name="reason" id="reason"
              className={error && error.name === 'reason' ? 'error' : ''}
              value={reason}
              onChange={e => setReason(e.target.value)}>
                <option value="">-- Selecione --</option>
                <option value="does_not_exist">Restaurante não existe</option>
                <option value="offensive">Conteúdo ofensivo</option>
                <option value="other">Outro</option>
            </select>
          </div>
          
          <div className="input-block">
            <label htmlFor="comment">Comentário (Opcional)</label>
            <textarea name="comment" id="comment" rows="3"
              value={comment}
              onChange={e => setComment(e.target.value)}>
            </textarea>
          </div>

          <button className="denunciation-form__btn" type="submit">
            { !isLoading ?
            'Confirmar' :
            <div className="icon icon--loading"></div>
            }
          </button>
      </form>
      }
    </div>
  )
}

export default DenunciationForm