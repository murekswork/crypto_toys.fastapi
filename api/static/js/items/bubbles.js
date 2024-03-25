var canvas = document.getElementById('bubbleCanvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Bubble {

    constructor(x, y, radius, dx, dy, name, text, symbol) {

        this.x = x;
        this.name = name;
        this.text = text
        this.y = y;
        this.radius = radius;
        this.dx = dx*0.2;
        this.dy = dy*0.2;
        this.max_radius = window.innerWidth * 0.050;
        this.min_radius = window.innerWidth * 0.01;
        this.symbol = symbol
    }


       draw(isHovered) {
        this.radius = Math.abs(this.radius)

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Change appearance during hover state
        if (isHovered) {
          ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';  // Change color, adjust as needed
          ctx.shadowBlur = 20;  // Add shadow during hover
        } else {
          ctx.fillStyle = 'rgba(110,255,244, 0.6)';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.font = '15px red';
        ctx.fillText(this.symbol, this.x, this.y + (this.radius * 1.2))
        ctx.fillStyle = 'rgba(0,0,0)';  // Adjust text color as needed
        ctx.closePath();
    }

    handleCollision(otherBubble) {
      const dx = otherBubble.x - this.x;
      const dy = otherBubble.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const sumRadii = this.radius + otherBubble.radius;

      if (distance < (sumRadii/1.1)) {
        const overlap = sumRadii - distance;

        const angle = Math.atan2(dy, dx);
        const moveX = (overlap / 2) * Math.cos(angle);
        const moveY = (overlap / 2) * Math.sin(angle);

        this.x -= moveX * 0.1;
        this.y -= moveY * 0.1;
        otherBubble.x += moveX * 0.1;
        otherBubble.y += moveY * 0.1;

        const tempDx = this.dx;
        const tempDy = this.dy;
        this.dx = otherBubble.dx;
        this.dy = otherBubble.dy;
        otherBubble.dx = tempDx;
        otherBubble.dy = tempDy;
      }
    }

    update() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;

      if (this.x + this.radius > canvas.width) {
        this.x = canvas.width - this.radius;
      } else {
        this.x = this.radius;
      }
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;

      if (this.y + this.radius > canvas.height) {
        this.y = canvas.height - this.radius;
      } else {
        this.y = this.radius;
      }
    }

    for (let i = 0; i < bubbles.length; i++) {
      if (this !== bubbles[i]) {
        this.handleCollision(bubbles[i]);
      }
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }

}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < bubbles.length; i++) {
        bubbles[i].update();
    }
}

animate();

let selectedBubble = null;

canvas.addEventListener('mousedown', function(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    const distance = Math.sqrt(Math.pow(mouseX - bubble.x, 2) + Math.pow(mouseY - bubble.y, 2));

    if (distance < bubble.radius) {
      selectedBubble = bubble;
      break;
    }
  }
});

canvas.addEventListener('mouseup', function(event) {
  selectedBubble = null;
});

canvas.addEventListener('mousemove', function(event) {
  if (selectedBubble) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    const speed = 1;
    const angle = Math.atan2(mouseY - selectedBubble.y, mouseX - selectedBubble.x);
    selectedBubble.dx = Math.cos(angle) * speed;
    selectedBubble.dy = Math.sin(angle) * speed;
  }
});

canvas.addEventListener('click', function(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    const distance = Math.sqrt(Math.pow(mouseX - bubble.x, 2) + Math.pow(mouseY - bubble.y, 2));

    if (distance < bubble.radius) {
      console.log(`Clicked Bubble: Name - ${bubble.name}, Radius - ${bubble.radius}, Position - (${bubble.x}, ${bubble.y})`);
      action_coin_name = bubble.name
      coin_info_modal_manager.openCoinInfoModal(bubble.name)

      break;
    }
  }
});


function drawBubbles(data, field) {
    bubbles = [];
    
    data.sort((a, b) => parseFloat(a[field]) - parseFloat(b[field]));

    let quantiles = [];
    for (let i = 0; i < 7; i++) {
        quantiles.push(parseFloat(data[Math.floor(i * data.length / 7)][field]));
    }

    data.forEach((bubble, index) => {
        let radius;
        if (parseFloat(bubble[field]) <= quantiles[1]) {
            radius = 10;
        } else if (parseFloat(bubble[field]) <= quantiles[2]) {
            radius = 20;
        } else if (parseFloat(bubble[field]) <= quantiles[3]) {
            radius = 30;
        } else if (parseFloat(bubble[field]) <= quantiles[4]) {
            radius = 40;
        } else if (parseFloat(bubble[field]) <= quantiles[5]) {
            radius = 50;
        } else if (parseFloat(bubble[field]) <= quantiles[6]) {
            radius = 60;
        } else {
            radius = 70;
        }

        let x = Math.random() * (canvas.width);
        let y = Math.random() * (canvas.height);
        let dx = (Math.random() - 0.5) * 0.5;
        let dy = (Math.random() - 0.5) * 0.5;
        let name = bubble['id'];
        let text = bubble[field];
        let symbol = bubble['symbol'];

        bubbles.push(new Bubble(x, y, radius, dx, dy, name, text, symbol));
    });

    return bubbles;
}
