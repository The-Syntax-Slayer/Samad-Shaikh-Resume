// Cyber Ghost - Terminal & Matrix Engine
// Designed for Samad Shaikh

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // MATRIX RAIN LOGIC
    // ----------------------------------------------------
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Characters to draw
    const charList = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}*#@$%";
    const alphabet = charList.split("");

    const fontSize = 16;
    let columns = width / fontSize;

    // Drop tracking
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    let matrixColor = "#00ff66"; // Default neon green

    const drawMatrix = () => {
        // Semitransparent black background to produce trail fade
        ctx.fillStyle = "rgba(3, 7, 18, 0.05)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = matrixColor;
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    let matrixInterval = setInterval(drawMatrix, 30);

    // Handle Window Resize
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = width / fontSize;
        rainDrops.length = 0;
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }
    });


    // ----------------------------------------------------
    // TERMINAL INTERACTIVE INTERFACE
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

    // Dynamic state
    let terminalActive = false;

    // System Information Mockups
    const fetchSystemInfo = () => {
        const platform = navigator.platform || "Unknown OS";
        const userAgent = navigator.userAgent.toLowerCase();
        let browser = "Web Client";
        if (userAgent.indexOf("firefox") > -1) browser = "Mozilla Firefox";
        else if (userAgent.indexOf("chrome") > -1) browser = "Google Chrome";
        else if (userAgent.indexOf("safari") > -1) browser = "Apple Safari";
        
        return {
            os: platform,
            browser: browser,
            time: new Date().toLocaleTimeString()
        };
    };

    const sysInfo = fetchSystemInfo();

    // Auto write command helper
    const simulateTyping = async (text, delay = 60) => {
        cmdInput.disabled = true;
        cmdInput.value = "";
        for (let i = 0; i < text.length; i++) {
            cmdInput.value += text[i];
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        cmdInput.disabled = false;
    };

    // Print to terminal screen
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

    // View Resume trigger - Auto typing Simulation
    viewResumeBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        
        // Show terminal modal
        terminalOverlay.classList.add("active");
        terminalActive = true;
        
        // Clear terminal contents for clean boot
        clearLogs();
        
        printLine(`[INITIALIZING] Connecting to samadshaikh.me secure gateway...`, "line-cyan");
        await new Promise(resolve => setTimeout(resolve, 800));
        
        printLine(`[AUTHORIZED] Access granted by Cyber Ghost protocol.`, "line-green");
        printLine(`System: ${sysInfo.os} | Client: ${sysInfo.browser}`, "line-dim");
        printLine(`Current session established at ${sysInfo.time}.`, "line-dim");
        printLine(`------------------------------------------------------------------`, "line-dim");
        
        printLine(`guest@cyberghost:~$`, "line-cyan");
        
        // Simulate typing the command
        await simulateTyping("cat resume_samad_shaikh.pdf", 60);
        
        // Submit command automatically
        handleCommand("cat resume_samad_shaikh.pdf");
        cmdInput.value = "";
        cmdInput.focus();
    });

    // Close terminal modal
    const closeTerminal = () => {
        terminalOverlay.classList.remove("active");
        terminalActive = false;
        embedIframe.src = ""; // Unload iframe to save memory
        embedContainer.style.display = "none";
    };

    closeBtn.addEventListener("click", closeTerminal);
    terminalOverlay.addEventListener("click", (e) => {
        if (e.target === terminalOverlay) closeTerminal();
    });

    // Handle user inputs in terminal
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

    // Commands Processing Center
    const handleCommand = (cmd) => {
        const args = cmd.split(" ");
        const baseCmd = args[0];

        switch (baseCmd) {
            case "help":
                printLine("Available protocols/commands:", "line-green");
                printLine("&nbsp;&nbsp;about&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- General info about Samad Shaikh");
                printLine("&nbsp;&nbsp;skills&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Core technological stack");
                printLine("&nbsp;&nbsp;resume&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Embed and render interactive PDF resume");
                printLine("&nbsp;&nbsp;download&nbsp;&nbsp;&nbsp;&nbsp;- Direct download PDF path");
                printLine("&nbsp;&nbsp;matrix&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Change background rain color [green/cyan/red/purple]");
                printLine("&nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear console terminal screens");
                printLine("&nbsp;&nbsp;exit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Terminate shell terminal session");
                break;

            case "about":
                printLine("User: Samad Shaikh", "line-green");
                printLine("Role: Software Developer & System Architect", "line-cyan");
                printLine("Bio: I craft scalable backend applications, high-performance APIs, and futuristic frontend interfaces. Specialized in fullstack architectures and automated integration pipelines.");
                break;

            case "skills":
                printLine("Primary Languages: Node.js, Python, JavaScript/TypeScript, Go", "line-green");
                printLine("Frameworks/Libs  : React, Next.js, FastAPI, Express", "line-cyan");
                printLine("Databases/Tools  : PostgreSQL, MongoDB, Redis, Docker, Git", "line-cyan");
                printLine("Cloud Infrastructure : AWS, Cloudflare Workers, Vercel", "line-dim");
                break;

            case "cat":
                if (args[1] && args[1].includes("resume")) {
                    loadResumeIframe();
                } else {
                    printLine(`cat: ${args[1] || ""}: No such file or directory. Try 'cat resume'`, "line-error");
                }
                break;

            case "resume":
                loadResumeIframe();
                break;

            case "download":
                printLine("Downloading document packet...", "line-green");
                setTimeout(() => {
                    window.open("https://drive.google.com/uc?export=download&id=1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi", "_blank");
                }, 500);
                break;

            case "matrix":
                const color = args[1];
                if (color === "green") {
                    matrixColor = "#00ff66";
                    printLine("Matrix configuration set to NEON GREEN", "line-green");
                } else if (color === "cyan") {
                    matrixColor = "#00f3ff";
                    printLine("Matrix configuration set to NEON CYAN", "line-cyan");
                } else if (color === "red") {
                    matrixColor = "#ff0055";
                    printLine("Matrix configuration set to WARNING RED", "line-error");
                } else if (color === "purple") {
                    matrixColor = "#af40ff";
                    printLine("Matrix configuration set to SPECTRAL PURPLE", "line-cyan");
                } else {
                    printLine("matrix: Invalid color argument. Options: green, cyan, red, purple", "line-error");
                }
                break;

            case "clear":
                clearLogs();
                break;

            case "exit":
                printLine("Terminating session...", "line-error");
                setTimeout(closeTerminal, 800);
                break;

            default:
                printLine(`Command not recognized: '${cmd}'. Type 'help' for full terminal registry.`, "line-error");
        }

        // Scroll to bottom of terminal screen
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    // Load PDF embed inside the terminal body
    const loadResumeIframe = () => {
        printLine("Loading secure viewer module...", "line-cyan");
        embedContainer.style.display = "block";
        iframeLoader.style.opacity = "1";
        
        // Set Drive preview link
        embedIframe.src = "https://drive.google.com/file/d/1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi/preview";

        embedIframe.onload = () => {
            iframeLoader.style.opacity = "0";
            setTimeout(() => {
                iframeLoader.style.display = "none";
            }, 500);
            printLine("Viewer initialized. File rendered inside virtual viewport.", "line-green");
        };

        // Fallback option in case iFrame doesn't display due to external cookie blocks
        setTimeout(() => {
            printLine("If viewer fails to load due to Google security policies:", "line-dim");
            printLine("<a href='https://drive.google.com/file/d/1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi/view?usp=sharing' target='_blank' style='color:#00f3ff; text-decoration:underline;'>[Click here to open PDF directly in a new tab]</a>", "line-cyan");
        }, 1500);
    };
});
