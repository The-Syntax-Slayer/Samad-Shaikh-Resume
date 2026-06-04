// GHOST-OS v1.0.8 - Virtual Desktop Interface Logic
// Designed for Samad Shaikh

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // MATRIX RAIN BACKGROUND CONFIGS
    // ----------------------------------------------------
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const charList = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}*#@$%";
    const alphabet = charList.split("");

    const fontSize = 14;
    let columns = width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * -100;
    }

    let matrixColor = "#00ff66";
    let speed = 25;

    const drawMatrix = () => {
        ctx.fillStyle = "rgba(1, 3, 7, 0.08)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = matrixColor;
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > height && Math.random() > 0.985) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    let matrixInterval = setInterval(drawMatrix, speed);

    const updateMatrixSpeed = (newSpeed) => {
        clearInterval(matrixInterval);
        speed = newSpeed;
        matrixInterval = setInterval(drawMatrix, speed);
    };

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = width / fontSize;
        rainDrops.length = 0;
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = Math.random() * -50;
        }
    });


    // ----------------------------------------------------
    // WINDOW FOCUS & STACK MANAGER
    // ----------------------------------------------------
    const windows = document.querySelectorAll(".window");
    const taskbarIcons = document.querySelectorAll(".tb-icon");

    const focusWindow = (targetWin) => {
        windows.forEach(win => {
            win.classList.remove("focused");
        });
        targetWin.classList.add("focused");
        
        // Sync taskbar active highlights
        const winId = targetWin.id;
        taskbarIcons.forEach(icon => {
            if (icon.getAttribute("data-window") === winId) {
                icon.classList.add("active");
            } else {
                // If the target window is open, keep other active icons highlighted too
                const referencedWin = document.getElementById(icon.getAttribute("data-window"));
                if (referencedWin && referencedWin.classList.contains("open")) {
                    icon.classList.add("active");
                } else {
                    icon.classList.remove("active");
                }
            }
        });
    };

    // Attach click events on windows to trigger focus
    windows.forEach(win => {
        win.addEventListener("mousedown", () => {
            focusWindow(win);
        });
    });


    // ----------------------------------------------------
    // LAUNCHERS / CONTROLLERS / SHUTDOWN
    // ----------------------------------------------------
    const openWindow = (winId) => {
        const win = document.getElementById(winId);
        if (win) {
            win.classList.add("open");
            focusWindow(win);
            
            // If opening terminal, trigger auto-typing sequence
            if (winId === "win-terminal") {
                triggerTerminalBoot();
            }
        }
    };

    const closeWindow = (winId) => {
        const win = document.getElementById(winId);
        if (win) {
            win.classList.remove("open");
            win.classList.remove("focused");
            
            // Sync taskbar icon
            const icon = document.querySelector(`.tb-icon[data-window="${winId}"]`);
            if (icon) icon.classList.remove("active");

            // Stop terminal frame loading if closing terminal
            if (winId === "win-terminal") {
                document.getElementById("resume-iframe").src = "";
                document.getElementById("resume-embed-container").style.display = "none";
            }
        }
    };

    // Desktop icons click
    const desktopIcons = document.querySelectorAll(".desktop-icon");
    desktopIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const targetWin = icon.getAttribute("data-window");
            openWindow(targetWin);
        });
    });

    // Window controls dots (Close button)
    const closeButtons = document.querySelectorAll(".win-close");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const win = btn.closest(".window");
            if (win) closeWindow(win.id);
        });
    });

    // Window controls minimize button
    const minButtons = document.querySelectorAll(".win-min");
    minButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const win = btn.closest(".window");
            if (win) closeWindow(win.id);
        });
    });

    // Taskbar icons quick launch / togglers
    taskbarIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const targetWinId = icon.getAttribute("data-window");
            const win = document.getElementById(targetWinId);
            
            if (win) {
                if (win.classList.contains("open")) {
                    if (win.classList.contains("focused")) {
                        closeWindow(targetWinId); // Minimize if open and focused
                    } else {
                        focusWindow(win); // Bring to front if open but backgrounded
                    }
                } else {
                    openWindow(targetWinId); // Launch if closed
                }
            }
        });
    });

    // Start Menu toggler (Open all system files)
    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", () => {
        openWindow("win-profile");
    });


    // ----------------------------------------------------
    // SETTINGS CONTROL DESKTOP PANEL
    // ----------------------------------------------------
    const cfgGreen = document.getElementById("cfg-green");
    const cfgCyan = document.getElementById("cfg-cyan");
    const cfgRed = document.getElementById("cfg-red");
    const cfgPurple = document.getElementById("cfg-purple");
    const cfgSpeedFast = document.getElementById("cfg-speed-fast");
    const cfgSpeedNormal = document.getElementById("cfg-speed-normal");

    if (cfgGreen) {
        cfgGreen.addEventListener("click", () => {
            matrixColor = "#00ff66";
            printTermLine("Matrix theme set to GREEN", "t-green");
        });
    }
    if (cfgCyan) {
        cfgCyan.addEventListener("click", () => {
            matrixColor = "#00f3ff";
            printTermLine("Matrix theme set to CYAN", "t-cyan");
        });
    }
    if (cfgRed) {
        cfgRed.addEventListener("click", () => {
            matrixColor = "#ff0055";
            printTermLine("Matrix theme set to RED", "t-red");
        });
    }
    if (cfgPurple) {
        cfgPurple.addEventListener("click", () => {
            matrixColor = "#af40ff";
            printTermLine("Matrix theme set to PURPLE", "t-cyan");
        });
    }
    if (cfgSpeedFast) {
        cfgSpeedFast.addEventListener("click", () => {
            updateMatrixSpeed(15);
            printTermLine("Rain drop acceleration active (15ms sleep delay)", "t-green");
        });
    }
    if (cfgSpeedNormal) {
        cfgSpeedNormal.addEventListener("click", () => {
            updateMatrixSpeed(35);
            printTermLine("Rain drop acceleration normal (35ms sleep delay)", "t-dim");
        });
    }


    // ----------------------------------------------------
    // SYSTEM TASKBAR CLOCK WORKSPACE
    // ----------------------------------------------------
    const tbTime = document.getElementById("tb-time");
    const updateTime = () => {
        if (tbTime) {
            const now = new Date();
            tbTime.textContent = now.toLocaleDateString() + " // " + now.toLocaleTimeString();
        }
    };
    setInterval(updateTime, 1000);
    updateTime();


    // ----------------------------------------------------
    // INTERACTIVE SHELL LOGIC (RESUME PANEL)
    // ----------------------------------------------------
    const termBody = document.getElementById("term-body");
    const termLogs = document.getElementById("term-logs");
    const termInput = document.getElementById("term-input");
    const pdfContainer = document.getElementById("pdf-viewer-panel");
    const pdfIframe = document.getElementById("pdf-iframe");
    const pdfLoader = document.getElementById("pdf-loader");

    const simulateTyping = async (text, delay = 50) => {
        termInput.disabled = true;
        termInput.value = "";
        for (let i = 0; i < text.length; i++) {
            termInput.value += text[i];
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        termInput.disabled = false;
    };

    const printTermLine = (text, className = "") => {
        const p = document.createElement("p");
        p.className = className;
        p.innerHTML = text;
        termLogs.appendChild(p);
        termBody.scrollTop = termBody.scrollHeight;
    };

    const clearTermLogs = () => {
        termLogs.innerHTML = "";
        pdfContainer.style.display = "none";
    };

    const triggerTerminalBoot = async () => {
        clearTermLogs();
        printTermLine(`[BOOT] INITIALIZING SECURE SHELL SYSTEM v2.0...`, "t-cyan");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        printTermLine(`[SUCCESS] Authorized decrypt handshake: samadshaikh.me secure portal link active.`, "t-green");
        printTermLine(`Platform: GHOST-OS-v1 // Security Level: Secure-G2`, "t-dim");
        printTermLine(`------------------------------------------------------------------`, "t-dim");
        printTermLine(`guest@cyberghost:~$`, "t-cyan");
        
        await simulateTyping("cat resume_samad_shaikh.pdf", 45);
        
        handleShellCommand("cat resume_samad_shaikh.pdf");
        termInput.value = "";
        termInput.focus();
    };

    termInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const val = termInput.value.trim();
            if (val) {
                printTermLine(`guest@cyberghost:~$ ${val}`, "t-cyan");
                handleShellCommand(val.toLowerCase());
            }
            termInput.value = "";
        }
    });

    const handleShellCommand = (cmd) => {
        const args = cmd.split(" ");
        const base = args[0];

        switch (base) {
            case "help":
                printTermLine("Terminal Shell Instruction Registry:", "t-green");
                printTermLine("&nbsp;&nbsp;about&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- General info about Samad Shaikh");
                printTermLine("&nbsp;&nbsp;skills&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Core framework developer deck list");
                printTermLine("&nbsp;&nbsp;resume&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Decrypt & render resume inside this terminal screen");
                printTermLine("&nbsp;&nbsp;download&nbsp;&nbsp;&nbsp;&nbsp;- Download resume PDF payload");
                printTermLine("&nbsp;&nbsp;matrix&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Change background rain color [green/cyan/red/purple]");
                printTermLine("&nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear screen command outputs");
                printTermLine("&nbsp;&nbsp;exit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Shut down shell window environment");
                break;

            case "about":
                printTermLine("User Profile : Samad Shaikh", "t-green");
                printTermLine("Designation  : Cyber Ghost / The Tech Detective", "t-cyan");
                printTermLine("Focus Area   : Full-Stack Architect, API Designer, Integration Automator");
                printTermLine("Mission      : Building stunning, performance-oriented backend APIs and UI frontends.");
                break;

            case "skills":
                printTermLine("Languages   : Node.js, Python, TypeScript, JavaScript, Go", "t-green");
                printTermLine("Backend API : FastAPI, Express, REST, GraphQL, WebSockets", "t-cyan");
                printTermLine("Databases   : PostgreSQL, MongoDB, Redis", "t-cyan");
                printTermLine("Cloud/Ops   : Docker, Git, AWS Services, CI/CD Actions", "t-dim");
                break;

            case "cat":
                if (args[1] && args[1].includes("resume")) {
                    loadResumeViewer();
                } else {
                    printTermLine(`cat: ${args[1] || ""}: File not found. Try: 'cat resume'`, "t-red");
                }
                break;

            case "resume":
                loadResumeViewer();
                break;

            case "download":
                printTermLine("Downloading document packet...", "t-green");
                setTimeout(() => {
                    window.open("https://drive.google.com/uc?export=download&id=1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi", "_blank");
                }, 500);
                break;

            case "matrix":
                const color = args[1];
                if (color === "green") {
                    matrixColor = "#00ff66";
                    printTermLine("Matrix parameter updated to NEON GREEN", "t-green");
                } else if (color === "cyan") {
                    matrixColor = "#00f3ff";
                    printTermLine("Matrix parameter updated to NEON CYAN", "t-cyan");
                } else if (color === "red") {
                    matrixColor = "#ff0055";
                    printTermLine("Matrix parameter updated to WARNING RED", "t-red");
                } else if (color === "purple") {
                    matrixColor = "#af40ff";
                    printTermLine("Matrix parameter updated to SPECTRAL PURPLE", "t-cyan");
                } else {
                    printTermLine("matrix: Parameter mismatch. Use green / cyan / red / purple", "t-red");
                }
                break;

            case "clear":
                clearTermLogs();
                break;

            case "exit":
                printTermLine("Exiting terminal context...", "t-red");
                setTimeout(() => closeWindow("win-terminal"), 500);
                break;

            default:
                printTermLine(`shell: Unknown command '${cmd}'. Type 'help' for support.`, "t-red");
        }

        termBody.scrollTop = termBody.scrollHeight;
    };

    const loadResumeViewer = () => {
        printTermLine("Initializing secure decryption layer for PDF display...", "t-cyan");
        pdfContainer.style.display = "block";
        pdfLoader.style.opacity = "1";
        pdfLoader.style.display = "flex";
        
        pdfIframe.src = "https://drive.google.com/file/d/1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi/preview";

        pdfIframe.onload = () => {
            pdfLoader.style.opacity = "0";
            setTimeout(() => {
                pdfLoader.style.display = "none";
            }, 400);
            printTermLine("File decoded. Resume rendered in terminal window viewport.", "t-green");
        };

        // Fallback option in case of browser frame security blocks
        setTimeout(() => {
            printTermLine("Did your browser block the Google Drive preview?", "t-dim");
            printTermLine("<a href='https://drive.google.com/file/d/1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi/view?usp=sharing' target='_blank' style='color:#00f3ff; text-decoration:underline;'>[Click here to decrypt and view in a separate tab]</a>", "t-cyan");
        }, 1500);
    };

    // Auto-launch Profile window on load to welcome users
    setTimeout(() => {
        openWindow("win-profile");
    }, 800);
});
