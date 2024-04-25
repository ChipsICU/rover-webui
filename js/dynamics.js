// speedometer js elements
var speed = 0;
var prevSpeed = 0;
var currentScale = 1;
var scale = 2/3; // scale maped to speed. 1 corresponds to 180, 2/3 corresponds to 120
let intervalId = null;
// bar js elements
const progressbar = document.getElementById('brake-bar');
let height = 0;
let increasing = false;
// curve js elements
let time = 0;
let currentSteering = 0;
const speedData = {
    labels: [0],
    datasets: [{ label: 'Speed', data: [0], borderColor: 'blue', fill: false }]
};
const steeringData = {
    labels: [0],
    datasets: [{ label: 'Steering Angle', data: [0], borderColor: 'green', fill: false }]
};


function increaseSpeed(amount) {
    if (speed + amount <= 180) {
        speed = speed + amount;
        addClass();
        currentScale = currentScale + 1;
        changeActive();
        changeText();
    }
}

function decreaseSpeed(amount) {
    if (speed - amount >= 0) {
        speed = speed - amount;
        addClass();
        changeActive();
        currentScale = currentScale - 1;
        changeText();
    }
    else {
        speed = 0;
        // addClass();
        // changeActive();
        // currentScale = currentScale - 1;
        changeText();
    }
}

function addClass() {
    let newClass = "speed-" + speed;
    let prevClass = "speed-" + prevSpeed;
    let el = document.getElementsByClassName("arrow-wrapper")[0];
    if (el.classList.contains(prevClass)) {
        el.classList.remove(prevClass);
        el.classList.add(newClass);
    }
    prevSpeed = speed;
}

function changeActive() {
    // 清除所有刻度的激活状态
    for (let i = 0; i <= 180; i++) {
        let scaleElement = document.getElementsByClassName("speedometer-scale-" + i)[0];
        if (scaleElement && scaleElement.classList.contains("active")) {
            scaleElement.classList.remove("active");
        }
    }
    
    // 设置从1到当前速度的所有刻度为激活状态
    for (let i = 1; i <= speed; i++) {
        let scaleElement = document.getElementsByClassName("speedometer-scale-" + i)[0];
        if (scaleElement) {
            scaleElement.classList.add("active");
        }
    }
}

function changeText() {
    let el = document.getElementsByClassName("km")[0];
    el.innerText = (speed*scale).toFixed(2);
}

function gradualDecrease() {
    if (speed > 0) {
        decreaseSpeed(1); // 每次减少速度1
    } else {
        clearInterval(intervalId); // 如果速度为0或更小则清除定时器
        intervalId = null; // 重置 interval ID
    }
}

document.addEventListener('keydown', function(event) {
    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && intervalId === null) {
        if (event.key === "ArrowUp") {
            intervalId = setInterval(() => increaseSpeed(5), 100); // 按下向上箭头时每100ms增加5速度
        } else {
            intervalId = setInterval(() => decreaseSpeed(10), 100); // 按下向下箭头时每100ms减少10速度
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        clearInterval(intervalId); // 停止当前间隔
        if (event.key === "ArrowUp") {
            intervalId = setInterval(gradualDecrease, 100); // 如果释放了向上箭头，则开始逐渐减速
        } else {
            intervalId = null; // 对于向下箭头，重置 interval ID
        }
    }
});

/*-------------------------------------------------
------------------BAR JS---------------------------
--------------------------------------------------*/

// 监听键盘按下事件
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        // 当按下上箭头键，重置进度条高度为0
        height = 0;
        progressbar.style.height = height + 'px';
    } else if (event.key === 'ArrowDown') {
        // 当按下下箭头键，开始增加进度条的高度
        increasing = true;
    }
});

// 监听键盘松开事件
document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowDown') {
        // 当松开下箭头键，停止增加进度条的高度
        increasing = false;
    }
});

// 定义函数来增加或减少进度条的高度
function increaseHeight() {
    if (increasing && height < 220) {
        // 如果正在增加且高度小于100px，每次增加5px
        height += 5;
        progressbar.style.height = height + 'px';
    } else if (!increasing && height > 0) {
        // 如果不再增加且高度大于0px，每次减少5px
        height -= 2;
        progressbar.style.height = height + 'px';
    }
}

// The increaseHeight function is called every 50 
// milliseconds to adjust the progress bar height.
setInterval(increaseHeight, 50);

/*-------------------------------------------------
--------------------curve JS-----------------------
--------------------------------------------------*/
const speedChart = new Chart(document.getElementById('curve-speed').getContext('2d'), {
    type: 'line',
    data: speedData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },

        },
        scales: {
            x: {
                type: 'linear',
                min: 0,
                max: 10, // Start with 10 seconds window
                ticks: { stepSize: 1,
                    callback: (value) => value.toFixed(1)
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => value.toFixed(1) // Limit to 1 decimal place
                }
            }
        }
    }
});

const steeringChart = new Chart(document.getElementById('curve-steering').getContext('2d'), {
    type: 'line',
    data: steeringData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            
        },
        scales: {
            x: {
                type: 'linear',
                min: 0,
                max: 10,
                ticks: { stepSize: 1,
                    callback: (value) => value.toFixed(1)
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => value.toFixed(1) // Limit to 1 decimal place
                }
            }
        }
    }
});

const updateCharts = () => {
    time += 0.1;
    speedData.labels.push(time);
    speedData.datasets[0].data.push(speed);
    steeringData.labels.push(time);
    steeringData.datasets[0].data.push(currentSteering);

    // Set time window to 60 seconds or less depending on the current time
    const windowSize = Math.min(time, 60);
    speedChart.options.scales.x.min = Math.max(0, time - windowSize);
    speedChart.options.scales.x.max = time;
    steeringChart.options.scales.x.min = Math.max(0, time - windowSize);
    steeringChart.options.scales.x.max = time;

    speedChart.update();
    steeringChart.update();
};

// Set interval to update the charts every 0.1 seconds
setInterval(updateCharts, 100);

const handleKeyDown = (event) => {
    switch (event.key) {
        // case 'ArrowUp':
        //     speed += 1; // Increase speed
        //     break;
        // case 'ArrowDown':
        //     speed -= 1; // Decrease speed
        //     break;
        case 'ArrowLeft':
            currentSteering -= 1; // Turn left
            break;
        case 'ArrowRight':
            currentSteering += 1; // Turn right
            break;
        default:
            break;
    }
};

const handleKeyUp = (event) => {
    switch (event.key) {
        // case 'ArrowUp':
        // case 'ArrowDown':
        //     speed = Math.max(0, speed); // Ensure speed doesn't go negative
        //     break;
        case 'ArrowLeft':
        case 'ArrowRight':
            currentSteering = Math.max(-90, Math.min(90, currentSteering)); // Limit steering angle
            break;
        default:
            break;
    }
};

// Add event listeners for keyboard input
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
