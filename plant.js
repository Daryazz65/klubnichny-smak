const TAU = Math.PI * 2;
const add = (a, b) => a.map((value, index) => value + b[index]);
const sub = (a, b) => a.map((value, index) => value - b[index]);
const scale = (v, value) => v.map((coordinate) => coordinate * value);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (v) => scale(v, 1 / (Math.hypot(...v) || 1));
const polar = (angle, radius, y) => [Math.cos(angle) * radius, y, Math.sin(angle) * radius];

function plantMesh(kind) {
  const vertices = [];
  let seed = 19;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function triangle(a, b, c, color, normals) {
    const normal = unit(cross(sub(b, a), sub(c, a)));
    [a, b, c].forEach((point, index) => vertices.push(...point, ...(normals?.[index] || normal), ...color));
  }

  function tube(start, end, bottom, top, color, sides = 8) {
    const axis = unit(sub(end, start));
    const right = unit(cross(axis, Math.abs(axis[1]) > .9 ? [1, 0, 0] : [0, 1, 0]));
    const up = cross(axis, right);
    for (let i = 0; i < sides; i++) {
      const radial = (index) => add(scale(right, Math.cos(index * TAU / sides)), scale(up, Math.sin(index * TAU / sides)));
      const n = radial(i);
      const m = radial(i + 1);
      const a = add(start, scale(n, bottom));
      const b = add(start, scale(m, bottom));
      const c = add(end, scale(m, top));
      const d = add(end, scale(n, top));
      const shade = scale(color, .91 + .16 * random());
      triangle(a, b, c, shade, [n, m, m]);
      triangle(a, c, d, shade, [n, m, n]);
    }
  }

  function sphere(center, radius, color, proportion = [1, 1, 1], sides = 10) {
    const rows = Math.ceil(sides / 2);
    const point = (row, column) => {
      const latitude = row * Math.PI / rows;
      const n = polar(column * TAU / sides, Math.sin(latitude), Math.cos(latitude));
      return [add(center, n.map((value, index) => value * radius * proportion[index])), n];
    };
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < sides; column++) {
        const [a, na] = point(row, column);
        const [b, nb] = point(row, column + 1);
        const [c, nc] = point(row + 1, column + 1);
        const [d, nd] = point(row + 1, column);
        triangle(a, b, c, color, [na, nb, nc]);
        triangle(a, c, d, color, [na, nc, nd]);
      }
    }
  }

  function leaf(start, direction, length, width, color) {
    const sideways = unit(cross(direction, [0, 1, 0]));
    const spine = (t) => add(add(start, scale(direction, t * length)), [0, Math.sin(t * Math.PI) * length * .18, 0]);
    const edge = (t, index, side) => {
      const shape = Math.pow(Math.sin(Math.PI * t), 1.18) * (index % 2 ? 1 : .82);
      return add(add(spine(t), scale(sideways, width * shape * side)), [0, -width * shape * .32, 0]);
    };
    for (let i = 0; i < 12; i++) {
      const t = i / 12;
      const next = (i + 1) / 12;
      for (const side of [-1, 1]) {
        const a = spine(t);
        const b = spine(next);
        const c = edge(next, i + 1, side);
        const d = edge(t, i, side);
        const face = scale(color, .83 + .31 * random());
        if (side > 0) {
          triangle(a, b, c, face);
          triangle(a, c, d, face);
        } else {
          triangle(a, c, b, face);
          triangle(a, d, c, face);
        }
        if (i % 2 && i < 10) {
          const tint = scale(color, 1.28);
          tube(add(a, [0, .007, 0]), add(c, [0, .006, 0]), .005, .002, tint, 4);
        }
      }
    }
    for (let i = 0; i < 6; i++) {
      tube(add(spine(i / 6), [0, .008, 0]), add(spine((i + 1) / 6), [0, .008, 0]), .009 - i * .001, .008 - i * .001, scale(color, 1.34), 4);
    }
  }

  function fruit(center, size) {
    if (kind === "raspberry") {
      const rows = [0.74, 1, .88, .54];
      rows.forEach((width, row) => {
        const count = row === 3 ? 6 : 9;
        for (let i = 0; i < count; i++) {
          const point = add(center, polar((i + row / 2) * TAU / count, width * size * .7, size * (.62 - row * .47)));
          sphere(point, size * (.24 + random() * .09), [.65 + random() * .22, .065 + random() * .046, .125 + random() * .063], [1, 1, 1], 8);
        }
      });
    } else {
      const color = kind === "strawberry" ? [.79, .113, .106] : [.29, .20, .37];
      sphere(center, size, color, kind === "strawberry" ? [.84, 1.15, .84] : [1, 1, 1], 14);
      if (kind === "strawberry") {
        for (let i = 0; i < 34; i++) {
          const y = 1 - 2 * (i + .5) / 34;
          const position = polar(i * 2.4, Math.sqrt(1 - y * y) * size * .84, y * size * 1.15);
          sphere(add(center, position), .012, [.96, .73, .35], [1, 1.3, 1], 5);
        }
      } else {
        sphere(add(center, [0, -size * .89, 0]), size * .27, [.15, .102, .13], [1, .5, 1], 6);
      }
    }
  }

  const soilY = -1.04;
  const terracotta = [.61, .34, .22];
  tube([0, -1.92, 0], [0, -1.15, 0], .46, .63, terracotta, 48);
  tube([0, -1.22, 0], [0, -1.17, 0], .66, .69, terracotta, 48);
  tube([0, -1.17, 0], [0, -1.02, 0], .69, .69, scale(terracotta, 1.06), 48);
  tube([0, -1.92, 0], [0, -1.87, 0], .47, .48, scale(terracotta, .79), 48);
  for (let i = 0; i < 48; i++) {
    const angle = i * TAU / 48;
    const next = (i + 1) * TAU / 48;
    const a = polar(angle, .69, -1.02);
    const b = polar(next, .69, -1.02);
    const c = polar(next, .59, -1.015);
    const d = polar(angle, .59, -1.015);
    triangle(a, d, c, terracotta, [[0, 1, 0], [0, 1, 0], [0, 1, 0]]);
    triangle(a, c, b, terracotta, [[0, 1, 0], [0, 1, 0], [0, 1, 0]]);
    triangle([0, soilY, 0], c, d, scale([.19, .125, .083], .75 + random() * .5));
  }
  for (let i = 0; i < 48; i++) {
    const pebble = polar(random() * TAU, Math.sqrt(random()) * .565, soilY + random() * .022);
    sphere(pebble, .015 + random() * .022, scale([.29, .215, .142], .65 + random() * .7), [1, .65, 1.2], 5);
  }

  const stem = kind === "currant" ? [.35, .28, .156] : [.35, .44, .19];
  const base = [0, soilY, 0];
  for (let i = 0; i < 8; i++) {
    const azimuth = i * 2.4 + .35;
    const low = i < 4;
    const height = kind === "strawberry" ? (low ? .04 : .64) : (low ? .13 : 1.05);
    const tip = polar(azimuth, (low ? .90 : .51) + random() * .25, height + random() * .27);
    const joint = add(scale(base, .47), scale(tip, .53));
    const sprout = add(joint, polar(azimuth, -.14, 0));
    tube(base, sprout, .043, .028, stem);
    tube(sprout, tip, .028, .017, stem);
    const tint = scale(kind === "currant" ? [.32, .48, .21] : [.43, .56, .24], .74 + random() * .41);
    for (let j = -1; j <= 1; j++) {
      const direction = unit(polar(azimuth + j * .93, 1, .14 + random() * .28));
      const start = add(tip, scale(direction, .11));
      tube(tip, start, .014, .008, stem);
      leaf(start, direction, j === 0 ? .7 : .54, kind === "currant" ? .24 : .19, scale(tint, 1 - Math.abs(j) * .08));
    }
    if (i % 2 === 0 || i === 5) {
      const hook = add(tip, polar(azimuth - .32, .25, -.18));
      const end = add(hook, polar(azimuth - .6, .10, -.15));
      tube(tip, hook, .014, .010, stem);
      tube(hook, end, .010, .007, stem);
      fruit(end, kind === "currant" ? .115 : .18);
      if (kind === "currant") {
        for (let j = 1; j < 5; j++) {
          const anchor = add(end, [0, -j * .127, 0]);
          const berry = add(anchor, polar(azimuth + j * 2.1, .10, -.021));
          tube(add(anchor, [0, .13, 0]), anchor, .008, .006, stem);
          tube(anchor, berry, .006, .004, stem);
          fruit(berry, .086);
        }
      }
    }
  }
  if (kind !== "strawberry") {
    const top = [.15, 1.41, -.12];
    tube(base, top, .060, .023, stem);
    for (let i = 0; i < 3; i++) {
      const start = add(top, [0, i * .09, 0]);
      const direction = unit(polar(i * 2.35 + .62, 1, .38 + i * .21));
      leaf(start, direction, .68, .17, [.40, .55, .26]);
      if (i < 2) tube(start, add(start, [0, .09, 0]), .023, .018, stem);
    }
  }
  return new Float32Array(vertices);
}

