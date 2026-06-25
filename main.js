window.toggleMenu = function() {
  var btn = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  btn.classList.toggle('open');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
};

window.selectScale = function(btn, field) {
  var btns = btn.closest('.scale-row').querySelectorAll('.scale-btn');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
  btn.classList.add('active');
  var inp = document.getElementById(field + '-val');
  if (inp) inp.value = btn.textContent || btn.innerText;
};

window.handleSubmit = function(e) {
  e.preventDefault();
  var form = e.target;
  var data = new FormData(form);
  fetch('https://formspree.io/f/mwvyazlw', {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  }).then(function(response) {
    if (response.ok) {
      form.style.display = 'none';
      var m = document.getElementById('success-msg');
      if (m) { m.style.display = 'block'; document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }
      setTimeout(function() { window.open('https://caitlyn16dl.setmore.com/', '_blank'); }, 1500);
    } else {
      alert('There was a problem submitting your form. Please try again.');
    }
  }).catch(function() {
    alert('There was a problem submitting your form. Please try again.');
  });
};

window.handleContactSubmit = function(e) {
  e.preventDefault();
  var form = e.target;
  var data = new FormData(form);
  fetch('https://formspree.io/f/mdapbnlo', {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  }).then(function(response) {
    if (response.ok) {
      form.style.display = 'none';
      var m = document.getElementById('contact-success-msg');
      if (m) m.style.display = 'block';
    } else {
      alert('There was a problem submitting your message. Please try again.');
    }
  }).catch(function() {
    alert('There was a problem submitting your message. Please try again.');
  });
};

document.addEventListener('DOMContentLoaded', function() {
  var path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === path || (href === '/' && (path === '/' || path === '/index.html'))) {
      a.classList.add('active');
    }
  });
});

