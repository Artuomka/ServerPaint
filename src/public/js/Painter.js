class Painter {
    constructor(beginPointX, beginPointY, endPointX, endPointY, color, width) {
        this.beginPointX = beginPointX;
        this.beginPointY = beginPointY;
        this.endPointX   = endPointX;
        this.endPointY   = endPointY;
        this.color       = color;
        this.width       = width;
        // this.type        = type;
    }

    paint() {
        const canvas      = document.getElementById('paint-canvas');
        const context     = canvas.getContext('2d');
        context.lineJoin  = "round";
        let widthLine     = this.width;
        let colorLine     = this.color;
        let lineType      = this.type;
        context.lineWidth = context.strokeStyle = widthLine;
        context.strokeStyle = colorLine;
        context.beginPath();
        context.moveTo(this.beginPointX, this.beginPointY);
        context.lineTo(this.endPointX, this.endPointY);
        context.closePath();
        context.stroke();
       // console.log('x1= ' + this.beginPointX, 'y1= ' + this.beginPointY, 'x2= ' + this.endPointX, 'y2= ' + this.endPointX,
       //     'color= ' +this.color, 'width= ' +this.width);

    }
}