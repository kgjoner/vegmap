import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closePopup } from '../store/popup/actions'

import './denunciationForm.css'
import { denounceRestaurant } from '../store/restaurant/actions'

function DenunciationForm() {
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [wasDispatched, setWasDispatched] = useState(false)

  const user = useSelector(state => state.user.user)
  const restaurant = useSelector(state => state.restaurant.selectedRestaurant)
  const isLoading = useSelector(state => state.restaurant.denouncing)
  const error = useSelector(state => state.restaurant.error)
  const dispatch = useDispatch()

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(denounceRestaurant({ reason, comment, restaurant, user }))
    setWasDispatched(true)
  }

  return (
    <div className="denunciation-form">
      {wasDispatched && !isLoading && !error ?
      <div className="denunciation-form__done">
        Recebemos sua denúncia e iremos avaliá-la. Obrigado.
        <button className="denunciation-form__btn"
          onClick={() => dispatch(closePopup())}>Ok</button>
      </div> :

      <form className="denunciation-form__form" name="denounce" 
        onSubmit={handleSubmit} 
        data-netlify="true" data-netlify-honeypot="bot-field">

          <input type="hidden" name="form-name" value="denounce" />

          <div className="input-block">
            <label htmlFor="reason">Motivo</label>
            <select name="reason" id="reason"
              className={error && error.name === 'reason' ? 'error' : ''}
              value={reason}
              onChange={e => setReason(e.target.value)}>
                <option value="">-- Selecione --</option>
                <option value="restaurante não existe">
                  Restaurante não existe
                </option>
                <option value="não há opção vegana nem vegetariana">
                  Não há opção vegana nem vegetariana
                </option>
                <option value="conteúdo ofensivo">
                  Conteúdo ofensivo
                </option>
                <option value="outro">
                  Outro
                </option>
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