function createPlantScene(canvas, kind, thumbnail = false) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
  if (!gl) return null;
  const vertexSource = `
    attribute vec3 point;
    attribute vec3 normal;
    attribute vec3 color;
    uniform float angle;
    uniform vec2 frame;
    varying vec3 surface;
    varying vec3 direction;
    varying vec3 position;
    vec3 rotate(vec3 value) {
      float c = cos(angle), s = sin(angle);
      vec3 v = vec3(c * value.x + s * value.z, value.y, -s * value.x + c * value.z);
      return vec3(v.x, .975 * v.y - .222 * v.z, .222 * v.y + .975 * v.z);
    }
    void main() {
      vec3 p = rotate(point);
      float depth = 1.0 - p.z * .11;
      gl_Position = vec4(p.x * frame.x, (p.y + .02) * frame.y, -p.z * .19, depth);
      direction = rotate(normal);
      position = p;
      surface = color;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec3 surface;
    varying vec3 direction;
    varying vec3 position;
    void main() {
      vec3 n = normalize(direction);
      if (!gl_FrontFacing) n *= -1.0;
      vec3 key = normalize(vec3(-.55, .85, .75));
      vec3 rim = normalize(vec3(.8, .4, -.8));
      float light = max(0.0, dot(n, key));
      float edge = max(0.0, dot(n, rim));
      float highlight = pow(max(0.0, dot(n, normalize(key + vec3(0., 0., 1.)))), 24.0);
      float grain = fract(sin(dot(position * 98., vec3(12.9898, 78.233, 41.7))) * 2371.) * .045;
      vec3 shaded = surface * (.49 + .65 * light + .22 * edge - grain);
      gl_FragColor = vec4(shaded + vec3(.17, .14, .10) * highlight, 1.);
    }
  `;
  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const mesh = plantMesh(kind);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
  for (const [index, name] of ["point", "normal", "color"].entries()) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 36, index * 12);
  }
  gl.enable(gl.DEPTH_TEST);
  const angleLocation = gl.getUniformLocation(program, "angle");
  const frameLocation = gl.getUniformLocation(program, "frame");
  let angle = kind === "raspberry" ? -.72 : .35;
  let scheduled = false;

  function render() {
    scheduled = false;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const density = Math.min(window.devicePixelRatio || 1, thumbnail ? 1.5 : 2);
    const pixelWidth = Math.round(width * density);
    const pixelHeight = Math.round(height * density);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    const zoom = (thumbnail ? .49 : .46) * Math.min(height, width * 1.14);
    gl.viewport(0, 0, pixelWidth, pixelHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(angleLocation, angle);
    gl.uniform2f(frameLocation, zoom / width, zoom / height);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 9);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }

  new ResizeObserver(schedule).observe(canvas);
  schedule();
  return {
    turn(delta) {
      angle = (angle + delta) % TAU;
      schedule();
    },
  };
}
