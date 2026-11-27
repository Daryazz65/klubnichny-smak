function strawberryMesh() {
  const vertices = [];
  const fullTurn = Math.PI * 2;
  const subtract = (a, b) => a.map((coordinate, i) => coordinate - b[i]);
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const normalize = (v) => {
    const length = Math.hypot(...v) || 1;
    return v.map((coordinate) => coordinate / length);
  };

  function surface(point, material, columns, rows, flipNormal = false) {
    function vertex(u, v) {
      const p = point(u, v);
      const tangent = subtract(point(u + .001, v), point(u - .001, v));
      const vertical = subtract(point(u, v + .001), point(u, v - .001));
      const n = normalize(flipNormal ? cross(vertical, tangent) : cross(tangent, vertical));
      return [...p, ...n, u, v, material];
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const a = vertex(column / columns, row / rows);
        const b = vertex((column + 1) / columns, row / rows);
        const c = vertex((column + 1) / columns, (row + 1) / rows);
        const d = vertex(column / columns, (row + 1) / rows);
        vertices.push(...a, ...b, ...c, ...a, ...c, ...d);
      }
    }
  }

  // The shoulders are broad and the tip is offset, as in the reference berry.
  surface((u, v) => {
    const t = Math.min(.99995, Math.max(.00005, v));
    const angle = fullTurn * u;
    const radius = Math.pow(Math.sin(Math.PI * t), .65) * (1.29 - .65 * t);
    const lobes = 1 + .043 * Math.cos(3 * angle + t * 2) + .021 * Math.sin(5 * angle);
    return [
      radius * lobes * Math.cos(angle) - .17 * t * t,
      .94 - 2.02 * t + .035 * Math.sin(angle * 3) * Math.sin(Math.PI * t),
      radius * lobes * Math.sin(angle) * .88,
    ];
  }, 0, 64, 48);

  for (let i = 0; i < 7; i++) {
    const angle = i * fullTurn / 7 + .16;
    surface((u, v) => {
      const width = (u - .5) * .32 * Math.sin(Math.PI * v);
      const radius = .08 + v * (.62 + .13 * Math.cos(i * 2));
      const rise = .90 + v * (.31 + .13 * Math.sin(i * 2)) - .19 * Math.sin(Math.PI * v);
      return [
        Math.cos(angle) * radius - Math.sin(angle) * width,
        rise + .13 * v * v - Math.abs(width) * .45,
        Math.sin(angle) * radius + Math.cos(angle) * width,
      ];
    }, 1, 7, 13, true);
  }
  surface((u, v) => {
    const angle = u * fullTurn;
    const radius = .064 - .025 * v;
    return [.16 * v * v + radius * Math.cos(angle), 1.30 - .41 * v, radius * Math.sin(angle)];
  }, 2, 12, 8);
  return new Float32Array(vertices);
}

