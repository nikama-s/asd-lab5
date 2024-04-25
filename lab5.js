function selfConnection(i, angle, x, y, color) {
    let offsetX;
    ctx.strokeStyle = color;
    if ((x > canvas.width / 2)) {
        offsetX = 40;
    } else {
        offsetX = -40;
    }
    x += offsetX;
    ctx.beginPath();
    ctx.arc(x, y - 15, 20, Math.PI / 1.3, Math.PI * 6.5 / 2);
    ctx.stroke();
    ctx.closePath();
    drawArrow(x, y + 6, angle, color);

}
function drawArrow(x, y, angle, color) {
    const arrowheadSize = 10;
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowheadSize, arrowheadSize / 2);
    ctx.lineTo(-arrowheadSize, -arrowheadSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
function drawNode(i, array, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(array[i].x, array[i].y, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.font = '30px Times New Roman';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${i + 1}`, array[i].x, array[i].y);
}
function drawConnection(i, j, nodePositions, matrix, color) {
    if (matrix[i][j] === 1 && i <= 10) {
        const nodePosI = nodePositions[i];
        const nodePosJ = nodePositions[j];
        const midX = (nodePosI.x + nodePosJ.x) / 2;
        const midY = (nodePosI.y + nodePosJ.y) / 2;
        ctx.beginPath();
        ctx.moveTo(nodePosJ.x, nodePosJ.y);
        if (midX === nodePositions[10].x && midY === nodePositions[10].y && nodePosI !== nodePositions[10]) {
            drawBentConnection(i, j, midX, midY, nodePosI, nodePosJ, 1, color);
        } else if (i !== j) {
            drawRegularConnection(i, j, midX, midY, nodePosI, nodePosJ, 1, color);
        } else {
            let angle;
            if (nodePosI.x <= canvas.width / 2) angle = Math.PI / 6
            else angle = Math.PI * 7 / 8;
            selfConnection(i, angle, nodePosI.x, nodePosI.y, color);
        }
    }
}
function drawBentConnection(i, j, midX, midY, nodePosI, nodePosJ, a, color) {
    let angle;
    ctx.strokeStyle = color;
    if (i === 0 || j === 0) {
        ctx.lineTo(midX, nodePosI.y + 50);
        ctx.moveTo(midX, nodePosI.y + 50);
        ctx.lineTo(nodePosI.x, nodePosI.y);
        ctx.stroke();
        angle = Math.atan2(nodePosJ.y - nodePosI.y * 5 / 4, nodePosJ.x - nodePosI.x);
    } else {
        ctx.lineTo(nodePosI.x - 20, midY);
        ctx.moveTo(nodePosI.x - 20, midY);
        ctx.lineTo(nodePosI.x, nodePosI.y);
        ctx.stroke();
        angle = Math.atan2(midY - nodePosI.y, nodePosJ.x - nodePosI.x);
    }
    const offsetX = Math.cos(angle) * 40;
    const offsetY = Math.sin(angle) * 40;
    if (a === 1) drawArrow(nodePosJ.x - offsetX, nodePosJ.y - offsetY, angle, color);
}

function drawRegularConnection(i, j, midX, midY, nodePosI, nodePosJ, a, color) {
    ctx.strokeStyle = color;
    if ((nodePosJ.x < centerX / 2 && nodePosI.x < centerX / 2) || (nodePosJ.x > centerX / 2 && nodePosI.x > centerX / 2)) {
        ctx.lineTo(nodePosI.x + 20, nodePosI.y);
    } else {
        ctx.lineTo(nodePosI.x, nodePosI.y + 20);
    }
    ctx.stroke();
    const angle = Math.atan2(nodePosJ.y - nodePosI.y, nodePosJ.x - nodePosI.x);
    const offsetX = Math.cos(angle) * 40;
    const offsetY = Math.sin(angle) * 40;
    if (a === 1) drawArrow(nodePosJ.x - offsetX, nodePosJ.y - offsetY, angle, color);
}

function PRNG(seed) {
    this.seed = seed;
    const m = Math.pow(2, 31);

    this.next = function () {
        this.seed = (1103515245 * this.seed + 12345) % m;
        return (this.seed / m) * 2;
    };
}

const prng = new PRNG(3317);
const n1 = 3;
const n2 = 3;
const n3 = 1;
const n4 = 7;
const n = 10 + n3;

let matrix2 = [];
const k = 1 - n3 * 0.01 - n4 * 0.005 - 0.15;
for (let i = 0; i < n; i++) {
    matrix2[i] = [];
    for (let j = 0; j < n; j++) {
        let num = prng.next();
        matrix2[i][j] = Math.floor(num * k);
    }
}

console.log(`Directed graph matrix: `);
console.log(matrix2);
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
let radius = 300;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const angleIncrement = (2 * Math.PI) / (n - 1);
const nodePositions2 = [];
for (let i = 0; i < n - 1; i++) {
    const x = centerX - radius * Math.cos(i * angleIncrement);
    const y = centerY - radius * Math.sin(i * angleIncrement);
    nodePositions2.push({x: x, y: y});
}
nodePositions2.push({x: centerX, y: centerY});
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        drawConnection(i, j, nodePositions2, matrix2, 'black');
    }
}
for (let i = 0; i < n; i++) {
    drawNode(i, nodePositions2, '#9B4AE7');
}
let startNode = 0;
for (let i = 0; i < n; i++) {
    if (matrix2[i].some(value => value === 1)) {
        startNode = i;
        break;
    }
}
function changeNodeColor(node, status) {
    let color;
    switch (status) {
        case 'active':
            color = 'yellow';
            break;
        case 'visited':
            color = 'green';
            break;
        case 'closed':
            color = 'red';
            break;
        case 'new':
            color = 'blue';
            break;
        default:
            color = '#9B4AE7';
    }
    drawNode(node, nodePositions2, color)
}
const connectedNodes = (i) => {
    let res = [];
    for (let j = 0; j < matrix2[i].length; j++) {
        if (matrix2[i][j] === 1) res.push(j);
    }
    return res;
}
class BFS {
    constructor(graph, startNode) {
        this.queue = [startNode];
        this.visited = new Set();
        this.changeNodeColor = changeNodeColor;
        this.adjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(0));
        this.nodeOrder = [startNode];
    }

    nextstep() {
        if (this.queue.length > 0) {
            let node = this.queue.shift(); // remove the first element from the queue
            this.queue.unshift(node);
            this.visited.add(node);
            this.changeNodeColor(node, 'active');
            let connected = connectedNodes(node);
            let ifHasUnvis = 0;
            for (let q of connected) {
                if (!this.visited.has(q) && !this.queue.includes(q)) {
                    this.queue.push(q);
                    drawConnection(node, q, nodePositions2, matrix2, 'red')
                    ifHasUnvis = 1;
                    this.visited.add(q);
                    this.changeNodeColor(node, 'active');
                    this.changeNodeColor(q, 'visited');
                    this.adjacencyMatrix[node][q]=1;
                    this.nodeOrder.push(q);
                    break;
                }
            }
            if (ifHasUnvis === 0) {
                this.changeNodeColor(node, 'closed');
                this.queue.shift();
            }
            console.log(this.queue)
            return node;

        }
        console.log('Tree BFS adjacency matrix');
        console.log(this.adjacencyMatrix);
        for (let i=0; i < n; i++ ){
            console.log(`${i+1} - ${this.nodeOrder.indexOf(i)+1}`);
        }
        return null;
    }
}
let bfs = new BFS(matrix2, startNode, changeNodeColor);
document.getElementById('nextStepButton').addEventListener('click', function () {
    bfs.nextstep();
});
class DFS {
    constructor(graph, startNode) {
        this.stack = [startNode];
        this.visited = new Set();
        this.changeNodeColor = changeNodeColor;
        this.lastActiveNode = null;
        this.adjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(0));
        this.nodeOrder = [startNode];
    }
    nextstep() {
        if (this.stack.length > 0) {
            if (this.lastActiveNode !== null) this.changeNodeColor(this.lastActiveNode, 'visited');
            let node = this.stack.pop();
            this.stack.push(node);
            this.visited.add(node);
            this.changeNodeColor(node, 'active');
            let connected = connectedNodes(node);
            let ifHasUnvis = 0;
            for (let q of connected) {
                if (!this.visited.has(q)) {
                    this.stack.push(q);
                    drawConnection(node, q, nodePositions2, matrix2, 'red')
                    ifHasUnvis = 1;
                    this.visited.add(q);
                    this.changeNodeColor(node, 'active');
                    this.changeNodeColor(q, 'visited');
                    this.adjacencyMatrix[node][q]=1;
                    this.nodeOrder.push(q);
                    break;
                }
            }
            if (ifHasUnvis === 0) {
                this.changeNodeColor(node, 'closed');
                this.stack.pop()
                this.lastActiveNode = null;
            }
            else this.lastActiveNode = node;
            console.log(this.stack)
            return node;
        }
        console.log('Tree DFS adjacency matrix');
        console.log(this.adjacencyMatrix);
        for (let i=0; i < n; i++ ){
            console.log(`${i+1} - ${this.nodeOrder.indexOf(i)+1}`);
        }
        return null;
    }
}
let dfs = new DFS(matrix2, startNode, changeNodeColor);
document.getElementById('nextButton').addEventListener('click', function () {
     dfs.nextstep();
});
