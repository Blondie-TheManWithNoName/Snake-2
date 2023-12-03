
const speed = 2;
const radius = 5;
var score = 0;

var clickAnimation = 0;

class Ball {
    constructor(pos, id)
    {
        if (id <= 65)
            this.pos = {x: pos.x, y:pos.y};
        else
            this.pos = {x: pos.x, y:pos.y};
        this.id = id;
    }

    move(add)
    {
        this.pos.x += add.x;
        this.pos.y += add.y;
    }

    paint(color)
    {
        ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
        ctx.fill();
    }

}

class Snake {
    constructor(length, iniPos, clicked, color)
    {
        this.snake = [];
        this.turn = true;
        this.add = {x: 0, y: 0};
        this.rotSpeed = 0.09;
        this.color = color
        this.reached = false;

        this.clicked = {x: clicked.x, y: clicked.y};


        for (let i = 0; i < length; ++i)
            this.snake.push(new Ball(iniPos, i));
    }


    calculateMovement()
    {
        if (this.turn)
        {
            
            // Calculate the direction vector
            let targetDir = {x: this.clicked.x - this.snake[0].pos.x, y:this.clicked.y - this.snake[0].pos.y};
        let currentDir = {x: this.snake[0].pos.x - this.snake[1].pos.x,  y:this.snake[0].pos.y - this.snake[1].pos.y};
        
        // Calculate the distance
        let distance = Math.sqrt(targetDir.x * targetDir.x + targetDir.y * targetDir.y);
        
        // Normalize the direction vector
        targetDir.x /= distance;
        targetDir.y /= distance;

        // Calculate the angle in radians
        let targetAngle = Math.atan2(targetDir.y, targetDir.x);
        let currentAngle = Math.atan2(currentDir.y, currentDir.x);


            let deltaAngle = targetAngle - currentAngle;
            deltaAngle = (deltaAngle + 2 * Math.PI) % (2 * Math.PI);
            
            if (Math.abs(deltaAngle) > this.rotSpeed) {
                let sign = (deltaAngle < Math.PI) ? 1 : -1;
            currentAngle += sign * this.rotSpeed;
        } else
        {
            currentAngle = targetAngle;
            this.turn = false;
        }
            
            // Calculate the new position
            this.changeAdd(Math.cos(currentAngle) * speed, Math.sin(currentAngle) * speed);
        }
    }
    
    paintClick()
    {
        ctx.beginPath();
        ctx.arc(this.clicked.x, this.clicked.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.clicked.x, this.clicked.y, radius - 0.1*clickAnimation, 0, Math.PI * 2);
        ctx.stroke();
        
        if (clickAnimation >= 50)
            clickAnimation = 0;
        ++clickAnimation;
    }

    move()
    {
        for (let i=this.snake.length - 1; i > 0 ; --i)
        {
            this.snake[i].pos.x = this.snake[i - 1].pos.x;
            this.snake[i].pos.y = this.snake[i - 1].pos.y;
            // (i%2 === 0) ? this.snake[i].paint("#BF212F") : 
            this.snake[i].paint(this.color);
        }
        if (!this.reached) this.paintClick();
        this.snake[0].move(this.add);
        this.snake[0].paint(this.color);
        if (Math.abs(Math.abs(this.snake[0].pos.x) - Math.abs(this.clicked.x)) < speed && Math.abs(Math.abs(this.snake[0].pos.y) - Math.abs(this.clicked.y)) < speed) this.reached = true;
    }

    eat()
    {
        if (this.collision(apples[0]))
        {
            document.getElementById("score").textContent = ++score;
            apples.pop();
            this.addTail(10);
        
            
            return true;
        }

        return false;
    }

    addTail(num)
    {
        for (let i = 0; i < num; ++i)
            this.snake.push(new Ball(this.snake[this.snake.length - 1].pos, this.snake.length - 1))
    }
    
    paint()
    {
        for (const ball of this.snake)
            ball.paint("#BF212F");
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
        const directionX = this.snake[0].pos.x - pos.x;
        const directionY = this.snake[0].pos.y - pos.y;
        return ((directionX * directionX + directionY * directionY) < (radius*radius*4)) 
    }
 
    changeAdd(x, y)
    {
        this.add.x = x;
        this.add.y = y;
    }

}

const size = window.innerHeight*0.8;

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

var snake = new Snake(length, {x: posX - 10, y: posY - 10}, {x: posX, y: posY}, "#E84118");
var posX = size*0.7;
var snakeBlue = new Snake(length, {x: posX + 10, y: posY + 30}, {x: posX, y: posY - 10}, "#2B59C3");


