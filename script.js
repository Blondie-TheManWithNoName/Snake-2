
const speed = 2;
const radius = 5;
class Ball {
    constructor(pos, id)
    {
        if (id <= 65)
        this.pos = {x: pos.x, y:pos.y + id*speed};
    else
    this.pos = {x: pos.x, y:pos.y};
        this.id = id;
        // this.add = {x: id*5, y: id*5};
        this.add = {x: 0, y: 0};
    }
    
    changeAdd(add)
    {
        this.add = add;
    }

    move()
    {
        this.pos.x += addX;
        this.pos.y += addY;
    }

    calculateAdd(x, y)
    {
    // Calculate the direction vector
    let directionX = x - this.posX;
    let directionY = y - this.posY;
    
    // Calculate the distance
    let distance = Math.sqrt(directionX * directionX + directionY * directionY);
    
    // Normalize the direction vector
    directionX /= distance;
    directionY /= distance;
    
    // Calculate the new position
    this.addX = directionX * speed;
    this.addY = directionY * speed;
    }

}

class Snake {
    constructor(length, iniPos)
    {
        this.snake = [];
        for (let i = 0; i < length; ++i)
            this.snake.push(new Ball(iniPos, i));
    }

    move(add)
    {
        for (let i=this.snake.length - 1; i > 0 ; --i)
        {
            this.snake[i].pos.x = this.snake[i - 1].pos.x;
            this.snake[i].pos.y = this.snake[i - 1].pos.y;
            paintBall(this.snake[i]);
        }
        this.snake[0].move();
        paintBall(this.snake[0]);
        // console.log(this.snake[0].id, this.snake[0].pos.y)
        // debugger;

    }

    eat()
    {
        if (this.collision(apples[0]))
        {
            apples.pop();
            for (let i = 0; i < 10; ++i)
                this.snake.push(new Ball(this.snake[this.snake.length - 1].pos, this.snake.length - 1));
        }
    }
    
    paint()
    {
        for (const ball of this.snake)
            paintBall(ball);
    }

    selfBite()
    {
    if (this.snake.length > 65)
    {        
        // Check if the head collides with any part of the snake's body
        for (let i = 66; i < this.snake.length; i++) {
            const bodyPart = this.snake[i];
            if (this.collision(bodyPart.pos))
                return true;
            
        }
        
    }
        // No self-bite detected
        return false;
    }

    collision(pos)
    {
    return (Math.abs(this.snake[0].pos.x - pos.x) < 8 && Math.abs(this.snake[0].pos.y - pos.y) < 8);
    }

}

function paintBall (ball)
{
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#BF212F";
    ctx.fill();

}

const size = window.innerHeight*0.9;

var c = document.getElementById("canvas");

c.height = (size);
c.width = (size);
var ctx = c.getContext("2d");

var length = 66;

const cRect = c.getBoundingClientRect();

const offsetX = cRect.left;
const offsetY = cRect.top;
var posX = size*0.3;
var posY = size*0.5;

var snake = new Snake(length, {x: posX, y: posY});
var posX = size*0.7;
var snakeBlue = new Snake(length, {x: posX, y: posY});


// ctx.beginPath();
// ctx.arc(posX, posY, 5, 0, Math.PI * 2, true); // Outer circle

// ctx.fill();

snake.paint();
snakeBlue.paint();

var addX = 0;
var addY = 0;
var start = true;


var lastClickedXRed;
var lastClickedYRed;

var lastClickedXBlue;
var lastClickedYBlue;

c.addEventListener('contextmenu', (e) => {


    e.preventDefault();
    lastClickedXBlue = Math.round(e.clientX - offsetX);
    lastClickedYBlue = Math.round(e.clientY - offsetY);
});
c.addEventListener("click", (e) => {

    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    lastClickedXRed = Math.round(e.clientX - offsetX);
    lastClickedYRed = Math.round(e.clientY - offsetY);
    calculateAdd();
    if (start) requestAnimationFrame(draw);
    // else debugger;
    start = false;
    
    
});

var targetAngleRadians;
var currentAngleRadians;
var angleDelta;


function calculateAdd()
{
    // Calculate the direction vector
    let directionX = lastClickedXRed - snake.snake[0].pos.x;
    let directionY = lastClickedYRed - snake.snake[0].pos.y;
    endPos = {x: snake.snake[0].pos.x, y:snake.snake[0].pos.y};
    
    let directionXB = snake.snake[0].pos.x - snake.snake[1].pos.x;
    let directionYB = snake.snake[0].pos.y - snake.snake[1].pos.y;
    
    // Calculate the distance
    let distance = Math.sqrt(directionX * directionX + directionY * directionY);
    
    // Normalize the direction vector
    directionX /= distance;
    directionY /= distance;
    // Calculate the angle in radians
    targetAngleRadians = Math.atan2(directionY, directionX);
    currentAngleRadians = Math.atan2(directionYB, directionXB);
    
    // Smoothly interpolate between the current angle and the target angle

    angleDelta = targetAngleRadians - currentAngleRadians;
    angleDelta = (angleDelta + 2 * Math.PI) % (2 * Math.PI);

    // debugger;
    rotation();
    
}

let tolerance = 0.09;

function rotation()
{  
    
    let rotationSpeed = 0.09;
    if (Math.abs(angleDelta) > rotationSpeed) {
        let sign = (angleDelta < Math.PI) ? 1 : -1;
        currentAngleRadians += sign * rotationSpeed;

        if (Math.abs(currentAngleRadians - targetAngleRadians) <= tolerance) 
        {
            currentAngleRadians = targetAngleRadians;
        }


    } else {
        currentAngleRadians = targetAngleRadians;
    }


    // Calculate the new position

    // if ( Math.cos(currentAngleRadians) <= directionX) 
    // console.log("current", currentAngleRadians);

        addY = Math.sin(currentAngleRadians) * speed;
        addX = Math.cos(currentAngleRadians) * speed;

    // if ( Math.sin(currentAngleRadians) <= directionY) 
}

document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
      debugger;
    }
  }

var timer = 0;
var fps = 60;
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    generateApple();
    snake.move({x: addX, y: addY});
    snake.eat();
    // ++timer;
    // posX += addX;
    // posY += addY;
    if (xOut(snake.snake[0].pos.x) || yOut(snake.snake[0].pos.y) || snake.selfBite())
    {
        console.log("LOST");
    }
    else
    {
        setTimeout(function() {
            requestAnimationFrame(draw);
            // rotation();
            // console.log("if", targetAngleRadians);
            if (currentAngleRadians != targetAngleRadians)
            {
                calculateAdd();   
            }
            // ... Code for Drawing the Frame ...
     
        }, 1000 / fps);
    } 
  }


function xOut(x)
{
    return (x + radius < (cRect.left - offsetX) || x + radius > (cRect.right - offsetX)
        || x - radius < (cRect.left - offsetX) || x - radius > (cRect.right - offsetX))
}
function yOut(y)
{
    return (y + radius < (cRect.top - offsetY) || y + radius > (cRect.bottom - offsetY)
        || y - radius < (cRect.top - offsetY) || y - radius > (cRect.bottom - offsetY))
}





var apples = []
function generateApple()
{
    if (apples.length <= 0)
    {

        apples.push({x: Math.random() * (cRect.right - cRect.left - offsetX * 2) + (cRect.left + offsetX),
            y: Math.random() * (cRect.bottom - cRect.top - offsetY * 2) + (cRect.top + offsetY)});
    }
    ctx.beginPath();
    ctx.arc(apples[0].x, apples[0].y, radius*1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#27B376";
    ctx.fill();
}
