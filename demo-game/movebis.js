

document.addEventListener('keydown', (event) => {
	let keyName = event.key
	console.log(`touche touchè : ${keyName}`)
	decorMove()


	if (keyName != (' ')){ 
		console.log('Pas Jump')
	}
	else{
			console.log('Jump')
			jump()
			setTimeout(jumpDown, 400)

	console.log(document.getElementById("obstacle").offsetLeft)
	console.log(document.getElementById("obstacle").offsetTop)
	if (document.getElementById("obstacle").offsetTop = 168)
		setTimeout(decorReset, 3000)
	}
})

// const map = `
// 	00000000000000000000000000000000000000000000000000	
// 	00000000000000000000000000000000000000000000000000	
// 	00010000000000000000000000000000000200000000000000	
// 	00000000000000000000000000000000000200000000000000	
// 	00000000000000000002200000000000000200000000000000	
// 	00000000000000000002200000000000000200000000000000	
// `

// const p = { x: 3, y: 2 }

// map[y * 50 + x] = 1

const jumpDown = () => {
	document.getElementById("deer").style.transform = "translateY(0px)"
	setTimeout(changePicture, 400)
}

const jump = () => {
	document.getElementById("deer").style.transform = "translateY(-250px)"
	document.getElementById("deer").innerHTML = `<img src="deerjump.png">`
}
 
const changePicture = () =>	document.getElementById("deer").innerHTML = `<img src="deersol.png">` 			

const decorReset = () => document.getElementById("obstacle").style.left = '100px'
const decorMove = () => document.getElementById("obstacle").style.transform = "translateX(-700px)"
