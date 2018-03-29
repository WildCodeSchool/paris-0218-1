const main = () => {
  fetch('http://localhost:3000/scores')
  .then(res => res.json())
  .then(scoresReceived)
}

const scoresReceived = scores => {

  const scoreTable = document.getElementById('scoring')
  scoreTable.innerHTML = JSON.stringify(scores)
  console.log(scores)
}

main()
