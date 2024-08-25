import '../CSS/HomePage.css';  // Correct path to your CSS file

document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector<HTMLDivElement>('.interactive')!;
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(() => {
            move();
        });
    }

    function animateColors() {
        const colors = [
            'rgb(255, 182, 193)', // Light Pink
            'rgb(250, 213, 157)', // Light Peach
            'rgb(232, 204, 255)', // Light Purple
        ];

        let index = 0;

        function changeColor() {
            interBubble.style.background = `radial-gradient(circle at center, ${colors[index]} 0, rgba(${colors[index].replace(/rgb\(|\)/g, '')}, 0.2) 70%)`;
            index = (index + 1) % colors.length;
            setTimeout(changeColor, 3000); // Change color every 3 seconds
        }

        changeColor();
    }

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
    animateColors();
});