function startStrawberryBackdrop() {
  const backdrop = document.querySelector(".berry-backdrop");
  const canvas = backdrop.querySelector("canvas");
  const pauseButton = document.querySelector(".berry-motion");
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
  if (!gl) return;

  const vertexSource = `
    attribute vec3 point;
    attribute vec3 normal;
    attribute vec2 uv;
    attribute float material;
    uniform float angle;
    uniform vec2 frame;
    varying mediump vec3 direction;
    varying mediump vec2 surfaceUV;
    varying mediump float surfaceMaterial;
    vec3 rotate(vec3 p) {
      float c = cos(angle), s = sin(angle);
      vec3 spun = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
      return vec3(.817 * spun.x + .576 * spun.y, -.576 * spun.x + .817 * spun.y, spun.z);
    }
    void main() {
      vec3 p = rotate(point);
      gl_Position = vec4(p.xy * frame, -.34 * p.z, 1.0 - .12 * p.z);
      direction = rotate(normal);
      surfaceUV = uv;
      surfaceMaterial = material;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec3 direction;
    varying vec2 surfaceUV;
    varying float surfaceMaterial;
    void main() {
      vec3 n = normalize(direction);
      vec3 light = normalize(vec3(-.55, .68, .90));
      float diffuse = .53 + .52 * max(0.0, dot(n, light));
      float shine = pow(max(0.0, dot(n, normalize(light + vec3(0.0, 0.0, 1.0)))), 25.0);
      vec3 color;
      if (surfaceMaterial < .5) {
        vec2 uv = surfaceUV;
        float row = floor(uv.y * 14.0);
        vec2 cell = vec2(uv.x * 25.0 + mod(row, 2.0) * .5, uv.y * 14.0);
        vec2 pit = fract(cell) - vec2(.5);
        float d = length(pit * vec2(1.08, .88));
        float hasPits = smoothstep(.045, .14, uv.y) * (1.0 - smoothstep(.87, .99, uv.y));
        float hollow = (1.0 - smoothstep(.12, .33, d)) * hasPits;
        float seed = (1.0 - smoothstep(.07, .13, length((pit + vec2(.022, .032)) * vec2(1.5, .76)))) * hasPits;
        float rim = (smoothstep(.22, .29, d) - smoothstep(.30, .40, d)) * hasPits;
        color = mix(vec3(.87, .15, .10), vec3(.47, .025, .055), uv.y * .72 + hollow * .23);
        color += rim * vec3(.12, .048, .017);
        color = mix(color, vec3(.90, .63, .25), seed * .9);
        color = color * diffuse + vec3(.31, .21, .15) * shine * (1.0 - hollow * .75);
      } else {
        float vein = 1.0 - smoothstep(.012, .06, abs(surfaceUV.x - .5));
        color = mix(vec3(.17, .35, .078), vec3(.49, .57, .18), surfaceUV.y * .54 + vein * .25);
        color *= .65 + .38 * abs(dot(n, light));
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return;
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const mesh = strawberryMesh();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
  for (const [name, size, offset] of [["point", 3, 0], ["normal", 3, 3], ["uv", 2, 6], ["material", 1, 8]]) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 36, offset * 4);
  }
  gl.enable(gl.DEPTH_TEST);
  const angleLocation = gl.getUniformLocation(program, "angle");
  const frameLocation = gl.getUniformLocation(program, "frame");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let playing = true;
  let previousTime;
  let angle = -.32;
  let frameRequest;

  function schedule() {
    if (frameRequest === undefined) frameRequest = requestAnimationFrame(draw);
  }

  function draw(time) {
    frameRequest = undefined;
    const animate = playing && !reducedMotion.matches && !document.hidden;
    if (animate && previousTime !== undefined) angle = (angle + Math.min(time - previousTime, 50) * .00022) % (2 * Math.PI);
    previousTime = animate ? time : undefined;
    const density = Math.min(window.devicePixelRatio || 1, 1.4);
    const width = Math.round(canvas.clientWidth * density);
    const height = Math.round(canvas.clientHeight * density);
    if (!width || !height || gl.isContextLost()) return;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const zoom = .71 * Math.min(width, height);
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(angleLocation, angle);
    gl.uniform2f(frameLocation, zoom / width, zoom / height);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 9);
    if (animate) schedule();
  }

  function updateMotion() {
    pauseButton.hidden = reducedMotion.matches || gl.isContextLost();
    pauseButton.textContent = playing ? "Остановить вращение клубники" : "Возобновить вращение клубники";
    previousTime = undefined;
    schedule();
  }

  backdrop.classList.add("is-3d");
  new ResizeObserver(schedule).observe(canvas);
  document.addEventListener("visibilitychange", updateMotion);
  reducedMotion.addEventListener("change", updateMotion);
  pauseButton.addEventListener("click", () => {
    playing = !playing;
    updateMotion();
  });
  canvas.addEventListener("webglcontextlost", () => {
    backdrop.classList.remove("is-3d");
    pauseButton.hidden = true;
  });
  updateMotion();
}

startStrawberryBackdrop();
