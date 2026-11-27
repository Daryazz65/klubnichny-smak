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
  function berryPoint(u, v) {
    const t = Math.min(.99995, Math.max(.00005, v));
    const angle = fullTurn * u;
    const radius = Math.pow(Math.sin(Math.PI * t), .53) * (1.37 - .79 * t);
    const lobes = 1 + .045 * Math.cos(3 * angle + t * 2) + .022 * Math.sin(5 * angle);
    const skin = .006 * Math.sin(17 * angle + 22 * t) * Math.cos(13 * angle - 33 * t);
    return [
      (radius * lobes + skin) * Math.cos(angle) - .13 * t * t,
      .94 - 2.06 * t + .035 * Math.sin(angle * 3) * Math.sin(Math.PI * t),
      (radius * lobes + skin) * Math.sin(angle) * .92,
    ];
  }
  surface(berryPoint, 0, 88, 64);

  for (let i = 0; i < 7; i++) {
    const angle = i * fullTurn / 7 + .16;
    surface((u, v) => {
      const width = (u - .5) * .32 * Math.pow(Math.sin(Math.PI * Math.max(0, Math.min(1, v))), .82);
      const radius = .07 + v * (.72 + .17 * Math.cos(i * 2));
      const rise = .91 - .12 * Math.sin(Math.PI * v) + v * (.06 + .14 * Math.sin(i * 2));
      const bend = .16 * v * v * Math.cos(i * 2.8);
      return [
        Math.cos(angle) * radius - Math.sin(angle) * (width + bend),
        rise + .24 * Math.pow(v, 4) - Math.abs(width) * .52,
        Math.sin(angle) * radius + Math.cos(angle) * (width + bend),
      ];
    }, 1, 7, 13, true);
  }
  surface((u, v) => {
    const angle = u * fullTurn;
    const radius = .041 + .014 * v;
    return [.19 * (1 - v) * (1 - v) + radius * Math.cos(angle), 1.54 - .65 * v, radius * Math.sin(angle)];
  }, 2, 12, 8);

  const solidCount = vertices.length / 9;
  let randomState = 11;
  function random() {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 4294967296;
  }

  function drop(center, radius, stretch) {
    surface((u, v) => {
      const longitude = u * fullTurn;
      const latitude = Math.PI * v;
      return [
        center[0] + radius * Math.cos(longitude) * Math.sin(latitude),
        center[1] + radius * stretch * Math.cos(latitude),
        center[2] + radius * Math.sin(longitude) * Math.sin(latitude),
      ];
    }, 3, 10, 7);
  }

  for (let i = 0; i < 54; i++) {
    const u = random();
    const v = .18 + random() * .73;
    const p = berryPoint(u, v);
    const radius = .012 + .047 * Math.pow(random(), 2.4);
    drop([p[0] * 1.016, p[1], p[2] * 1.016], radius, 1.12 + random() * .6);
  }
  for (let i = 0; i < 21; i++) {
    const direction = random() * fullTurn;
    const distance = 1.02 + .25 * random();
    const height = -.87 + random() * 1.52;
    drop([Math.cos(direction) * distance, height, Math.sin(direction) * distance],
      .016 + .07 * Math.pow(random(), 2.3), .94 + random() * .52);
  }
  return { vertices: new Float32Array(vertices), solidCount };
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
    varying mediump vec3 surfacePoint;
    varying mediump vec2 surfaceUV;
    varying mediump float surfaceMaterial;
    vec3 rotate(vec3 p) {
      float c = cos(angle), s = sin(angle);
      vec3 spun = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
      return vec3(.914 * spun.x + .407 * spun.y, -.407 * spun.x + .914 * spun.y, spun.z);
    }
    void main() {
      vec3 p = rotate(point);
      gl_Position = vec4((p.xy - vec2(0., .10)) * frame, -.34 * p.z, 1.0 - .12 * p.z);
      direction = rotate(normal);
      surfacePoint = point;
      surfaceUV = uv;
      surfaceMaterial = material;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec3 direction;
    varying vec3 surfacePoint;
    varying vec2 surfaceUV;
    varying float surfaceMaterial;
    float hash(vec2 p) {
      p = fract(p * vec2(.1031, .11369));
      p += dot(p, p.yx + 19.19);
      return fract((p.x + p.y) * p.x);
    }
    float noise(vec2 p) {
      vec2 f = fract(p);
      vec2 i = floor(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
                 mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
    }
    void main() {
      vec3 n = normalize(direction);
      vec3 light = normalize(vec3(-.55, .68, .90));
      vec3 rimLight = normalize(vec3(.85, .11, -.40));
      vec3 view = vec3(0., 0., 1.);
      float diffuse = .31 + .64 * max(0.0, dot(n, light)) + .21 * max(0.0, dot(n, rimLight));
      float shine = max(0.0, dot(n, normalize(light + view)));
      vec3 color;
      if (surfaceMaterial > 2.5) {
        float fresnel = pow(1.0 - abs(dot(n, view)), 3.2);
        float glass = pow(shine, 52.0) + pow(max(0.0, dot(n, normalize(rimLight + view))), 36.0);
        color = mix(vec3(.32, .24, .19), vec3(1., .94, .82), clamp(glass + fresnel * .77, 0., 1.));
        gl_FragColor = vec4(color, .13 + .45 * fresnel + .39 * glass);
        return;
      }
      if (surfaceMaterial < .5) {
        vec2 uv = surfaceUV;
        float row = floor(uv.y * 12.0);
        vec2 cell = vec2(uv.x * 23.0 + mod(row, 2.0) * .5, uv.y * 12.0);
        vec2 cellId = floor(cell);
        cellId.x = mod(cellId.x, 23.0);
        float variant = hash(cellId);
        vec2 pit = fract(cell) - vec2(.5) + vec2(variant - .5, hash(cellId + 8.1) - .5) * .32;
        float d = length(pit * vec2(1.11, .86));
        float hasPits = smoothstep(.045, .15, uv.y) * (1.0 - smoothstep(.87, .995, uv.y));
        float hollow = (1.0 - smoothstep(.12, .32, d)) * hasPits;
        float seedRadius = .076 + .041 * variant;
        float seed = (1.0 - smoothstep(seedRadius, seedRadius + .034, length((pit + vec2(.023, .032)) * vec2(1.56, .78)))) * hasPits;
        float rim = (smoothstep(.19, .27, d) - smoothstep(.27, .38, d)) * hasPits;
        float mottling = noise(vec2(surfacePoint.x + surfacePoint.z * .65, surfacePoint.y) * 23.0);
        float grain = noise(vec2(surfacePoint.x - surfacePoint.z * .41, surfacePoint.y) * 119.0);
        color = mix(vec3(.88, .13, .092), vec3(.42, .025, .040), uv.y * .34 + mottling * .36 + hollow * .27);
        color += rim * vec3(.136, .045, .017) + grain * vec3(.035, .020, .012);
        vec3 gold = mix(vec3(.76, .40, .10), vec3(1.0, .81, .42), clamp(.33 + pit.y * 3.0 + variant * .46, 0., 1.));
        color = mix(color, gold, seed);
        float wet = pow(shine, 36.0) * (.24 + .64 * grain) + pow(shine, 11.0) * .105;
        float sideGlint = pow(max(0.0, dot(n, normalize(rimLight + view))), 49.0) * (.23 + grain * .3);
        color = color * diffuse + vec3(1., .82, .74) * (wet + sideGlint) * (1.0 - hollow * .76);
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
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
  for (const [name, size, offset] of [["point", 3, 0], ["normal", 3, 3], ["uv", 2, 6], ["material", 1, 8]]) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 36, offset * 4);
  }
  gl.enable(gl.DEPTH_TEST);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
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
    const zoom = .70 * Math.min(width, height);
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(angleLocation, angle);
    gl.uniform2f(frameLocation, zoom / width, zoom / height);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.solidCount);
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    gl.drawArrays(gl.TRIANGLES, mesh.solidCount, mesh.vertices.length / 9 - mesh.solidCount);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
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
