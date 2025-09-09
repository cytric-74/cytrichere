document.addEventListener('DOMContentLoaded', function() {
    const output = document.getElementById('output');
    const commandInput = document.getElementById('command-input');
    const asciiArt = document.getElementById('ascii-art');
    
    // Initialize matrix rain effect
    initMatrixRain();
    
    // Display initial ASCII art animation
    showBootAnimation();
    
    // Command history
    let commandHistory = [];
    let historyIndex = -1;
    let animationInterval = null;
    
    // Current directory
    let currentDir = '~';
    
    commandInput.focus();
    document.addEventListener('click', () => commandInput.focus());
    
    commandInput.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
            clearAnimation();
        }
        
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                executeCommand(command);
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                commandInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex];
            } else if (historyIndex === -1 && commandHistory.length > 0) {
                historyIndex = commandHistory.length - 1;
                commandInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                commandInput.value = '';
            }
        }
    });

    function initMatrixRain() {
        const matrixContainer = document.getElementById('matrixRain');
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネゐハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        function createMatrixChar() {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.left = Math.random() * 100 + 'vw';
            char.style.animationDuration = (Math.random() * 3 + 2) + 's';
            char.style.animationDelay = Math.random() * 2 + 's';
            
            matrixContainer.appendChild(char);
            
            setTimeout(() => {
                char.remove();
            }, 5000);
        }
        
        setInterval(createMatrixChar, 150);
    }
    
    function executeCommand(command) {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        addToOutput(`<div class="command">[${time}] guest@terminal-roh:${currentDir} $ ${command}</div>`);
    
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        switch(cmd) {
            case 'ls':
                handleLs();
                break;
            case 'cd':
                handleCd(args);
                break;
            case 'clear':
            case 'cls':
                showEnhancedClearAnimation();
                break;
            case 'help':
                showHelp();
                break;
            case 'cat':
                handleCat(args);
                break;
            case './link':
                handleLink();
                break;
            default:
                if (!handleEasterEggs(cmd)) {
                    (`<div class="error">Command not found: ${cmd}. Type 'help' for available commands.</div>`);
                }
                break;
        }
    }
    
    function addToOutput(html) {
        output.innerHTML += html;
        output.scrollTop = output.scrollHeight;
    }
    
    function clearTerminal() {
        output.innerHTML = '';
    }
    
    function showEnhancedClearAnimation() {
        // kinda making an overlay (need to fix this)
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-animation';
        loadingDiv.innerHTML = `
            <div class="loading-dots">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        `;
        
        document.getElementById('terminal').appendChild(loadingDiv);
        
        setTimeout(() => {
            loadingDiv.remove();
            clearTerminal();
            // gotta change this 
            const frames = [
                `   ╭─────╮\n   │ ░░░ │\n   │ ░░░ │\n   ╰─────╯`,
                `   ╭─────╮\n   │ ▒▒▒ │\n   │ ▒▒▒ │\n   ╰─────╯`,
                `   ╭─────╮\n   │ ███ │\n   │ ███ │\n   ╰─────╯`,
                `   ╭─────╮\n   │ ░█░ │\n   │ ░█░ │\n   ╰─────╯`,
                `   ╭─────╮\n   │ ░░░ │\n   │ ░░░ │\n   ╰─────╯`
            ];
            
            let frameIndex = 0;
            addToOutput(`<div class="ascii-art">${frames[frameIndex]}</div>`);
            
            animationInterval = setInterval(() => {
                frameIndex = (frameIndex + 1) % frames.length;
                if (output.lastChild && output.lastChild.className === 'ascii-art') {
                    output.lastChild.innerHTML = frames[frameIndex];
                }
            }, 200);
        }, 1500);
    }
    
    function clearAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }
    
    let asciiShown = false; 

    function showBootAnimation() {
        const bootSequence = [
            "Booting Rohan's Portfolio...",
            "Loading modules.......",
            "Initializing terminal interface...",
            "In the server!",
            "",
            "Welcome to Rohan's Terminal",
            "cy-v v2.0", 
            "",
            "Type 'help' for available commands",
            ""
        ];
    
        let i = 0;
        const interval = setInterval(() => {
            if (i < bootSequence.length) {
                const line = document.createElement('div');
                line.className = 'response boot-line';
                line.textContent = bootSequence[i];
                output.appendChild(line);
                output.scrollTop = output.scrollHeight;
                i++;
            } else {
                clearInterval(interval);
                if (!asciiShown) {
                    asciiShown = true; 
                    showEnhancedAsciiArt(`
                    >_  Terminal
                    `);
                }
            }
        }, 150);
    }
    
    function showEnhancedAsciiArt(art) {
        const artDiv = document.createElement('div');
        artDiv.className = 'ascii-art';
        artDiv.textContent = art;
        output.appendChild(artDiv);
        output.scrollTop = output.scrollHeight;
    }
    
    function handleLs() {
        let contents = '';
        
        if (currentDir === '~') {
            contents = `
<span class="dir">about_me</span>    <span class="dir">skills</span>    <span class="dir">work_exp</span>
<span class="dir">projects</span>    <span class="dir">resume</span>    <span class="dir">contact_me</span>
`;
        } else if (currentDir === '~/projects') {
            contents = `
<span class="dir">feel_cv</span>                : <span class = "normal-text">A browser extension that fills up your relevant information</span>
<span class="dir">meowtech_innovateathon</span> : <span class = "normal-text">Built a project with intel oneAPI</span>
<span class="dir">gta6_sales_prediction</span>  : <span class = "normal-text">Prediction for GTA6 sales</span>
<span class="dir">stock_market_analysis</span>  : <span class = "normal-text">Final year project on Stock market prediction using LSTM and rainforest</span>
`;
        } else if (currentDir === '~/contact_me') {
            contents = `
<span class="dir">github</span>     <span class="dir">linkedin</span>    <span class="dir">mail</span>
<span class="dir">instagram</span>  <span class="dir">twitter</span>     <span class="dir">discord</span>
`;
        } else {
            contents = `<div class="error">No contents to display in this directory</div>`;
        }
        
        addToOutput(`<div class="response">${contents}</div>`);
    }
    
    function handleLs() {
        let contents = '';
        
        if (currentDir === '~') {
            contents = `
📁 <span class="dir">about_me</span>    📁 <span class="dir">skills</span>    📁 <span class="dir">work_exp</span>
📁 <span class="dir">projects</span>    📄 <span class="dir">resume</span>    📁 <span class="dir">contact_me</span>
`;
        } else if (currentDir === '~/projects') {
            contents = `
⟡ <span class="dir">feel_cv</span>                : <span class = "normal-text">A browser extension that fills up your relevant information</span>
⟡ <span class="dir">meowtech_innovateathon</span> : <span class = "normal-text">Built a project with intel oneAPI</span>
⟡ <span class="dir">gta6_sales_prediction</span>  : <span class = "normal-text">Prediction for GTA6 sales</span>
⟡ <span class="dir">stock_market_analysis</span>  : <span class = "normal-text">Final year project on Stock market prediction using LSTM and rainforest</span>
`;
        } else if (currentDir === '~/contact_me') {
            contents = `
✮⋆˙ <span class="dir">github</span>     ᝰ.ᐟ <span class="dir">linkedin</span>    ⋆ 𐙚 ̊. <span class="dir">mail</span>
⭑.ᐟ <span class="dir">instagram</span>  ⋆˙⟡ <span class="dir">twitter</span>     ─.✦ <span class="dir">discord</span>
`;
        } else {
            contents = `<div class="error">No contents to display in this directory</div>`;
        }
        
        addToOutput(`<div class="response">${contents}</div>`);
    }
    
    function handleCd(args) {
        if (args.length === 0) {
            currentDir = '~';
            addToOutput(`<div class="response">Returned to home directory</div>`);
            return;
        }
        
        const target = args[0].toLowerCase();
        
        if (currentDir === '~') {
            switch(target) {
                case 'about_me':
                case 'about':
                    showAboutMe();
                    break;
                case 'skills':
                    showSkills();
                    break;
                case 'work_exp':
                case 'work':
                    showWorkExp();
                    break;
                case 'project':
                case 'projects':
                    currentDir = '~/projects';
                    showProjectsDir();
                    break;
                case 'resume':
                case 'cv':
                    window.open('cv.me.pdf', '_blank');
                    addToOutput(`<div class="response">Opening resume in new tab...</div>`);
                    break;
                case 'contact_me':
                case 'contact':
                    currentDir = '~/contact_me';
                    showContactDir();
                    break;
                default:
                    addToOutput(`<div class="error">Directory not found: ${target}</div>`);
            }
        } else if (currentDir === '~/projects') {
            switch(target) {
                case 'feel':
                case 'feel_cv':
                    showProject('feel_cv', `
<span class = "bold-title">⊹ ࣪ ˖ feel_cv ⊹ ࣪ ˖</span>
<span class = "normal-text">A browser extension that fills up your relevant information but extracting relevant information 
from your uploaded cv(.docx, .txt, .pdf) with the help of fine tunned LLM model i.e, openAI. It can be reprogrammed for other APIs too (working on gemini and minstral)
</span>
<span class= "message">Type './link' to open the project repository.</span>
`);
                    break;
                case 'meow':
                case 'meowtech_innovateathon':
                    showProject('meowtech_innovateathon', `
<span class = "bold-title"> 𓃠 MeowTech INNOVATEathon</span>
<span class = "normal-text">Built a project during Intel INNOVATEthon challenged with using intel oneAPI, that analyzes the audio real time predicting the emotion 
of the audio while suggest you books/songs on the basis of your mood inorder to revamp your positive mood or to elevate your negatives.
</span>
<span class = "message">Type './link' to open the project repository.</span>
`);
                    break;
                case 'gta6':
                case 'gta6_sales_prediction':
                    showProject('gta6_sales_prediction', `
<span class = "bold-title">✧˚ ⋆｡˚ GTA6 sales prediction ✧˚ ⋆｡˚</span>
<span class = "normal-text">Prediction for GTA6 sales based on the trailer hype and reaction from YouTube, X.com, 
Instagram and other web articles.</span>

<span class = "message">Type './link' to open the project repository.</span>
`);
                    break;
                case 'stock':
                case 'stock_market_analysis':
                    showProject('stock_market_analysis', `
<span class = "bold-title"⋆☀︎. stock market analysis</span>
<span class = "normal-text">Final year project, predicting stocks for various famous company using LSTM and rainfall model.</span>

<span class = "message">Type './link' to open the project repository.</span>
`);
                    break;
                case '..':
                    currentDir = '~';
                    addToOutput(`<div class="response">Returned to home directory</div>`);
                    break;
                default:
                    addToOutput(`<div class="error">Contact method not found: ${target}</div>`);
            }
        } else if (currentDir === '~/contact_me') {
            switch(target) {
                case 'github':
                    window.open('https://github.com/cytric-74', '_blank');
                    addToOutput(`<div class="success">Opening GitHub profile...</div>`);
                    break;
                case 'linkedin':
                    window.open('https://linkedin.com/in/roh28j', '_blank');
                    addToOutput(`<div class="success">Opening LinkedIn profile...</div>`);
                    break;
                case 'mail':
                    window.open('mailto:workatrohh@gmail.com', '_blank');
                    addToOutput(`<div class="success">Opening email client...</div>`);
                    break;
                case 'instagram':
                    window.open('https://instagram.com/roh28j', '_blank');
                    addToOutput(`<div class="success">Opening Instagram profile...</div>`);
                    break;
                case 'twitter':
                    window.open('https://twitter.com/roh28j', '_blank');
                    addToOutput(`<div class="success">Opening Twitter profile...</div>`);
                    break;
                case 'discord':
                    addToOutput(`<div class="normal-text">Discord: cytrc</div>`);
                    break;
                case '..':
                    currentDir = '~';
                    addToOutput(`<div class="response">Returned to home directory</div>`);
                    break;
                default:
                    addToOutput(`<div class="error">Contact method not found: ${target}</div>`);
            }
        } else {
            addToOutput(`<div class="error">Cannot change directory from here</div>`);
        }
    }
    
    function showAboutMe() {
        const aboutText = `
<span class="bold-title">Hi Im Rohan</span>
<span class="normal-text">Data Analyst | Computer Science Graduate</span>

<span class="bold-titles">About Me:</span>
<span class="normal-text">
I'm a Computer Science and Engineering graduate passionate about building intelligent systems that entrigues me and in which I'm interested in. 
With a strong foundation in software development, data analysis, and AI, I specialize in transforming complex datasets into meaningful insights and intuitive applications.

I love designing(art, and other graphical content) also Love making and giving presentations.

Over the past few years, I've worked across projects involving deep learning, computer vision, sentiment analysis, and real-time data visualization.
I’ve also collaborated on agricultural AI tools, audio emotion detection systems, and market prediction models using social media trends.

I enjoy exploring intersections between technology, culture, and society—particularly in underrepresented regions like Northeast India. 
</span>

<span class="bold-titles">Education:</span>
    <span class="normal-text">B.Tech in Computer Science and Engineering
        Siliguri Institute of Technology (2020-2024)
            CGPA: 9.2      YGPA : 9.0
        </span>

<span class="bold-titles">Research Interests:</span>
<span class="normal-text">
- Computational Fluid Dynamics (CFD) and Particle-Based Simulations
- Graph-Based Verification and Model Checking
- Machine Learning and AI applications
</span>

<span class = "bold-titles">Hobbies:</span>
<span class = "normal-text">
- Programming side projects
- Learning new technologies
- Open source contributions
- Dribble some baseketball
- Take some picture/video and edit them
- Love watching f1/jetts (1 love engines)
</span>
`;
        addToOutput(`<div class="response">${aboutText}</div>`);
    }
    
    function showSkills() {
        const skillsText = `
<span class = "bold-titles">Technical Skills:</span>

<b>Efficient with:</b>
<span class = "normal-text">
Python  Java  MySQL  PowerBI  Tableau  REST  Git  Seaborn  Excel/Sheets  pySpark
</span>

<b>Familiar with:</b>
<span class="normal-text">
JavaScript  TypeScript  React  Databricks  PostgreSQL  AWS (EC2, S3)  R  HuggingFace
</span>

<b>Currently Learning:</b>
<span class="normal-text">
CFD  React (advanced)  Google Cloud Platform (BigQuery, Compute Engine)  ANOVA
</span>
`;
        addToOutput(`<div class="response">${skillsText}</div>`);
    }
    
    function showWorkExp() {
        const workText = `
<span class="bold-titles">Professional Experience:</span>

<a href="https://darwinbox.com/" target="_blank" rel="noopener noreferrer">
  <span class="project-link">Darwin Box</span>
</a>
<span class = "normal-text">
- Improved efficiency by 4%
- Automated reporting pipelines using Python, reducing manual effort
- Implemented preventive maintenance strategies, resulting in 20% decrease in equipment downtime
- Identified bottlenecks in workflow and suggested actionable insights
</span>

<a href="https://www.rdr.com/" target="_blank" rel="noopener noreferrer">
  <span class="project-link">Rdr.inc</span>
</a>
<span class="normal-text">
- Analyzed complex datasets to identify trends and mitigate risks
- Coordinated testing and validation, ensuring compliance with industry standards
- Developed predictive models using machine learning techniques
- Delivered data-driven insights to support strategic decision-making
</span>
`;
        addToOutput(`<div class="response">${workText}</div>`);
    }
    
    function showProjectsDir() {
        showAsciiArt(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⡏⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠤⣤⣤⣤⣤⣤⣤⣤⣤⣿⣿⠇⠀⢿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⠶⠶⠶⠶⠶⠒⠒⠒⠒
⠀⠀⠘⢿⣿⣿⣟⠛⠛⠛⠛⠀⠀⠀⠛⠛⠛⠛⠋⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠛⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢹⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣾⣿⠁⢀⣤⣾⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣸⣿⢇⣶⣿⠟⠙⠻⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣿⣿⠿⠋⠁⠀⠀⠀⠀⠉⠳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈ 
`);
        addToOutput(`<div class="response">Entered projects directory. Use 'ls' to view projects.</div>`);
    }
    
    function showContactDir() {
        showAsciiArt(`
⠀⠀⣶⣶⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀   ⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ⢸⣿⣿⡇⠀⠀⠀⠀
⣠⣼⣿⣿⣧⣴⣦⣤⣤⡄⠀⠀⣤⣤⣤⣤⣤⣤⣠⣤⣶⣤⣄⠀⢠⣤⣦⣤⠀⢀⣠⣤⣶⣦⣤⣄⡀⠀⢀⣤⣤⣶⣶⣤⣤⡀⠀  ⢸⣿⣿⡇⠀⠀⠀⠀
⠘⢿⣿⣿⡟⠛⠻⣿⣿⣷⠀⢸⣿⣿⡏⣿⣿⣿⡿⠟⢿⣿⣿⣧⢸⣿⣿⣿⢠⣿⣿⡿⠛⠻⣿⣿⣿⡴⠿⠿⢿⢛⠛⣿⣿⣿  ⢸⣿⣿⡇⠀⠀⠀⠀
⠀⢸⣿⣿⡇⠀⠀⢻⣿⣿⡆⣿⣿⡿⠀⣿⣿⣿⡇⠀ ⣿⣿⣿⢸⣿⣿⣿⢽⣿⣿⡇⠀⠀⢉⣉⣉⣩⣴⣶⣿⣿⡿⣿⣿⣿⣿⠀ ⢸⣿⣿⡇⠀⠀⠀⠀
⠀⢸⣿⣿⣷⣤⡄⠀⢿⣿⣿⣿⣿⠁⠀⣿⣿⣿⣷⣤⣾⣿⣿⡟⢸⣿⣿⣿⠸⣿⣿⣷⣤⣤⣾⣿⣿⢻⣿⣿⣯⣄⣤⣿⣿⣿⣦ ⣼⣿⣿⡇⢸⣿⣿⣿
⠀⠈⠛⠿⠿⠟⢃⠀⢈⣿⣿⣿⠇⠀⠀⣿⣿⣿⡟⠻⠿⠟⠋⠀⠘⠛⠛⠛⠀⠈⠛⠻⠿⠿⠟⠛⠁⠈⠛⠿⣿⣿⣿⡛⠻⠿⠿⠛ ⠛⠛⠃⠘⠛⠛⠻
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⡿⠋⠀⠀⠀ ⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`);
        addToOutput(`<div class="response">Entered contact directory. Use 'ls' to view contact methods.</div>`);
    }
    
    function showProject(projectName, description) {
        currentDir = `~/projects/${projectName}`;
        showAsciiArt(`                             
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠋⡇⠀⠀⠀⠀⠀
⢠⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣇⡇⠀⠀⠀⠀⠀
⠸⡄⣿⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀
⠀⣇⣿⣿⣿⣿⣿⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣄⣀⣀⣀⣾⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀
⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠈⢿⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⣿⣿⣿⣿⠉⠁⠀⣾⡆⢸⣿⣿⣿⣿⠀⣾⡆⠀⠈⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⣿⣿⣿⣿⡆⠀⠀⠈⠁⣸⣿⣿⣿⣿⡄⠙⠁⠀⣰⣿⣿⡇⠀⠀⠀⠀
⢀⣀⣀⣸⣿⣿⣿⣿⣷⣶⣶⣿⣿⣿⣿⣾⣿⣿⣶⣶⣿⣿⣿⣿⠥⠤⠤⠤⠄
⠀⢀⡠⠤⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠒⠤⢤⢀⠀
⠒⠉⠀⡠⠖⠋⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠯⢄⣀⠀⠀⠀⠀
⠀⠐⠉⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠀⠀⠉⠒⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
`);
        addToOutput(`<div class="response">${description}</div>`);
    }
    
    function handleLink() {
        if (currentDir.startsWith('~/projects/')) {
            const project = currentDir.split('/')[2];
            
            const links = {
                'feel_cv': 'https://github.com/cytric-74/feel-cv',
                'meowtech_innovateathon': 'https://github.com/debajyotisarkarhome/MeowTech_INNOVATEathon',
                'gta6_sales_prediction': 'https://github.com/cytric-74/gta6-sales-prediction',
                'stock_market_analysis': 'https://github.com/cytric-74/stock-market-analysis'
            };
            
            if (links[project]) {
                window.open(links[project], '_blank');
                addToOutput(`<div class="response">Opening project link...</div>`);
            } else {
                addToOutput(`<div class="error">No link available for this project</div>`);
            }
        } else {
            addToOutput(`<div class="error">Not in a project directory</div>`);
        }
    }
    
    function handleCat(args) {
        if (!args.length) {
            addToOutput(`<div class="error">Usage: cat [filename]</div>`);
            return;
        }
        
        const file = args[0];
        switch(file) {
            case 'about.txt':
                showAboutMe();
                break;
            case 'skills.txt':
                showSkills();
                break;
            case 'experience.txt':
                showWorkExp();
                break;
            default:
                addToOutput(`<div class="error">cat: ${file}: No such file found</div>`);
        }
    }
    
    function showHelp() {
        const helpText = `
Available commands:
- ls               : List directory contents
- cd <directory>   : Change directory
- clear/cls        : Clear the terminal (with animation)
- help             : Show this help message
- cat <file>       : View file contents
- ./link           : Open project link (when in project directory)
`;
        addToOutput(`<div class="response">${helpText}</div>`);
    }
});