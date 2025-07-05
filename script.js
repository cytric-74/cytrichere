document.addEventListener('DOMContentLoaded', function() {
    const output = document.getElementById('output');
    const commandInput = document.getElementById('command-input');
    const asciiArt = document.getElementById('ascii-art');
    
    // Display initial ASCII art animation
    showBootAnimation();
    
    // Command history
    let commandHistory = [];
    let historyIndex = -1;
    let animationInterval = null;
    
    // Current directory
    let currentDir = '~';
    
    // Focus input on page load and whenever clicked elsewhere
    commandInput.focus();
    document.addEventListener('click', () => commandInput.focus());
    
    // Handle command input
    commandInput.addEventListener('keydown', function(e) {
        // Clear any ongoing animation when typing
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
    
    function executeCommand(command) {
        // Display the command with timestamp
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        addToOutput(`<div class="command">[${time}] guest@terminal-roh:${currentDir} $ ${command}</div>`);
        
        // Parse command
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Execute appropriate command
        switch(cmd) {
            case 'ls':
                handleLs();
                break;
            case 'cd':
                handleCd(args);
                break;
            case 'clear':
            case 'cls':
                showClearAnimation();
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
                addToOutput(`<div class="error">Command not found: ${cmd}. Type 'help' for available commands.</div>`);
        }
    }
    
    function addToOutput(html) {
        output.innerHTML += html;
        output.scrollTop = output.scrollHeight;
    }
    
    function clearTerminal() {
        output.innerHTML = '';
    }
    
    function showClearAnimation() {
        clearTerminal();
        
        // ASCII art frames for animation
        const frames = [
            `   _____\n  /     \\\n  \\     /\n   -----`,
            `   _____\n  /     \\\n  \\  .  /\n   -----`,
            `   _____\n  /  .  \\\n  \\     /\n   -----`,
            `   _____\n  /     \\\n  \\  '  /\n   -----`
        ];
        
        let frameIndex = 0;
        addToOutput(`<div class="ascii-art">${frames[frameIndex]}</div>`);
        
        animationInterval = setInterval(() => {
            frameIndex = (frameIndex + 1) % frames.length;
            output.lastChild.innerHTML = frames[frameIndex];
        }, 300);
    }
    
    function clearAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }
    
    function showBootAnimation() {
        const bootSequence = [
            "Booting Rohan's Portfolio...",
            "Loading modules.......",
            "Initializing terminal interface...",
            "Mounting file systems...",
            "Starting services...",
            "Ready!",
            "",
            "Welcome to rohan's Terminal Portfolio",
            "Type 'help' for available commands",
            ""
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < bootSequence.length) {
                addToOutput(`<div class="response">${bootSequence[i]}</div>`);
                i++;
            } else {
                clearInterval(interval);
                showAsciiArt(`
  _____          _      _   _             _____      _   _   _             
 |  __ \\        | |    | | | |           |  __ \\    | | | | (_)            
 | |__) |___  __| | ___| |_| |_ ___ _ __ | |__) |_ _| |_| |_ _ _ __   __ _ 
 |  _  // _ \\/ _\` |/ _ \\ __| __/ _ \\ '_ \\|  ___/ _\` | __| __| | '_ \\ / _\` |
 | | \\ \\  __/ (_| |  __/ |_| ||  __/ | | | |  | (_| | |_| |_| | | | | (_| |
 |_|  \\_\\___|\\__,_|\\___|\\__|\\__\\___|_| |_|_|   \\__,_|\\__|\\__|_|_| |_|\\__, |
                                                                        __/ |
                                                                       |___/ 
                `);
            }
        }, 300);
    }
    
    function showAsciiArt(art) {
        addToOutput(`<div class="ascii-art">${art}</div>`);
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
<span class="dir">feel_cv</span>                : A browser extension that fills up your relevant information
<span class="dir">meowtech_innovateathon</span> : Built a project with intel oneAPI
<span class="dir">gta6_sales_prediction</span>  : Prediction for GTA6 sales
<span class="dir">stock_market_analysis</span>  : Final year project
`;
        } else if (currentDir === '~/contact_me') {
            contents = `
<span class="dir">github</span>    <span class="dir">linkedin</span>    <span class="dir">mail</span>
<span class="dir">instagram</span>  <span class="dir">twitter</span>     <span class="dir">discord</span>
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
                case 'projects':
                    currentDir = '~/projects';
                    showProjectsDir();
                    break;
                case 'resume':
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
                case 'feel_cv':
                    showProject('feel_cv', `
<b>feel_cv</b>
A browser extension that fills up your relevant information but extracting that information 
from the uploaded cv(.docx, .txt, .pdf) with the help of openAI.

Type './link' to open the project repository.
`);
                    break;
                case 'meowtech_innovateathon':
                    showProject('meowtech_innovateathon', `
<b>MeowTech INNOVATEathon</b>
Built a project with intel oneAPI, that analyzes the audio real time predicting the emotion 
of the audio and suggest you books on the basis of your mood.

Type './link' to open the project repository.
`);
                    break;
                case 'gta6_sales_prediction':
                    showProject('gta6_sales_prediction', `
<b>GTA6 sales prediction</b>
Prediction for GTA6 sales based on the trailer hype and reaction from YouTube, X.com, 
Instagram and other web articles.

Type './link' to open the project repository.
`);
                    break;
                case 'stock_market_analysis':
                    showProject('stock_market_analysis', `
<b>stock market analysis</b>
Final year project, predicting stocks for various famous company using LSTM and rainfall model.

Type './link' to open the project repository.
`);
                    break;
                case '..':
                    currentDir = '~';
                    addToOutput(`<div class="response">Returned to home directory</div>`);
                    break;
                default:
                    addToOutput(`<div class="error">Project not found: ${target}</div>`);
            }
        } else if (currentDir === '~/contact_me') {
            switch(target) {
                case 'github':
                    window.open('https://github.com/cytric-74', '_blank');
                    addToOutput(`<div class="response">Opening GitHub profile...</div>`);
                    break;
                case 'linkedin':
                    window.open('https://linkedin.com/in/roh28j', '_blank');
                    addToOutput(`<div class="response">Opening LinkedIn profile...</div>`);
                    break;
                case 'mail':
                    window.open('mailto:workatrohh@gmail.com', '_blank');
                    addToOutput(`<div class="response">Opening email client...</div>`);
                    break;
                case 'instagram':
                    window.open('https://instagram.com/yourprofile', '_blank');
                    addToOutput(`<div class="response">Opening Instagram profile...</div>`);
                    break;
                case 'twitter':
                    window.open('https://twitter.com/yourprofile', '_blank');
                    addToOutput(`<div class="response">Opening Twitter profile...</div>`);
                    break;
                case 'discord':
                    addToOutput(`<div class="response">Discord: yourusername#1234</div>`);
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
<b>Rohan Sharma</b>
Data Analyst | Computer Science Engineer

<b>About Me:</b>
I'm a passionate data analyst with a strong background in computer science. 
I enjoy solving complex problems using data-driven approaches and building 
innovative projects that bridge technology and real-world applications.

<b>Education:</b>
- B.Tech in Computer Science and Engineering
  Siliguri Institute of Technology (2020-2024)
  CGPA: 9.0

<b>Research Interests:</b>
- Computational Fluid Dynamics (CFD) and Particle-Based Simulations
- Graph-Based Verification and Model Checking
- Machine Learning and AI applications

<b>Hobbies:</b>
- Programming side projects
- Learning new technologies
- Open source contributions
- Reading tech blogs and research papers
`;
        addToOutput(`<div class="response">${aboutText}</div>`);
    }
    
    function showSkills() {
        const skillsText = `
<b>Technical Skills:</b>

<b>Efficient with:</b>
Python  Java  MySQL  PowerBI  Tableau  REST  Git  Seaborn  Excel/Sheets  pySpark

<b>Familiar with:</b>
JavaScript  TypeScript  React  Databricks  PostgreSQL  AWS (EC2, S3)  R  HuggingFace

<b>Currently Learning:</b>
CFD  React (advanced)  Google Cloud Platform (BigQuery, Compute Engine)  ANOVA
`;
        addToOutput(`<div class="response">${skillsText}</div>`);
    }
    
    function showWorkExp() {
        const workText = `
<b>Professional Experience:</b>

<b>Darwin Box</b>
- Improved efficiency by 4%
- Automated reporting pipelines using Python, reducing manual effort
- Implemented preventive maintenance strategies, resulting in 20% decrease in equipment downtime
- Identified bottlenecks in workflow and suggested actionable insights

<b>Rdr.inc</b>
- Analyzed complex datasets to identify trends and mitigate risks
- Coordinated testing and validation, ensuring compliance with industry standards
- Developed predictive models using machine learning techniques
- Delivered data-driven insights to support strategic decision-making
`;
        addToOutput(`<div class="response">${workText}</div>`);
    }
    
    function showProjectsDir() {
        showAsciiArt(`
   _____           _           _   
  |  __ \\         | |         | |  
  | |__) |__  _ __| |_ ___  __| |  
  |  ___/ _ \\| '__| __/ _ \\/ _\` |  
  | |  | (_) | |  | ||  __/ (_| |  
  |_|   \\___/|_|   \\__\\___|\\__,_|  
`);
        addToOutput(`<div class="response">Entered projects directory. Use 'ls' to view projects.</div>`);
    }
    
    function showContactDir() {
        showAsciiArt(`
   _____          _   _             
  / ____|        | | (_)            
 | |     ___   __| |_ _ _ __   __ _ 
 | |    / _ \\ / _\` | | '_ \\ / _\` |
 | |___| (_) | (_| | | | | | (_| | 
  \\_____\\___/ \\__,_|_|_| |_|\\__, | 
                              __/ | 
                             |___/  
`);
        addToOutput(`<div class="response">Entered contact directory. Use 'ls' to view contact methods.</div>`);
    }
    
    function showProject(projectName, description) {
        currentDir = `~/projects/${projectName}`;
        showAsciiArt(`
    ____             __            
   / __ \\____ ______/ /_____  _____
  / /_/ / __ \`/ ___/ //_/ _ \\/ ___/
 / ____/ /_/ / /__/ ,< /  __/ /    
/_/    \\__,_/\\___/_/|_|\\___/_/     
`);
        addToOutput(`<div class="response">${description}</div>`);
    }
    
    function handleLink() {
        if (currentDir.startsWith('~/projects/')) {
            const project = currentDir.split('/')[2];
            
            // These would be your actual project links
            const links = {
                'feel_cv': '#',
                'meowtech_innovateathon': '#',
                'gta6_sales_prediction': '#',
                'stock_market_analysis': '#'
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