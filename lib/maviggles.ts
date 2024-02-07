import { createCanvas, CanvasRenderingContext2D, CanvasGradient } from 'canvas';

export default function drawMaviggle(): string {
    const canvas = createCanvas(764, 400);
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(0, 0);
    context.stroke();

    const centerX: number = canvas.width / 2;
    const centerY: number = canvas.height / 2;
    const squiggleStart: number = 20;
    const squiggleEnd: number = canvas.width - 20;
    const step: number = canvas.width / 13;
    context.lineWidth = 40;
    context.lineCap = 'round';

    const gradient: CanvasGradient = context.createLinearGradient(0, centerY, canvas.width, canvas.height);
    const gradients: { [key: string]: string[] } = {
        grad1: ['#c501e1', '#9a26f8', '#6564fe', '#2b97fa', '#02c4e7', '#16e6cc', '#2ef9a0', '#67ff6c', '#c7e602', '#e7c501', '#ff6a63', '#f82d98', '#e830ce'],
        grad2: ['#ffff66', '#fc6e22', '#ff1493', '#c24cf6'],
        grad3: ['#08f7fe', '#09fbd3', '#fe53bb', '#f5d300'],
        grad4: ['#75d5fd', '#b76cfd', '#ff2281', '#011ffd'],
    };

    const palette: string[] = Object.values(gradients)[Math.floor(Math.random() * Object.values(gradients).length)]!;

    for (let i = 0; i < palette.length; i++) {
        gradient.addColorStop(i / palette.length, palette[i]!);
    }

    context.strokeStyle = gradient;

    interface Point {
        x: number;
        y: number;
    }

    const squigglePoints: Point[] = [];
    let random: number;
    let point: Point;

    function pushPoint(point: Point): void {
        squigglePoints.push(point);
    }

    point = { x: squiggleStart, y: centerY };
    pushPoint(point);

    for (let i = step; i < canvas.width - step - 1; i += step) {
        random = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 150;
        point = { x: i, y: centerY + random };
        pushPoint(point);
    }

    point = { x: squiggleEnd, y: centerY };
    pushPoint(point);

    context.moveTo(squigglePoints[0]!.x, squigglePoints[0]!.y);

    for (let i = 1; i < squigglePoints.length - 2; i++) {
        const xc: number = (squigglePoints[i]!.x + squigglePoints[i + 1]!.x) / 2;
        const yc: number = (squigglePoints[i]!.y + squigglePoints[i + 1]!.y) / 2;
        context.quadraticCurveTo(squigglePoints[i]!.x, squigglePoints[i]!.y, xc, yc);
    }

    context.stroke();
    return canvas.toDataURL();
}
