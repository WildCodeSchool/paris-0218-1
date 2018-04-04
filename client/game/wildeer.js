const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let x = 470
let y2 = 250
const dx = -2
const dy2 = 1

const drawBuisson = () =>{
	ctx.beginPath()
	ctx.rect(x, 250 , 40, 40)
	ctx.fillStyle = "green"
	ctx.fill()
  	ctx.closePath()
		// setInterval(drawBuisson, 1)
}

const drawDeer = () =>{

	ctx.beginPath()
	ctx.rect(50, y2 , 40, 40)
	ctx.strokeStyle = "red"
	ctx.stroke()
	ctx.fillStyle = "orange"
	ctx.fill()
  	ctx.closePath()

}

const draw = () => {

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawBuisson()
	drawDeer()
	x += dx

	// if (y2 < 250)
	// 	y2 += dy2
	if(x > canvas.width || x < -40 ){
		x = canvas.width
	
	} 
}

//GLOBAL
let intervalId

document.addEventListener('keydown', (event) => {
	let keyName = event.key
	console.log('touche touchè')

	if (keyName != (' ')){ 
		// y2 = 250
	}
	else {
		y2 = 130
		//setinterval renvoit un ID pour chaque process envoyè
		 // setInterval(jump, 15)
		intervalId = setInterval(jump, 15)
		console.log(intervalId)
	}

})

const jump = () => {
	if (y2 < 240 )
		//clearInterval kill le process ID
		return clearInterval(intervalId)
	else{
		y2 = y2 + dy2
	}
}
setInterval(draw, 10)
