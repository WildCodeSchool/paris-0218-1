const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let x = 470
let y = 250
const dx = -2
const dy = 0 

const drawBuisson = () =>{
	ctx.beginPath()
	ctx.rect(x, y , 40, 40)
	ctx.fillStyle = "green"
	ctx.fill()
	ctx.closePath()
}


const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawBuisson()
	x += dx
	y += dy

	if(x > canvas.width || x < -40 ){
		x = canvas.width  
		// setInterval(draw, 1)
	}
}
setInterval(draw, 10)
