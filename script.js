// Cyber Ghost - Terminal, Matrix & HUD Workspace Engine
// Designed for Samad Shaikh

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // MATRIX RAIN BACKGROUND ENGINE
    // ----------------------------------------------------
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Denser character drops as requested
    const charList = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}*#@$%";
    const alphabet = charList.split("");

    const fontSize = 14; // Slightly smaller for higher density
    let columns = width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * -100; // Offset start positions
    }

    let matrixColor = "#00ff66";

    const drawMatrix = () => {
        ctx.fillStyle = "rgba(2, 5, 11, 0.08)"; // Dark trails
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = matrixColor;
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > height && Math.random() > 0.98) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    let matrixInterval = setInterval(drawMatrix, 25); // Faster rate (25ms)

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
    // DYNAMIC HUD DIAGNOSTICS & METERS
    // ----------------------------------------------------
    const cpuFill = document.getElementById("cpu-fill");
    const cpuVal = document.getElementById("cpu-val");
    const ramFill = document.getElementById("ram-fill");
    const ramVal = document.getElementById("ram-val");
    const netFill = document.getElementById("net-fill");
    const netVal = document.getElementById("net-val");

    // Fluctuator for diagnostic percentages
    const updateMeters = () => {
        const cpu = Math.floor(Math.random() * 45) + 15; // 15% - 60%
        const ram = Math.floor(Math.random() * 20) + 45; // 45% - 65%
        const net = Math.floor(Math.random() * 30) + 60; // 60% - 90%

        if(cpuFill) { cpuFill.style.width = cpu + "%"; cpuVal.textContent = cpu + "%"; }
        if(ramFill) { ramFill.style.width = ram + "%"; ramVal.textContent = ram + "%"; }
        if(netFill) { netFill.style.width = net + "%"; netVal.textContent = net + "%"; }
    };

    setInterval(updateMeters, 2000);
    updateMeters(); // Initial call


    // ----------------------------------------------------
    // WORKSPACE CONSOLE FEED LOG GENERATOR
    // ----------------------------------------------------
    const consoleOutput = document.getElementById("console-output-box");

    const logTemplates = [
        { text: "[INFO] Handshaking secure channel with node samadshaikh.me...", class: "log-info" },
        { text: "[SUCCESS] Decryption protocol loaded: AES-256-GCM online.", class: "log-success" },
        { text: "[INFO] Core framework check: Node.js active, React components validated.", class: "log-info" },
        { text: "[WARN] IP packet delay detected in gateway bridge. Re-routing tunnel...", class: "log-warn" },
        { text: "[SUCCESS] Route updated successfully. Latency drop to 18ms.", class: "log-success" },
        { text: "[INFO] Fetching network telemetry... 0 packet loss.", class: "log-info" },
        { text: "[INFO] Resolving subdomain entries in DNS challenge...", class: "log-info" },
        { text: "[SUCCESS] TXT DNS challenge verified for domain samadshaikh.me.", class: "log-success" },
        { text: "[INFO] Compiling script packages... optimized bundle generated.", class: "log-info" },
        { text: "[WARN] Cache consolidation recommended. Initiating automatic purge...", class: "log-warn" },
        { text: "[SUCCESS] Memory pool cleanup complete. 512MB buffers cleared.", class: "log-success" }
    ];

    const generateLog = () => {
        if (!consoleOutput) return;

        const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
        const time = new Date().toLocaleTimeString();
        
        const logLine = document.createElement("div");
        logLine.className = `log-item ${template.class}`;
        logLine.innerHTML = `<span style="color: #007733;">[${time}]</span> ${template.text}`;

        consoleOutput.appendChild(logLine);

        // Keep last 25 logs to prevent memory overflow
        while (consoleOutput.children.length > 25) {
            consoleOutput.removeChild(consoleOutput.firstChild);
        }

        // Scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };

    // Spin log feed
    setInterval(generateLog, 3500);
    // Print initial logs
    for (let i = 0; i < 5; i++) {
        setTimeout(generateLog, i * 400);
    }


    // ----------------------------------------------------
    // SYSTEM DATE/TIME HEADER
    // ----------------------------------------------------
    const headerTime = document.getElementById("header-time");
    const updateHeaderTime = () => {
        if (headerTime) {
            const now = new Date();
            headerTime.textContent = now.toLocaleDateString() + " // " + now.toLocaleTimeString();
        }
    };
    setInterval(updateHeaderTime, 1000);
    updateHeaderTime();


    // ----------------------------------------------------
    // INTERACTIVE TERMINAL SIMULATOR
    // ----------------------------------------------------
    const terminalOverlay = document.getElementById("terminal-overlay");
    const viewResumeBtn = document.getElementById("view-resume-btn");
    const closeBtn = document.getElementById("terminal-close");
    const terminalBody = document.getElementById("terminal-body");
    const terminalLog = document.getElementById("terminal-log");
    const cmdInput = document.getElementById("terminal-input");
    const embedContainer = document.getElementById("resume-embed-container");
    const embedIframe = document.getElementById("resume-iframe");
    const iframeLoader = document.getElementById("iframe-loader");

    let terminalActive = false;

    const simulateTyping = async (text, delay = 50) => {
        cmdInput.disabled = true;
        cmdInput.value = "";
        for (let i = 0; i < text.length; i++) {
            cmdInput.value += text[i];
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        cmdInput.disabled = false;
    };

    const printLine = (text, className = "") => {
        const p = document.createElement("p");
        p.className = className;
        p.innerHTML = text;
        terminalLog.appendChild(p);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const clearLogs = () => {
        terminalLog.innerHTML = "";
        embedContainer.style.display = "none";
    };

    // Auto write command and boot sequence on click
    viewResumeBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        
        terminalOverlay.classList.add("active");
        terminalActive = true;
        clearLogs();
        
        printLine(`[CONNECTING] Establishing secure handshake with samadshaikh.me...`, "line-cyan");
        await new Promise(resolve => setTimeout(resolve, 600));
        
        printLine(`[SUCCESS] Authorized secure gateway bypass. Shell interface loaded.`, "line-green");
        printLine(`Host: Samad-Shaikh-Network // Client: SSL-TLS-1.3`, "line-dim");
        printLine(`------------------------------------------------------------------`, "line-dim");
        
        printLine(`guest@cyberghost:~$`, "line-cyan");
        
        // Auto-type view command
        await simulateTyping("cat resume_samad_shaikh.pdf", 50);
        
        // Execute the command
        handleCommand("cat resume_samad_shaikh.pdf");
        cmdInput.value = "";
        cmdInput.focus();
    });

    const closeTerminal = () => {
        terminalOverlay.classList.remove("active");
        terminalActive = false;
        embedIframe.src = "";
        embedContainer.style.display = "none";
    };

    closeBtn.addEventListener("click", closeTerminal);
    terminalOverlay.addEventListener("click", (e) => {
        if (e.target === terminalOverlay) closeTerminal();
    });

    cmdInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const fullVal = cmdInput.value.trim();
            if (fullVal) {
                printLine(`guest@cyberghost:~$ ${fullVal}`, "line-cyan");
                handleCommand(fullVal.toLowerCase());
            }
            cmdInput.value = "";
        }
    });

    const handleCommand = (cmd) => {
        const args = cmd.split(" ");
        const baseCmd = args[0];

        switch (baseCmd) {
            case "help":
                printLine("Workspace Shell Protocol Commands:", "line-green");
                printLine("&nbsp;&nbsp;about&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Bio summary profile of Samad Shaikh");
                printLine("&nbsp;&nbsp;skills&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Technological framework deck list");
                printLine("&nbsp;&nbsp;resume&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Render document package in iframe terminal");
                printLine("&nbsp;&nbsp;download&nbsp;&nbsp;&nbsp;&nbsp;- Download resume PDF payload");
                printLine("&nbsp;&nbsp;matrix&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Config bg canvas color [green/cyan/red/purple]");
                printLine("&nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Wipe terminal window stdout logs");
                printLine("&nbsp;&nbsp;exit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Kill current interactive console shell");
                break;

            case "about":
                printLine("Profile Identity : Samad Shaikh", "line-green");
                printLine("Tech Designation : Cyber Ghost / The Tech Detective", "line-cyan");
                printLine("Specialty Area   : System Architectures, API Frameworks, Backend Microservices");
                printLine("Operations       : Developing secure application gateways and automations.");
                break;

            case "skills":
                printLine("Core Coding Languages : Node.js, Python, TypeScript, Go", "line-green");
                printLine("Backend & APIs        : Express, FastAPI, REST, GraphQL, WebSockets", "line-cyan");
                printLine("Databases / Caches    : PostgreSQL, MongoDB, Redis", "line-cyan");
                printLine("Infrastructure & Ops  : Docker, AWS Cloud suite, GitHub Actions CI/CD", "line-dim");
                break;

            case "cat":
                if (args[1] && args[1].includes("resume")) {
                    loadResumeIframe();
                } else {
                    printLine(`cat: ${args[1] || ""}: File not found. Command format: 'cat resume'`, "line-error");
                }
                break;

            case "resume":
                loadResumeIframe();
                break;

            case "download":
                printLine("Requesting decryption of document file payload...", "line-green");
                setTimeout(() => {
                    window.open("https://drive.google.com/uc?export=download&id=1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi", "_blank");
                }, 500);
                break;

            case "matrix":
                const color = args[1];
                if (color === "green") {
                    matrixColor = "#00ff66";
                    printLine("Matrix parameter updated to NEON GREEN", "line-green");
                } else if (color === "cyan") {
                    matrixColor = "#00f3ff";
                    printLine("Matrix parameter updated to NEON CYAN", "line-cyan");
                } else if (color === "red") {
                    matrixColor = "#ff0055";
                    printLine("Matrix parameter updated to ALERT RED", "line-error");
                } else if (color === "purple") {
                    matrixColor = "#af40ff";
                    printLine("Matrix parameter updated to SPECTRAL PURPLE", "line-cyan");
                } else {
                    printLine("matrix: Parameter mismatch. Use green / cyan / red / purple", "line-error");
                }
                break;

            case "clear":
                clearLogs();
                break;

            case "exit":
                printLine("Killing terminal process...", "line-error");
                setTimeout(closeTerminal, 600);
                break;

            default:
                printLine(`shell: Unknown instruction: '${cmd}'. Write 'help' for support.`, "line-error");
        }

        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const loadResumeIframe = () => {
        printLine("Initializing secure decryption layer for resume frame...", "line-cyan");
        embedContainer.style.display = "block";
        iframeLoader.style.opacity = "1";
        iframeLoader.style.display = "flex";
        
        // Secure preview link without sandbox block
        embedIframe.src = "https://drive.google.com/file/d/1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi/preview";

        embedIframe.onload = () => {
            iframeLoader.style.opacity = "0";
            setTimeout(() => {
                iframeLoader.style.display = "none";
            }, 400);
            printLine("Payload decoded. Resume rendered in workspace panel.", "line-green");
        };

        // Standby link injection in case of cross-origin blocks
        setTimeout(() => {
            printLine("Did your browser block the Google Drive cookie frame?", "line-dim");
            printLine("<a href='https://drive.google.com/file/d/1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi/view?usp=sharing' target='_blank' style='color:#00f3ff; text-decoration:underline;'>[Decrypt & open PDF in a new workspace window]</a>", "line-cyan");
        }, 1200);
    };
});
