// Get the canvas element and its context
var canvas = document.getElementById('bubbleCanvas');
var ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define the bubble class
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


        // Draw the text separately to prevent it from being affected by the shadow
        ctx.beginPath();
        ctx.font = '15px red';
        ctx.fillText(this.symbol, this.x, this.y + (this.radius * 1.2))
        ctx.fillStyle = 'rgba(0,0,0)';  // Adjust text color as needed
        ctx.closePath();


      // ... (other methods)
    }

    handleCollision(otherBubble) {
      const dx = otherBubble.x - this.x;
      const dy = otherBubble.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const sumRadii = this.radius + otherBubble.radius;

      if (distance < (sumRadii/1.1)) {
        // Bubbles are colliding, handle collision logic here

        // Calculate the overlap distance
        const overlap = sumRadii - distance;

        // Move the bubbles away from each other based on overlap
        const angle = Math.atan2(dy, dx);
        const moveX = (overlap / 2) * Math.cos(angle);
        const moveY = (overlap / 2) * Math.sin(angle);

        this.x -= moveX * 0.1;
        this.y -= moveY * 0.1;
        otherBubble.x += moveX * 0.1;
        otherBubble.y += moveY * 0.1;

        // Example: Swap velocities for a simple bounce effect
        const tempDx = this.dx;
        const tempDy = this.dy;
        this.dx = otherBubble.dx;
        this.dy = otherBubble.dy;
        otherBubble.dx = tempDx;
        otherBubble.dy = tempDy;
      }
    }

    update() {
    // Check if the bubble is about to go out of the canvas
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      // Reverse the x-velocity to bounce off the vertical edges
      this.dx = -this.dx;

      // Adjust the position to keep the bubble inside the canvas
      if (this.x + this.radius > canvas.width) {
        this.x = canvas.width - this.radius;
      } else {
        this.x = this.radius;
      }
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      // Reverse the y-velocity to bounce off the horizontal edges
      this.dy = -this.dy;

      // Adjust the position to keep the bubble inside the canvas
      if (this.y + this.radius > canvas.height) {
        this.y = canvas.height - this.radius;
      } else {
        this.y = this.radius;
      }
    }

    // Check for collisions with other bubbles
    for (let i = 0; i < bubbles.length; i++) {
      if (this !== bubbles[i]) {
        this.handleCollision(bubbles[i]);
      }
    }

    // Update the position
    this.x += this.dx;
    this.y += this.dy;

    // Draw the bubble
    this.draw();
  }

}

// Create an array to store the bubbles


// Create bubbles and add them to the array

// Animation loop
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

  // Check if the mouse is over any bubble
  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    const distance = Math.sqrt(Math.pow(mouseX - bubble.x, 2) + Math.pow(mouseY - bubble.y, 2));

    if (distance < bubble.radius) {
      // Set the selected bubble
      selectedBubble = bubble;
      break;
    }
  }
});

canvas.addEventListener('mouseup', function(event) {
  // Reset the selected bubble
  selectedBubble = null;
});

canvas.addEventListener('mousemove', function(event) {
  if (selectedBubble) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Move the selected bubble toward the mouse
    const speed = 1; // You can adjust the speed
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
      // Bubble is clicked, log its information to the console
      console.log(`Clicked Bubble: Name - ${bubble.name}, Radius - ${bubble.radius}, Position - (${bubble.x}, ${bubble.y})`);
      action_coin_name = bubble.name
      coin_info_modal_manager.openCoinInfoModal(bubble.name)

      break;  // If you want to log only the top bubble (in case of overlapping bubbles), remove this line
    }
  }
});


function drawBubbles(data, field) {
    bubbles = [];

    // Sort the data based on the field value
    data.sort((a, b) => parseFloat(a[field]) - parseFloat(b[field]));

    // Calculate quantiles for determining bubble sizes
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
