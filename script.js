// Cyber Portal Gateway - Dashboard Logic
// Designed for Samad Shaikh

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // MATRIX RAIN BACKGROUND ENGINE
    // ----------------------------------------------------
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const charList = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[#]$%";
    const alphabet = charList.split("");

    const fontSize = 14;
    let columns = width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * -100;
    }

    let matrixColor = "#00ff66";

    const drawMatrix = () => {
        ctx.fillStyle = "rgba(2, 5, 10, 0.08)";
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

    let matrixInterval = setInterval(drawMatrix, 30);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = width / fontSize;
        rainDrops.length = 0;
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = Math.random() * -50;
        }
        adjustPDFScale();
    });


    // ----------------------------------------------------
    // ENCODED DYNAMIC PROFILE SCANNER (HEX EFFECT)
    // ----------------------------------------------------
    const hexStream = document.getElementById("hex-stream");
    const decodedView = document.getElementById("decoded-view");

    // Dynamic hacker quotes rotation list
    const quotes = [
        "In the universe of code, every bug is a clue.",
        "Slaying syntax, one compiler check at a time.",
        "Decrypting patterns. Solving logic. Slaying syntax.",
        "Searching for logic in a world of syntax errors.",
        "The best error message is the one that never shows up.",
        "Code is like humor. When you have to explain it, it is bad."
    ];

    let currentQuoteIndex = 0;

    // Helper to dynamically calculate ASCII hex strings
    const stringToHex = (str) => {
        return str.split('').map(c => c.charCodeAt(0).toString(16)).join(' ');
    };

    let decrypting = false;
    let decrypted = false;

    const decryptHex = async () => {
        if (decrypting || decrypted) return;
        decrypting = true;
        
        decodedView.innerHTML = `<span style="color:#00f3ff;">[DECRYPTING...]</span>`;
        await new Promise(resolve => setTimeout(resolve, 500));

        let currentStr = "";
        const activeText = quotes[currentQuoteIndex];
        const parts = activeText.split(" ");

        decodedView.innerHTML = "";
        for (let i = 0; i < parts.length; i++) {
            if (!decrypting) break; // Abort if mouse left early
            currentStr += parts[i] + " ";
            decodedView.innerHTML = `<span style="color:#00ff66;">&gt; ${currentStr}</span><span class="cursor-flash" style="background:#00ff66; width:6px; height:12px; display:inline-block; margin-left:4px;"></span>`;
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const cursor = decodedView.querySelector(".cursor-flash");
        if (cursor) cursor.remove();
        
        if (decrypting) {
            decrypted = true;
            decrypting = false;
        }
    };

    const resetHex = () => {
        const wasDecrypted = decrypted;
        decrypting = false;
        decrypted = false;
        decodedView.innerHTML = `&gt; Hover over telemetry hex data streams...`;

        // If it was successfully decrypted, rotate to the next quote
        if (wasDecrypted) {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            if (hexStream) {
                hexStream.textContent = stringToHex(quotes[currentQuoteIndex]);
            }
        }
    };

    if (hexStream) {
        // Set initial hex stream dynamically on load
        hexStream.textContent = stringToHex(quotes[currentQuoteIndex]);

        hexStream.addEventListener("mouseenter", decryptHex);
        hexStream.addEventListener("mouseleave", resetHex);
        hexStream.addEventListener("touchstart", () => {
            if (decrypted) {
                resetHex();
            } else {
                decryptHex();
            }
        });
        
        // Auto run once shortly after load to draw attention
        setTimeout(decryptHex, 2000);
    }


    // ----------------------------------------------------
    // SYSTEM DATE/TIME HEADER TELEMETRY
    // ----------------------------------------------------
    const headerTime = document.getElementById("header-time");
    const updateTime = () => {
        if (headerTime) {
            const now = new Date();
            headerTime.textContent = now.toLocaleDateString() + " // " + now.toLocaleTimeString();
        }
    };
    setInterval(updateTime, 1000);
    updateTime();


    // ----------------------------------------------------
    // TERMINAL RESUME SHELL INTERFACE
    // ----------------------------------------------------
    const viewBtn = document.getElementById("view-resume-btn");
    const termBlock = document.getElementById("terminal-block");
    const closeDot = document.getElementById("terminal-close");
    const termLogs = document.getElementById("terminal-logs");
    const termBody = document.getElementById("term-body");
    const termInput = document.getElementById("term-input");
    const pdfBox = document.getElementById("pdf-viewer-box");
    const pdfIframe = document.getElementById("pdf-iframe");
    const pdfLoader = document.getElementById("pdf-loader");

    let shellActive = false;

    const simulateTyping = async (text, delay = 50) => {
        termInput.disabled = true;
        termInput.value = "";
        for (let i = 0; i < text.length; i++) {
            termInput.value += text[i];
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        termInput.disabled = false;
    };

    const printLine = (text, className = "") => {
        const p = document.createElement("p");
        p.className = className;
        p.innerHTML = text;
        termLogs.appendChild(p);
        termBody.scrollTop = termBody.scrollHeight;
    };

    const clearLogs = () => {
        termLogs.innerHTML = "";
        pdfBox.style.display = "none";
    };

    // Open & Boot Terminal
    viewBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        
        termBlock.style.display = "block";
        shellActive = true;
        clearLogs();
        
        // Smooth scroll to terminal view
        termBlock.scrollIntoView({ behavior: "smooth" });

        printLine(`[CONNECTING] Requesting secure access handshake...`, "l-cyan");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        printLine(`[AUTHORIZED] Gateway link active. Decrypt module online.`, "l-green");
        printLine(`Host: samadshaikh.me // Decryption Key: SEC-A221`, "l-dim");
        printLine(`------------------------------------------------------------------`, "l-dim");
        printLine(`guest@cyberghost:~$`, "l-cyan");
        
        // Sim writing view command
        await simulateTyping("cat resume_samad_shaikh.pdf", 45);
        
        handleCommand("cat resume_samad_shaikh.pdf");
        termInput.value = "";
        if (window.innerWidth > 600) {
            termInput.focus();
        }
    });

    const closeTerminal = () => {
        termBlock.style.display = "none";
        shellActive = false;
        pdfIframe.src = "";
        pdfBox.style.display = "none";
    };

    closeDot.addEventListener("click", closeTerminal);

    termInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const val = termInput.value.trim();
            if (val) {
                printLine(`guest@cyberghost:~$ ${val}`, "l-cyan");
                handleCommand(val.toLowerCase());
            }
            termInput.value = "";
        }
    });

    const handleCommand = (cmd) => {
        const args = cmd.split(" ");
        const base = args[0];

        switch (base) {
            case "help":
                printLine("Terminal Shell Instruction Set:", "l-green");
                printLine("&nbsp;&nbsp;about&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Design info about Samad Shaikh");
                printLine("&nbsp;&nbsp;skills&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Technologies & frameworks validated");
                printLine("&nbsp;&nbsp;resume&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Render PDF resume document inline");
                printLine("&nbsp;&nbsp;download&nbsp;&nbsp;&nbsp;&nbsp;- Download resume PDF directly");
                printLine("&nbsp;&nbsp;matrix&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Change background rain color [green/cyan/red/purple]");
                printLine("&nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear screen console outputs");
                printLine("&nbsp;&nbsp;exit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Shut down interactive terminal shell");
                break;

            case "about":
                printLine("Profile Identity : Samad Shaikh", "l-green");
                printLine("Tech Designation : Cyber Ghost / The Tech Detective", "l-cyan");
                printLine("Specialization   : Scalable Backend Services, Secure API Design, System Integration");
                printLine("Operations       : Debugging, refactoring, and optimizing codebase telemetry.");
                break;

            case "skills":
                printLine("Core Programming  : Node.js, Python, TypeScript, Go", "l-green");
                printLine("Backend Protocols : Express, FastAPI, REST, GraphQL, WebSockets", "l-cyan");
                printLine("Databases & Cache : PostgreSQL, MongoDB, Redis", "l-cyan");
                printLine("Tools & CI-CD     : Docker, Git, AWS infrastructure, Actions", "l-dim");
                break;

            case "cat":
                if (args[1] && args[1].includes("resume")) {
                    loadPDFViewer();
                } else {
                    printLine(`cat: ${args[1] || ""}: File not found. Try: 'cat resume'`, "l-red");
                }
                break;

            case "resume":
                loadPDFViewer();
                break;

            case "download":
                printLine("Decrypting and requesting file payload packet...", "l-green");
                setTimeout(() => {
                    window.open("https://drive.google.com/uc?export=download&id=1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi", "_blank");
                }, 500);
                break;

            case "matrix":
                const color = args[1];
                if (color === "green") {
                    matrixColor = "#00ff66";
                    printLine("Matrix parameter updated to NEON GREEN", "l-green");
                } else if (color === "cyan") {
                    matrixColor = "#00f3ff";
                    printLine("Matrix parameter updated to NEON CYAN", "l-cyan");
                } else if (color === "red") {
                    matrixColor = "#ff0055";
                    printLine("Matrix parameter updated to WARNING RED", "l-red");
                } else if (color === "purple") {
                    matrixColor = "#af40ff";
                    printLine("Matrix parameter updated to SPECTRAL PURPLE", "l-cyan");
                } else {
                    printLine("matrix: Parameter mismatch. Use green / cyan / red / purple", "l-red");
                }
                break;

            case "clear":
                clearLogs();
                break;

            case "exit":
                printLine("Terminating gateway shell...", "l-red");
                setTimeout(closeTerminal, 500);
                break;

            default:
                printLine(`shell: Instructions unmapped: '${cmd}'. Write 'help' for support.`, "l-red");
        }

        termBody.scrollTop = termBody.scrollHeight;
    };

    function adjustPDFScale() {
        if (!shellActive || !pdfBox || pdfBox.style.display === "none") return;

        const containerWidth = pdfBox.clientWidth;
        const baseWidth = 640; // Google Drive preview minimum clean rendering width

        if (containerWidth < baseWidth && containerWidth > 0) {
            const scale = containerWidth / baseWidth;
            pdfIframe.style.width = baseWidth + "px";
            
            // On mobile (max-width: 600px), visual viewport height is 480px.
            // On larger viewports, target visual height matches container's height.
            const targetVisualHeight = (window.innerWidth <= 600) ? 480 : 580;
            pdfIframe.style.height = (targetVisualHeight / scale) + "px";
            
            pdfIframe.style.transform = `scale(${scale})`;
            pdfIframe.style.transformOrigin = "top left";
        } else {
            pdfIframe.style.width = "100%";
            pdfIframe.style.height = "100%";
            pdfIframe.style.transform = "none";
        }
    }

    const loadPDFViewer = () => {
        printLine("Initializing decryption tunnel for resume frame...", "l-cyan");
        pdfBox.style.display = "block";
        adjustPDFScale();
        pdfLoader.style.opacity = "1";
        pdfLoader.style.display = "flex";
        
        pdfIframe.src = "https://drive.google.com/file/d/1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi/preview";

        pdfIframe.onload = () => {
            adjustPDFScale();
            pdfLoader.style.opacity = "0";
            setTimeout(() => {
                pdfLoader.style.display = "none";
            }, 400);
            printLine("Payload decoded. Resume rendered in portal workspace.", "l-green");
        };

        // Standard link backup in case of cookie iframe blocks
        setTimeout(() => {
            printLine("Did your browser block the Google Drive cookie panel?", "l-dim");
            printLine("<a href='https://drive.google.com/file/d/1rPcj4LzL2tRjWXfr22Qxab70JZl8oFyi/view?usp=sharing' target='_blank' style='color:#00f3ff; text-decoration:underline;'>[Click here to decrypt and open in a new workspace window]</a>", "l-cyan");
        }, 1500);
    };
});
