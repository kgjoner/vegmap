export default function runActionsOnReducer(actions, reducer, state) {
  actions.forEach(action => {
    state = reducer(state, action)
  })
  return state
}