(function(){
  var canvas = document.getElementById('aurora-bg');
  if (!canvas) return;
  var gl = canvas.getContext('webgl2', { antialias:false, powerPreference:'high-performance' });
  if(!gl){ canvas.style.background = 'radial-gradient(circle at 40% 40%, #160840, #0f0520)'; return; }

  var VERT = '#version 300 es\n  in vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.,1.); }';

  var FRAG = '#version 300 es\n' +
  'precision highp float;\n' +
  'out vec4 outColor;\n' +
  'uniform vec2  u_res;\n' +
  'uniform float u_time;\n' +
  'uniform vec2  u_mouse;\n' +
  'uniform vec2  u_click;\n' +
  'uniform float u_clickStart;\n' +
  'const vec3 cCosmos = vec3(0.055,0.018,0.122);\n' +
  'const vec3 cDeep   = vec3(0.088,0.034,0.200);\n' +
  'const vec3 cViolet = vec3(0.180,0.078,0.380);\n' +
  'const vec3 cLilac  = vec3(0.260,0.150,0.520);\n' +
  'const vec3 cStar   = vec3(0.780,0.810,0.970);\n' +
  'const vec3 cRose   = vec3(0.957,0.247,0.369);\n' +
  'const vec3 cAmber  = vec3(0.976,0.451,0.086);\n' +
  'const vec3 cBlue   = vec3(0.145,0.082,0.430);\n' +
  'mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }\n' +
  'float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }\n' +
  'float vnoise(vec2 p){\n' +
  '  vec2 i=floor(p), f=fract(p); vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);\n' +
  '  float a=hash21(i), b=hash21(i+vec2(1,0)), c=hash21(i+vec2(0,1)), d=hash21(i+vec2(1,1));\n' +
  '  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);\n' +
  '}\n' +
  'float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*vnoise(p); p=rot(0.5)*p*2.0; a*=0.5;} return v; }\n' +
  'float softBloom(vec2 p, vec2 cuv){\n' +
  '  float age=u_time-u_clickStart; if(age>3.0||age<0.0) return 0.0;\n' +
  '  float r=age*0.55+0.06; return exp(-pow(length(p-cuv)/r,2.0))*exp(-age*1.1);\n' +
  '}\n' +
  'void main(){\n' +
  '  vec2 uv = (gl_FragCoord.xy - 0.5*u_res)/u_res.y;\n' +
  '  vec2 m  = (u_mouse - 0.5*u_res)/u_res.y;\n' +
  '  vec2 cuv= (u_click - 0.5*u_res)/u_res.y;\n' +
  '  float t = u_time*0.038;\n' +
  '  vec2 p = uv*1.15;\n' +
  '  vec2 q = vec2( fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2,1.3) - vec2(t*0.6,0.0)) );\n' +
  '  vec2 r = vec2( fbm(p + 2.6*q + vec2(1.7,9.2) + t*0.7), fbm(p + 2.6*q + vec2(8.3,2.8) - t*0.5) );\n' +
  '  float base = fbm(p + 2.6*r);\n' +
  '  float wisp = fbm(uv*2.8 + 1.8*r + vec2(-t*0.8, t*0.4));\n' +
  '  float density = base*0.84 + wisp*0.24;\n' +
  '  density = smoothstep(0.04, 0.90, density);\n' +
  '  float volume = pow(density, 0.80);\n' +
  '  float shade = 0.50 + 0.50*smoothstep(0.25, 0.85, length(r));\n' +
  '  vec3 navy = mix(cCosmos, mix(cCosmos,cDeep,0.60), volume);\n' +
  '  vec3 blue = mix(cViolet*0.60, cBlue*0.80, 0.60);\n' +
  '  vec3 col = navy;\n' +
  '  col = mix(col, blue*shade, volume*0.68);\n' +
  '  col += cBlue  * smoothstep(0.65,1.0,density)*0.18*shade;\n' +
  '  col += cLilac * smoothstep(0.88,1.0,density)*0.08;\n' +
  '  vec2 smokeOff = vec2(fbm(uv*3.2 + vec2(t*0.9, 0.15)) - 0.5, fbm(uv*3.2 + vec2(0.15, t*0.75)) - 0.5) * 0.09;\n' +
  '  float distRaw  = length(uv - m);\n' +
  '  float distWisp = length(uv - m + smokeOff);\n' +
  '  float glow = exp(-distWisp * 1.90);\n' +
  '  float core = exp(-distRaw  * 4.20) * 0.28;\n' +
  '  col += cRose * glow * (0.04 + volume*0.38);\n' +
  '  col += cRose * core;\n' +
  '  float bloom = softBloom(uv, cuv);\n' +
  '  col += cRose*bloom*0.70 + cStar*bloom*0.14;\n' +
  '  col = pow(max(col,0.0), vec3(0.92));\n' +
  '  outColor = vec4(col,1.0);\n' +
  '}';

  function sh(type, src){
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){ console.error(gl.getShaderInfoLog(s)); }
    return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog); gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var U = {
    res:gl.getUniformLocation(prog,'u_res'), time:gl.getUniformLocation(prog,'u_time'),
    mouse:gl.getUniformLocation(prog,'u_mouse'), click:gl.getUniformLocation(prog,'u_click'),
    clickStart:gl.getUniformLocation(prog,'u_clickStart')
  };

  var isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
  var DPR = Math.min(window.devicePixelRatio||1, isMobile ? 1.0 : 1.75);
  var mouse = {x:0,y:0}, target = {x:0,y:0};
  var clickPos = {x:0,y:0}, clickStart = -100, started = performance.now(), moved = false;
  var paused = false;
  document.addEventListener('visibilitychange', function(){ paused = document.hidden; });

  function resize(){
    DPR = Math.min(window.devicePixelRatio||1, isMobile ? 1.0 : 1.75);
    canvas.width = Math.floor(innerWidth*DPR);
    canvas.height = Math.floor(innerHeight*DPR);
    gl.viewport(0,0,canvas.width,canvas.height);
    if(!moved){ target.x=mouse.x=clickPos.x=canvas.width/2; target.y=mouse.y=clickPos.y=canvas.height/2; }
  }
  addEventListener('resize', resize);
  addEventListener('pointermove', function(e){ target.x=e.clientX*DPR; target.y=(innerHeight-e.clientY)*DPR; moved=true; }, {passive:true});
  addEventListener('pointerdown', function(e){ clickPos.x=e.clientX*DPR; clickPos.y=(innerHeight-e.clientY)*DPR; clickStart=(performance.now()-started)/1000; }, {passive:true});

  function frame(now){
    if(paused){ requestAnimationFrame(frame); return; }
    mouse.x += (target.x-mouse.x)*0.08;
    mouse.y += (target.y-mouse.y)*0.08;
    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform1f(U.time, (now-started)/1000);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    gl.uniform2f(U.click, clickPos.x, clickPos.y);
    gl.uniform1f(U.clickStart, clickStart);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  resize();
  requestAnimationFrame(frame);
})();
