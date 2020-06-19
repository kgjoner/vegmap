import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closePopup } from '../../store/popup/actions'
import { denounceRestaurant } from '../../store/restaurant/actions'
import { denunciationReasons } from '../../constants'

import Button from '../../components/Button'
import Select from '../../components/Select'
import './denunciationForm.css'


function DenunciationForm() {
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [wasDispatched, setWasDispatched] = useState(false)

  const user = useSelector(state => state.user.user)
  const restaurant = useSelector(state => state.restaurant.selectedRestaurant)
  const isLoading = useSelector(state => state.restaurant.denouncing)
  const error = useSelector(state => state.restaurant.error)
  const dispatch = useDispatch()

  useEffect(() => {
    setWasDispatched(false)
  }, [error, setWasDispatched])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(denounceRestaurant({ reason, comment, restaurant, user }))
    setWasDispatched(true)
  }

  return (
    <div className="denunciation-form">
      
      {wasDispatched && !isLoading && !error

      ? <div className="denunciation-form__done">
          Recebemos sua denúncia e iremos avaliá-la. Obrigado.
          <Button variant="primary"
            text="Ok"
            onClick={() => dispatch(closePopup())}
            fullWidth />
        </div>

      : <form className="denunciation-form__form" name="denounce" 
          onSubmit={handleSubmit} 
          data-netlify="true" data-netlify-honeypot="bot-field">

            <input type="hidden" name="form-name" value="denounce" />

            <Select id="reason"
              label="Motivo"
              value={reason}
              setValue={setReason}
              error={error}
              options={denunciationReasons}
            />
            
            <div className="denunciation-form__group">
              <label htmlFor="comment">Comentário (Opcional)</label>
              <textarea name="comment" id="comment" rows="3"
                value={comment}
                onChange={e => setComment(e.target.value)}>
              </textarea>
            </div>

            <Button type="submit"
              variant="primary"
              text="Confirmar"
              isLoading={isLoading}
              fullWidth thick />

        </form>
      }
    </div>
  )
}

export default DenunciationForm