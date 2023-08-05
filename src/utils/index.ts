export function swap(a: string, b: string) {
    const t: any = this[a];
    this[a] = this[b];
    this[b] = t;
}

export function scaleByPixelRatio(input: number) {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
}

export function getMouseXY(e: MouseEvent) {
    return { x: e.offsetX, y: e.offsetY };
}

export function getTouchXY(e: Touch) {
    return { x: e.pageX, y: e.pageY };
}
