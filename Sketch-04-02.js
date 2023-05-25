const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');
//const dat = require('dat.gui');

const params = {
  cols: 20,
  rows: 20,
  lwidth: 0.007,
  scaleMin: 5,
  scaleMax: 40,
  freq: 0.003,
  amp: 0.25,
  stillframe: 0,
  animate: true,
  lineCap: 'butt',
  linecolor: '#ff0055ff',
  bgColor: '#000000ff',
  gridw: 0.8,
  gridh: 0.8,
};

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};



const sketch = () => {
  return ({ context, width, height, frame }) => {

    context.fillStyle = `${params.bgColor}`;
    context.fillRect(0, 0, width , height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width  * params.gridw;
    const gridh = height * params.gridh;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width  - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      const f = params.animate ? frame : params.stillframe;

      // const n = random.noise2D(x + f * 5, y, params.freq);
      const n = random.noise3D( x, y, f * 5, params.freq);


      const angle = n * Math.PI * params.amp;
      // const scale = (n + 1) / 2 * 30;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);
      // const r = 250;
      // const g = n * 100;
      // const b = n * 100 * (g * 0.5);
      const r = 0;
      const g = 250;
      const b = 100;

      context.save();
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.beginPath();
      context.lineCap = params.lineCap;
      context.lineWidth = (scale * ((cols + cols) * params.lwidth));
      context.strokeStyle = `${params.linecolor}`;
      // context.strokeStyle = "gray";
      context.moveTo(w * -0.5, 0);
      context.lineTo(w *  0.5, 0);
      context.stroke();

      context.restore();

    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane(); 
  let folder;

  folder = pane.addFolder({ title: 'Canvas ',});
  folder.addInput(params, 'bgColor', {picker: 'inline', expanded: false, });


  folder = pane.addFolder({ title: 'Grid ',});
  folder.addInput(params, 'gridw', {min: 0, max:1,});
  folder.addInput(params, 'gridh', {min: 0, max:1,});
  folder.addInput(params, 'cols', {min: 2, max:50, step: 1 });
  folder.addInput(params, 'rows', {min: 2, max:50, step: 1 });

  folder = pane.addFolder({ title: 'Stroke ',});
  folder.addInput(params, 'lineCap', { options: {butt: 'butt', round: 'round', square: 'square'}})
  folder.addInput(params, 'lwidth', {min: 0.001, max: 0.09, step: 0.005 });
  folder.addInput(params, 'linecolor', {picker: 'inline', expanded: true, });

  folder = pane.addFolder({ title: 'Scale ',});
  folder.addInput(params, 'scaleMin', {min: 1, max: 100 });
  folder.addInput(params, 'scaleMax', {min: 1, max: 100 });

  folder = pane.addFolder({ title: 'Noise ',});
  folder.addInput(params, 'freq', {min: -0.01, max: 0.01 });
  folder.addInput(params, 'amp', {min: 0, max: 1 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'stillframe', { min: 0, max: 999, step: 1 })
  
};
createPane();
canvasSketch(sketch, settings);
