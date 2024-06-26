const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8
canvas.height = innerHeight * 0.6;


c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7


class Fighter {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.LastKey
        this.attackBox = {
            position: {
                x: this.positionx,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking = false
        this.health = 100

    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, 50, this.height)
        if (this.isAttacking) {
            c.fillStyle = 'yellow'
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height)
        }


    }

    update() {
        this.draw()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }



    }

    attack() {
        this.isAttacking = true
        setTimeout(() => { this.isAttacking = false }, 100)

    }
}


const player = new Fighter({
    position: {
        x: canvas.width * 0.2,
        y: 400
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'green',
    offset: {
        x: 0,
        y: 0
    }

})

const enemy = new Fighter({
    position: {
        x: canvas.width * 0.8,
        y: 400
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})


console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        && rectangle1.isAttacking
    )
}
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#display').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#display').innerHTML = 'TIE'
    }
    else if (player.health > enemy.health) {
        document.querySelector('#display').innerHTML = 'PLAYER 1 WINS'
    }
    else if (player.health < enemy.health) {
        document.querySelector('#display').innerHTML = 'PLAYER 2 WINS'
    }
}


let timer = 100
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        document.querySelector('#display').style.display = 'flex'
        determineWinner({ player, enemy, timerId })
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()


    //Player movement
    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }
    //Enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowRight.pressed && enemy.LastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    } else if (keys.ArrowLeft.pressed && enemy.LastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    }

    //Collision
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 5
        document.querySelector('#enemy').style.width = enemy.health + '%'
    }

    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 5
        document.querySelector('#player').style.width = player.health + '%'
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }

}



animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            player.velocity.y = -20
            break

        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break

        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break

        case 'ArrowUp':
            enemy.velocity.y = -20
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.LastKey = 'ArrowRight'
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.LastKey = 'ArrowLeft'
            break
        case 'q':
            player.attack()
            break
        case 'e':
            enemy.attack()
            break
    }

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }

})

window.addEventListener('resize', resizeCanvas);