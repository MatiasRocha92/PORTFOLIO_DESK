document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const iconGrid = document.getElementById('icon-grid');
    const taskbarClock = document.getElementById('taskbar-clock');
    const taskbarDate = document.getElementById('taskbar-date');
    const startMenuBtn = document.getElementById('start-menu-btn');
    const startMenu = document.getElementById('start-menu');
    const cookieNotification = document.getElementById('cookie-notification');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');
    const aboutNotification = document.getElementById('about-notification');
    const closeAboutBtn = document.getElementById('close-about');
    


    // Ventanas (Modales)
    const terminal = { container: document.getElementById('terminal'), body: document.getElementById('terminal-body') };
    const cvModal = { container: document.getElementById('cv-modal') };
    const notepadModal = { container: document.getElementById('notepad-modal') };
    const projectsModal = { container: document.getElementById('projects-modal'), grid: document.getElementById('projects-grid') };


    // --- DATOS Y CONFIGURACIÓN ---
    const desktopIcons = [
        { id: 'portfolio', text: 'Terminal', icon: 'img/iconos/terminal.svg', action: 'openTerminal' },
        { id: 'notepad', text: 'Bloc de Notas', icon: 'img/iconos/notas.png', action: 'openNotepad' },
        { id: 'cv', text: 'Currículum', icon: 'img/iconos/cv.png', action: 'openCvModal' },
        { id: 'github', text: 'GitHub', icon: 'img/iconos/github.png', action: 'openLink', url: 'https://github.com/MatiasRocha92' }
    ];

    const personalData = [
        { text: "  nombre: 'Matias Rocha',", class: 'text-[#e5c07b]' },
        { text: "  profesión: 'Bombero, Brigadista Forestal, Web Developer',", class: 'text-[#e5c07b]' },
        { text: "  habilidades: ['HTML', 'CSS', 'Tailwind', 'JavaScript', 'Python', 'SCSS', 'Ubuntu'],", class: 'text-[#e5c07b]' },
    ];

    // Datos de proyectos con el nuevo formato
    const myProjects = [
        {
            title: 'Carrito',
            description: 'Mi Primer Carrito',
            imageUrl: 'https://i.ibb.co/0pp0TkSd/carrito.webp',
            vercelLink: 'https://primer-carrito-900021.netlify.app/'
        },
        {
            title: 'Calculadora',
            description: 'Mi Primero Proyecto :)',
            imageUrl: 'https://i.ibb.co/xSJtFycF/calculadora.webp',
            vercelLink: 'https://klculador-01.netlify.app/'
        },
        {
            title: 'Portfolio Terminal',
            description: 'Creado con HTML, CSS y JavaScript',
            imageUrl: 'https://i.ibb.co/PzcNS6r8/portfolio.png',
            vercelLink: 'https://portfolio-desk01.vercel.app/'
        },
        {
            title: 'Sazonea',
            description: 'Pagina de recetas interactivas',
            imageUrl: 'https://i.ibb.co/N66NcycY/Sazonea.png',
            vercelLink: 'https://recetas-gold.vercel.app/'
        }
    ];

    let state = { isTerminalOpen: false, isTyping: false, lastClickTime: 0 };

    // --- FUNCIONES PRINCIPALES ---
    const updateClock = () => {
        const now = new Date();
        taskbarClock.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };
    
    const updateDate = () => {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('es-ES', options);
        taskbarDate.textContent = dateStr;
    };
    
    const toggleStartMenu = () => startMenu.classList.toggle('hidden');

    startMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.classList.contains('hidden') && !startMenu.contains(e.target) && !startMenuBtn.contains(e.target)) {
            toggleStartMenu();
        }
    });

    startMenu.addEventListener('click', (e) => {
        const target = e.target.closest('li[data-action]');
        if (!target) return;
        const action = target.dataset.action;
        const url = target.dataset.url;
        
        if (action && iconActions[action]) {
            iconActions[action](url);
            toggleStartMenu();
        }
    });

    // --- ACCIONES DE VENTANAS Y ICONOS ---
    const iconActions = {
        openTerminal: () => {
            terminal.container.classList.remove('hidden');
            if (!state.isTerminalOpen) {
                terminal.body.innerHTML = ''; 
                typeLines(personalData, 0, addInputLine); 
            }
            state.isTerminalOpen = true;
        },
        openCvModal: () => cvModal.container.classList.remove('hidden'),
        openNotepad: () => notepadModal.container.classList.remove('hidden'),
        openLink: (url) => window.open(url, '_blank'),
        openAbout: () => {
            // Resetear la animación antes de mostrarla
            aboutNotification.style.animation = 'none';
            aboutNotification.offsetHeight; // Forzar reflow
            aboutNotification.style.animation = 'slideInFromTop 0.5s ease-out';
            aboutNotification.style.display = 'block';
        },
        
        openProjects: () => {
            const grid = projectsModal.grid;
            grid.innerHTML = ''; 

            myProjects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                        <h3 class="project-title">${project.title}</h3>
                    <p class="project-distance">${project.description}</p>
                    <div class="project-image-container">
                        <img src="${project.imageUrl}" alt="Previsualización de ${project.title}" class="project-image" onerror="this.onerror=null;this.src='https://placehold.co/400x400/718096/ffffff?text=Imagen+no+encontrada';">
                    </div>
                    <a href="${project.vercelLink}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <svg class="project-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                        Explore
                    </a>
                `;
                grid.appendChild(card);
            });
            projectsModal.container.classList.remove('hidden');
        },

        // CORREGIDO: Resetea los estilos al cerrar para arreglar el bug de arrastre
        closeWindow: (modalContainer) => {
            modalContainer.classList.add('hidden');
            modalContainer.style.top = '';
            modalContainer.style.left = '';
            modalContainer.style.transform = '';
        },
    };

    // Event listeners para botones de ventana
    const setupWindowButtons = () => {
        const windowTypeMap = {
            'terminal': 'terminal',
            'cv-modal': 'cv',
            'notepad-modal': 'notepad',
            'projects-modal': 'projects'
    };

    document.querySelectorAll('.window-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
            const window = btn.closest('.animate-open-scale');
            if (window) iconActions.closeWindow(window);
        });
    });
    
        document.querySelectorAll('.window-minimize').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const window = btn.closest('.animate-open-scale');
                if (window) {
                    const windowType = windowTypeMap[window.id] || 'terminal';
                    minimizeWindow(window, windowType);
                }
            });
        });
    };
    


    // --- FUNCIONES DE LA TERMINAL ---
    const typeText = (element, text, callback) => {
        let i = 0;
        state.isTyping = true;
        element.innerHTML = '';
        const typing = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, 20);
            } else {
                state.isTyping = false;
                if (callback) callback();
            }
        };
        typing();
    };

    const typeLines = (lines, i = 0, onFinished) => {
        if (i >= lines.length) {
            if (onFinished) onFinished();
            return;
        }
        const lineDiv = document.createElement('div');
        lineDiv.className = lines[i].class;
        terminal.body.appendChild(lineDiv);
        typeText(lineDiv, lines[i].text, () => typeLines(lines, i + 1, onFinished));
    };
    
    const addInputLine = () => {
        const inputLine = document.createElement('div');
        inputLine.className = 'flex gap-2 items-center';
        inputLine.innerHTML = `<span class="text-[#98c379]">(user@machine):~$</span><input type="text" class="terminal-input bg-transparent border-none text-white w-full outline-none terminal-font" autocomplete="off">`;
        terminal.body.appendChild(inputLine);
        const inputField = inputLine.querySelector('.terminal-input');
        inputField.focus();
        inputField.addEventListener('keydown', processCommand);
        terminal.body.scrollTop = terminal.body.scrollHeight;
    };

    const processCommand = (e) => {
        if (e.key !== 'Enter' || state.isTyping) return;
        const input = e.target;
        const command = input.value.trim().toLowerCase();
        input.parentElement.innerHTML = `<span class="text-[#98c379]">(user@machine):~$</span><span class="text-white">${command}</span>`;
        if (command && terminalCommands[command]) {
            const result = terminalCommands[command]();
            if (result) {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'text-[#e5c07b] whitespace-pre-wrap';
                resultDiv.innerHTML = result;
                terminal.body.appendChild(resultDiv);
            }
        } else if (command) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-400';
            errorDiv.textContent = `Comando no reconocido: ${command}`;
            terminal.body.appendChild(errorDiv);
        }
        if (command !== 'clear' && command !== 'info') addInputLine();
    };
    
    const terminalCommands = {
        help: () => "Comandos disponibles: 'info', 'proyectos', 'contacto', 'clear', 'cv'.",
        info: () => { terminal.body.innerHTML = ''; typeLines(personalData, 0, addInputLine); return ''; },
        proyectos: () => { iconActions.openProjects(); return "Abriendo proyectos..."; },
        contacto: () => `Puedes contactarme en <a class="text-blue-400 hover:underline" href="mailto:maty.comu@gmail.com">maty.comu@gmail.com</a>.`,
        clear: () => { terminal.body.innerHTML = ''; addInputLine(); return ''; },
        cv: () => { iconActions.openCvModal(); return "Abriendo CV..."; },
    };

    // --- SISTEMA DE MINIMIZACIÓN ESTILO MACOS ---
    const minimizedWindows = new Map();
    
    const minimizeWindow = (windowElement, windowType) => {
        // Animación de minimización
        windowElement.style.transform = 'translate(-50%, -50%) scale(0.1)';
        windowElement.style.opacity = '0';
        
        setTimeout(() => {
            windowElement.classList.add('hidden');
            windowElement.style.transform = '';
            windowElement.style.opacity = '';
            
            // Guardar referencia de la ventana minimizada
            minimizedWindows.set(windowType, windowElement);
            
            // Mostrar indicador en la barra de tareas
            showTaskbarIndicator(windowType);
        }, 300);
    };
    
    const restoreWindow = (windowType) => {
        const windowElement = minimizedWindows.get(windowType);
        if (windowElement) {
            windowElement.classList.remove('hidden');
            minimizedWindows.delete(windowType);
            hideTaskbarIndicator(windowType);
        }
    };
    
    const showTaskbarIndicator = (windowType) => {
        const indicator = document.getElementById(`taskbar-${windowType}`);
        if (indicator) {
            indicator.classList.add('minimized-indicator');
        }
    };
    
    const hideTaskbarIndicator = (windowType) => {
        const indicator = document.getElementById(`taskbar-${windowType}`);
        if (indicator) {
            indicator.classList.remove('minimized-indicator');
        }
    };

    // --- FUNCIONES PARA COOKIES ---
    const handleCookieResponse = (accepted) => {
        localStorage.setItem('cookiesAccepted', accepted.toString());
        cookieNotification.style.animation = 'slideInFromTop 0.5s ease-out reverse';
        setTimeout(() => cookieNotification.style.display = 'none', 500);
    };

    const showCookieNotification = () => {
        if (localStorage.getItem('cookiesAccepted') === null) {
            cookieNotification.style.display = 'block';
        }
    };

    // --- FUNCIONES PARA LA NOTIFICACIÓN SOBRE EL PORTFOLIO ---
    const closeAboutNotification = () => {
        aboutNotification.style.animation = 'slideInFromTop 0.5s ease-out reverse';
        setTimeout(() => {
            aboutNotification.style.display = 'none';
            // Resetear la animación después de ocultar
            aboutNotification.style.animation = '';
        }, 500);
    };

    // --- INICIALIZACIÓN ---
    const init = () => {
        updateClock();
        updateDate();
        setInterval(updateClock, 60000);
        setInterval(updateDate, 60000);
        
        // Mostrar notificación de cookies
        showCookieNotification();
        
        // Event listeners para cookies
        acceptCookiesBtn.addEventListener('click', () => handleCookieResponse(true));
        rejectCookiesBtn.addEventListener('click', () => handleCookieResponse(false));

        // Event listener para cerrar notificación sobre el portfolio
        closeAboutBtn.addEventListener('click', closeAboutNotification);

        desktopIcons.forEach((data, index) => {
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.dataset.action = data.action;
            if (data.url) icon.dataset.url = data.url;
            
            // Mapeo de acciones a IDs
            const actionToId = {
                'openTerminal': 'taskbar-terminal',
                'openCvModal': 'taskbar-cv',
                'openNotepad': 'taskbar-notepad',
                'openProjects': 'taskbar-projects'
            };
            icon.id = actionToId[data.action] || 'taskbar-terminal';
            
            icon.style.left = '2rem';
            icon.style.top = `${4 + index * 7}rem`;
            icon.innerHTML = `<img src="${data.icon}" alt="${data.text}" class="desktop-icon-img"><p class="text-white text-sm mt-1 pointer-events-none">${data.text}</p>`;
            iconGrid.appendChild(icon);

            icon.addEventListener('click', (e) => {
                const now = new Date().getTime();
                if (now - state.lastClickTime < 300) {
                    const windowType = data.action.replace('open', '').toLowerCase();
                    
                    if (minimizedWindows.has(windowType)) {
                        restoreWindow(windowType);
                    } else if (iconActions[data.action]) {
                        iconActions[data.action](data.url);
                    }
                }
                state.lastClickTime = now;
            });
        });

        // Configurar botones de ventana
        setupWindowButtons();
    };

    init();
});