var addX = 0;
var addY = 0;
var start = true;

if (start)
{
    for (const ball of snake.snake)
    {
        snake.move(); 
        snake.calculateMovement();

        snakeBlue.move(); 
        snakeBlue.calculateMovement();
    }
    requestAnimationFrame(draw);

}
var mouseDown = false;
var rightDown = false;

c.onmousedown = function (e) {

    console.log("mousedown");
    if (e.button === 0)
        mouseDown = true;
    else if (e.button === 2)
        rightDown = true;
};

c.onmouseup = function (e) {

    if (e.button === 0)
        mouseDown = false;
    else if (e.button === 2)
        rightDown = false;
    console.log("mouseup");
}

c.onmousemove = function(e) {
    
    if (mouseDown) 
    {
        snake.clicked.x = Math.round(e.clientX - offsetX);
        snake.clicked.y = Math.round(e.clientY - offsetY);

        snake.calculateMovement();
        start = false;
        snake.turn = true;
        snake.reached = false;
    }
    else if (rightDown)
    {
        snakeBlue.clicked.x = Math.round(e.clientX - offsetX);
        snakeBlue.clicked.y = Math.round(e.clientY - offsetY);
        snakeBlue.calculateMovement();
        console.log(snakeBlue.clicked.x, snakeBlue.clicked.y);
        
        start = false;
        snakeBlue.turn = true;
        snakeBlue.reached = false; 
    }
}

c.addEventListener('contextmenu', (e) => {


    e.preventDefault();
    snakeBlue.clicked.x = Math.round(e.clientX - offsetX);
    snakeBlue.clicked.y = Math.round(e.clientY - offsetY);
    snakeBlue.calculateMovement();
    console.log(snakeBlue.clicked.x, snakeBlue.clicked.y);
    start = false;
    snakeBlue.turn = true;
    snakeBlue.reached = false;
});
c.addEventListener("click", (e) => {

    if (!space)
    {

        snake.clicked.x = Math.round(e.clientX - offsetX);
        snake.clicked.y = Math.round(e.clientY - offsetY);

        snake.calculateMovement();
        start = false;
        snake.turn = true;
        snake.reached = false;
    }
    else
    {

        snakeBlue.clicked.x = Math.round(e.clientX - offsetX);
        snakeBlue.clicked.y = Math.round(e.clientY - offsetY);
        snakeBlue.calculateMovement();
        console.log(snakeBlue.clicked.x, snakeBlue.clicked.y);
        
        start = false;
        snakeBlue.turn = true;
        snakeBlue.reached = false;
    }
        
    
    
});
var space = false;

document.body.onkeydown = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
        if (!space) space = true;
    //   debugger;
    }
  }

  document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
        if (space) space = false;
    //   debugger;
    }
  }

var timer = 0;
var fps = 75;
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    generateApple();
    snake.move();
    if (snake.eat())
        snakeBlue.addTail(5);



    snakeBlue.move();
    if (apples.length > 0)
        snakeBlue.eat();
    // ++timer;
    // posX += addX;
    // posY += addY;
    

    if (xOut(snake.snake[0].pos.x) || yOut(snake.snake[0].pos.y) || snake.selfBite() ||
    xOut(snakeBlue.snake[0].pos.x) || yOut(snakeBlue.snake[0].pos.y) || snakeBlue.selfBite() ||
    biteOther(snake, snakeBlue) || biteOther(snakeBlue, snake))
    {
        console.log("LOST");
    }
    else
    {
        setTimeout(function() {
            requestAnimationFrame(draw);
            // rotation();
            // console.log("if", targetAngleRadians);
                snake.calculateMovement(); 
                snakeBlue.calculateMovement();   
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



function biteOther(snake1, snake2)
{
    // Check if the head collides with any part of the snake's body
    for (let i = 0; i < snake2.snake.length; i++) {
        const bodyPart = snake2.snake[i];
        if (snake1.collision(bodyPart.pos))
            return true;
    }   

    // No self-bite detected
    return false;
}



var apples = []
function generateApple()
{
    if (apples.length <= 0)
    {
        let min = 50; 
        let max = size - 50;
        apples.push({x: Math.random() * (max - min + 1) + min, y: Math.random() * (max - min + 1) + min});
    }
    ctx.beginPath();
    ctx.arc(apples[0].x, apples[0].y, radius*1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#009432";
    ctx.fill();
}
