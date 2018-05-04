const formatedDate = date => {
  const d = new Date(date)
  const jj = d.getDate()
  const mm = d.getMonth()
  const yyyy = d.getFullYear()
  const hh = d.getHours()
  const min = d.getMinutes()
  return `${jj} / ${mm} / ${yyyy} - ${hh} : ${min}`
}

export const createUserScoreRow = score => `
  <tr>
    <td>${formatedDate(score.date)}</td>
    <td>${score.score}</td>
    <td>${score.nbSocks}</td>
  </tr>
`
