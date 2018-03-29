const main = () => {
  fetch('http://localhost:3000/scores')
  .then(res => res.json())
  .then(scoresReceived)
}
/*
const fetch = (url, fn) => {
  const response = request(url)
  ...
  fn(response)
}
*/
const scoresReceived = scores => {

  const scoreTable = document.getElementById('scoring')
  scoreTable.innerHTML = JSON.stringify(scores)
  console.log(scores)
}

main()
