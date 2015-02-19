/*
    My Ping Pong version
*/
var animate = window.requestAnimationFrame || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
};

var canvas      = document.createElement("canvas");
var width       = innerWidth;
var height      = innerHeight;
canvas.width    = width;
canvas.height   = height;
var context     = canvas.getContext('2d');
var player      = new Player();
var computer    = new Computer();
var ball        = new Ball(width/2, height/2);
var sound = document.createElement("audio");
sound.setAttribute("src","sound.wav");
sound.preload;
var keysDown = {};

var render = function () {
    context.fillStyle = "#0091EA";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    // my code
    middle();
    ScorePc();
    ScoreUser();
    // my code
    ball.render();
};

var update = function () {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

var step = function () {
    update();
    render();
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

/*
    my code
*/


function middle(){
    context.fillStyle = "#81D4FA";
    context.fillRect(0, this.height/2, this.width, 5);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    userName = prompt("Please enter your name:", "User");
    if(userName == null){
        setCookie("username", "user", 365);
    }
    else {
        setCookie("username", userName, 365);
    }
    setCookie("scorePc", "0", 365);
    setCookie("scoreUser", "0", 365);
}

function ScoreUser(){
    p = getCookie("scoreUser");
    var user = getCookie("username");
    context.fillStyle = "#E1F5FE";
    context.textBaseline = "middle";
    context.font = "20px sans-serif";
    context.fillText( user + ": " + p, this.width/60, this.height-35 ); 
}

function ScorePc(){
    var pc = getCookie("scorePc");
    context.fillStyle = "#E1F5FE";
    context.textBaseline = "middle";
    context.font = "20px sans-serif";
    context.fillText( "Computer: " + pc, this.width-150, 35 );  
}

/*
    my code
*/

Paddle.prototype.render = function () {
    context.fillStyle = "#81D4FA";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > width) {
        this.x = width - this.width;
        this.x_speed = 0;
    }
};

function Computer() {
    this.paddle = new Paddle(width/2 - 50, 10, 100, 10);
}

Computer.prototype.render = function () {
    this.paddle.render();
};

Computer.prototype.update = function (ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if (diff < 0 && diff < -15) {
        diff = -15;// level/velocity
    } else if (diff > 0 && diff > 15) {
        diff = 15;// level/velocity
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > width) {
        this.paddle.x = width - this.paddle.width;
    }
};

function Player() {
    this.paddle = new Paddle(width/2 - 50, height - 20, 100, 10);
}

Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function () {
    for (var key in keysDown) {
        var value = Number(key);
        if (value == 37) {
            this.paddle.move(-15, 0);
        } else if (value == 39) {
            this.paddle.move(15, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 5;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 8, 2 * Math.PI, false);
    context.fillStyle = "#01579B";
    context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;  
    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > width) {
        this.x = width - 5;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0) {
        this.x_speed = 0;
        this.y_speed = 5;
        this.x = width/2;
        this.y = height/2;
        // my code
        i = getCookie("scoreUser");
        i++
        if( i == 5 ){
            
            setCookie("scorePc", "0", 365);
            setCookie("scoreUser", "0", 365);
            alert(getCookie("username")+' WIN !!');
            
        } else {
            
            setCookie("scoreUser", i, 365);
            
        } // my code
    }
    if (this.y > height) {
        this.x_speed = 0;
        this.y_speed = 5;
        this.x = width/2;
        this.y = height/2;
         // my code
        i= getCookie("scorePc");
        i++
        if( i == 5 ){
            
            setCookie("scorePc", "0", 365);
            setCookie("scoreUser", "0", 365);
            alert('Computer WIN !!');
            
        } else {
            
            setCookie("scorePc", i, 365);
            
        } // my code
        
    }

    if (top_y > height/2) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -5;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
            // my code
            sound.currentTime = 0;
            sound.play();
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 5;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
            // my code
            sound.currentTime = 0;
            sound.play();
        }
    }
};

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
// my code
window.onload = function () {

    "use strict";
    checkCookie()
    document.body.appendChild(canvas);
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    step();    
};
