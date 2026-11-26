(function () {
    'use strict';

    const container = document.getElementById('phone-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Configuração dos projetos exibidos na tela do Smartphone 3D
    const SCREENS = {
        barbershop: {
            badge: 'CASE EM PRODUÇÃO',
            title: 'LS Barbershop',
            url: 'lsbarbershop.tech',
            accent: '#1FA2FF',
            secondary: '#8A2BE2',
            kpis: [
                { label: 'Agenda Hoje', value: '24 Horários' },
                { label: 'Taxa Ocupação', value: '94% Ativo' }
            ],
            items: [
                { time: '09:30', client: 'Corte + Barba • Prof. Lucas', status: 'Confirmado' },
                { time: '10:15', client: 'Degradê Navalhado • Rafael', status: 'Em atendimento' },
                { time: '11:00', client: 'Combo Premium • Mateus', status: 'Agendado' }
            ],
            stack: ['Python', 'Django', 'PostgreSQL']
        },
        study: {
            badge: 'PLATAFORMA WEB',
            title: 'LS Study',
            url: 'lsstudy.lstech.dev.br',
            accent: '#5B4BFF',
            secondary: '#1FA2FF',
            kpis: [
                { label: 'Trilhas Ativas', value: '12 Módulos' },
                { label: 'Foco Semanal', value: '18h 40m' }
            ],
            items: [
                { time: 'MOD 01', client: 'Arquitetura REST & Django', status: 'Concluído' },
                { time: 'MOD 02', client: 'Modelagem PostgreSQL', status: '92% concluído' },
                { time: 'MOD 03', client: 'Notas & Mapas Mentais', status: 'Sincronizado' }
            ],
            stack: ['React', 'Django', 'PostgreSQL']
        },
        finance: {
            badge: 'EM PLANEJAMENTO',
            title: 'LS Finance',
            url: 'finance.lstech.dev.br',
            accent: '#8A2BE2',
            secondary: '#1FA2FF',
            kpis: [
                { label: 'Fluxo Previsto', value: 'DRE Inteligente' },
                { label: 'Conciliação', value: 'Automatizada' }
            ],
            items: [
                { time: 'FLUXO', client: 'Entradas & Saídas em Tempo Real', status: 'Módulo Core' },
                { time: 'ALERTA', client: 'Previsão de Caixa 30 Dias', status: 'Analytics' },
                { time: 'GESTÃO', client: 'Centros de Custo PME', status: 'Roadmap' }
            ],
            stack: ['Django', 'Python', 'API REST']
        }
    };

    // Canvas 2D de alta definição para texturizar a tela OLED do smartphone
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 640;
    screenCanvas.height = 1280;
    const ctx = screenCanvas.getContext('2d');

    function roundRect(c, x, y, w, h, r) {
        c.beginPath();
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
    }

    function drawPhoneScreen(key) {
        const data = SCREENS[key] || SCREENS.barbershop;
        const w = screenCanvas.width;
        const h = screenCanvas.height;

        // Fundo OLED escuro
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#07090F');
        bgGrad.addColorStop(0.55, '#0D111C');
        bgGrad.addColorStop(1, '#120C24');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Brilho superior atmosférico
        const glow = ctx.createRadialGradient(w * 0.5, 140, 20, w * 0.5, 140, 340);
        glow.addColorStop(0, 'rgba(31, 162, 255, 0.28)');
        glow.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, 520);

        // Dynamic Island / Notch
        ctx.fillStyle = '#030406';
        roundRect(ctx, w / 2 - 84, 34, 168, 36, 18);
        ctx.fill();

        // Barra de status
        ctx.fillStyle = '#94A3B8';
        ctx.font = '600 20px "JetBrains Mono", monospace';
        ctx.fillText('LS TECH OS', 44, 118);
        ctx.fillStyle = data.accent;
        ctx.fillText('● ONLINE', w - 165, 118);

        // Badge do Projeto
        roundRect(ctx, 44, 154, 240, 38, 19);
        ctx.fillStyle = 'rgba(31, 162, 255, 0.14)';
        ctx.fill();
        ctx.fillStyle = data.accent;
        ctx.font = '700 17px "JetBrains Mono", monospace';
        ctx.fillText(data.badge, 64, 179);

        // Título do Projeto
        ctx.fillStyle = '#F4F7FB';
        ctx.font = '700 50px "Space Grotesk", sans-serif';
        ctx.fillText(data.title, 44, 250);

        ctx.fillStyle = '#7C8BA1';
        ctx.font = '500 22px "JetBrains Mono", monospace';
        ctx.fillText(data.url, 44, 288);

        // Cards KPI
        data.kpis.forEach((kpi, i) => {
            const cardX = 44 + i * 284;
            roundRect(ctx, cardX, 330, 268, 136, 22);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#8B9BB4';
            ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(kpi.label, cardX + 22, 376);

            ctx.fillStyle = i === 0 ? data.accent : '#F4F7FB';
            ctx.font = '700 30px "Space Grotesk", sans-serif';
            ctx.fillText(kpi.value, cardX + 22, 428);
        });

        // Gráfico de telemetria simulado
        roundRect(ctx, 44, 496, w - 88, 190, 24);
        ctx.fillStyle = 'rgba(16, 19, 28, 0.9)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(91, 75, 255, 0.35)';
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '600 19px "JetBrains Mono", monospace';
        ctx.fillText('PERFORMANCE DO SISTEMA • TEMPO REAL', 72, 538);

        const lineGrad = ctx.createLinearGradient(72, 0, w - 72, 0);
        lineGrad.addColorStop(0, '#1FA2FF');
        lineGrad.addColorStop(0.5, '#5B4BFF');
        lineGrad.addColorStop(1, '#8A2BE2');

        ctx.beginPath();
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 5;
        const points = [635, 610, 622, 585, 595, 560, 572, 548];
        points.forEach((py, idx) => {
            const px = 76 + idx * 70;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Lista de módulos / agendamentos reais
        ctx.fillStyle = '#F4F7FB';
        ctx.font = '700 24px "Space Grotesk", sans-serif';
        ctx.fillText('Operação & Módulos', 44, 742);

        data.items.forEach((item, idx) => {
            const y = 768 + idx * 116;
            roundRect(ctx, 44, y, w - 88, 98, 20);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.fill();

            ctx.fillStyle = data.accent;
            ctx.font = '700 18px "JetBrains Mono", monospace';
            ctx.fillText(item.time, 68, y + 40);

            ctx.fillStyle = '#F4F7FB';
            ctx.font = '600 21px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(item.client, 68, y + 74);

            ctx.fillStyle = '#A78BFA';
            ctx.font = '600 17px "JetBrains Mono", monospace';
            ctx.fillText(item.status, w - 210, y + 40);
        });

        // Stack badges no rodapé da tela
        data.stack.forEach((tech, idx) => {
            const bx = 44 + idx * 188;
            roundRect(ctx, bx, 1145, 172, 46, 14);
            ctx.fillStyle = 'rgba(91, 75, 255, 0.18)';
            ctx.fill();
            ctx.fillStyle = '#E2E8F0';
            ctx.font = '600 19px "JetBrains Mono", monospace';
            ctx.fillText(tech, bx + 26, 1175);
        });
    }

    drawPhoneScreen('barbershop');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = 8;

    // Cena, Câmera e Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.1, 8.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Iluminação inspirada na logo LS Tech (Ciano + Roxo Neon)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x1fa2ff, 4.5, 20);
    cyanLight.position.set(3.5, 3, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8a2be2, 4.5, 20);
    violetLight.position.set(-3.8, -2.5, 3.5);
    scene.add(violetLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Grupo principal do Smartphone 3D
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Geometria com cantos arredondados extrudados
    function createRoundedBoxShape(width, height, radius) {
        const s = new THREE.Shape();
        const x = -width / 2;
        const y = -height / 2;
        s.moveTo(x + radius, y);
        s.lineTo(x + width - radius, y);
        s.quadraticCurveTo(x + width, y, x + width, y + radius);
        s.lineTo(x + width, y + height - radius);
        s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        s.lineTo(x + radius, y + height);
        s.quadraticCurveTo(x, y + height, x, y + height - radius);
        s.lineTo(x, y + radius);
        s.quadraticCurveTo(x, y, x + radius, y);
        return s;
    }

    const bodyShape = createRoundedBoxShape(2.36, 4.76, 0.34);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        depth: 0.16,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04
    });
    bodyGeo.center();

    const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x131722,
        metalness: 0.88,
        roughness: 0.22
    });
    const phoneBody = new THREE.Mesh(bodyGeo, chassisMat);
    phoneGroup.add(phoneBody);

    // Aro luminoso perimetral
    const rimGeo = new THREE.EdgesGeometry(bodyGeo, 28);
    const rimMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.45 });
    const phoneRim = new THREE.LineSegments(rimGeo, rimMat);
    phoneGroup.add(phoneRim);

    // Tela Frontal OLED
    const screenShape = createRoundedBoxShape(2.18, 4.58, 0.26);
    const screenGeo = new THREE.ShapeGeometry(screenShape);
    // Normalizar UVs para 0..1
    const posAttr = screenGeo.attributes.position;
    const uvAttr = screenGeo.attributes.uv;
    for (let i = 0; i < posAttr.count; i++) {
        const u = (posAttr.getX(i) + 1.09) / 2.18;
        const v = (posAttr.getY(i) + 2.29) / 4.58;
        uvAttr.setXY(i, u, v);
    }

    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.123;
    phoneGroup.add(screenMesh);

    // Módulo de Câmera Traseira + Emblema LS Tech atrás
    const camBumpGeo = new THREE.BoxGeometry(0.82, 0.92, 0.05);
    const camBumpMat = new THREE.MeshStandardMaterial({ color: 0x0b0d14, metalness: 0.9, roughness: 0.15 });
    const camBump = new THREE.Mesh(camBumpGeo, camBumpMat);
    camBump.position.set(-0.52, 1.62, -0.13);
    phoneGroup.add(camBump);

    const lensGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.06, 24);
    lensGeo.rotateX(Math.PI / 2);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x1fa2ff, emissive: 0x1d4ed8, emissiveIntensity: 0.6, metalness: 1, roughness: 0.1 });
    [-0.68, -0.36].forEach((lx) => {
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.position.set(lx, 1.78, -0.15);
        phoneGroup.add(lens);
    });

    // Anel orbital tecnológico atrás do smartphone
    const ringGeo = new THREE.TorusGeometry(2.85, 0.012, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x5b4bff, transparent: true, opacity: 0.35 });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI * 0.36;
    orbitRing.rotation.y = -Math.PI * 0.15;
    scene.add(orbitRing);

    // Partículas orbitais sutis
    const particleCount = isMobile ? 45 : 95;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 2.6 + Math.random() * 1.3;
        pPositions[i * 3] = Math.cos(angle) * radius;
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
        pPositions[i * 3 + 2] = Math.sin(angle) * radius - 0.8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x1fa2ff, size: 0.04, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Interação de arraste e inclinação com o mouse
    let targetRotY = -0.28;
    let targetRotX = 0.08;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    container.addEventListener('pointerdown', (e) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    window.addEventListener('pointerup', () => {
        isDragging = false;
    });

    window.addEventListener('pointermove', (e) => {
        if (isDragging) {
            const dx = e.clientX - prevX;
            const dy = e.clientY - prevY;
            targetRotY += dx * 0.008;
            targetRotX = Math.max(-0.55, Math.min(0.55, targetRotX + dy * 0.006));
            prevX = e.clientX;
            prevY = e.clientY;
        } else {
            const rect = container.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                targetRotY = -0.22 + nx * 0.32;
                targetRotX = 0.06 + ny * 0.16;
            }
        }
    });

    // API pública para trocar a tela do Smartphone 3D ao clicar nos projetos
    window.setLSPhoneScreen = function (screenKey) {
        drawPhoneScreen(screenKey);
        screenTexture.needsUpdate = true;

        document.querySelectorAll('.screen-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.screen === screenKey);
        });

        // Pequeno pulso de rotação ao trocar projeto
        targetRotY += 0.35;
        setTimeout(() => {
            targetRotY -= 0.35;
        }, 260);
    };

    document.querySelectorAll('.screen-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.setLSPhoneScreen(btn.dataset.screen);
        });
    });

    // Loop de animação
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        phoneGroup.rotation.y += (targetRotY - phoneGroup.rotation.y) * 0.07;
        phoneGroup.rotation.x += (targetRotX - phoneGroup.rotation.x) * 0.07;

        if (!prefersReducedMotion) {
            phoneGroup.position.y = Math.sin(elapsed * 1.6) * 0.11;
            orbitRing.rotation.z = elapsed * 0.25;
            particles.rotation.y = elapsed * 0.12;
        }

        renderer.render(scene, camera);
    }
    animate();

    // Responsividade do canvas
    window.addEventListener('resize', () => {
        if (!container.clientWidth || !container.clientHeight) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
})();
