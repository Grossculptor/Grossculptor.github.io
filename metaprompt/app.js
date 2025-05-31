// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupTabs();
    setupCopyButtons();
    setupPlayground();
    setupTemplates();
    setupTechniqueCards();
}

// Navigation System
function setupNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    const sections = document.querySelectorAll('.section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Update active sidebar link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // Smooth scroll to top of content
            document.querySelector('.content').scrollTop = 0;
        });
    });

    // Handle hash navigation on page load
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetLink = document.querySelector(`[data-section="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

// Tab System
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            const container = this.closest('.section');
            
            // Update active tab button
            container.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show target tab panel
            container.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// Copy to Clipboard
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-copy');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const textToCopy = targetElement.textContent || targetElement.innerText;
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Visual feedback
                    const originalText = this.textContent;
                    this.textContent = '✓ Copied!';
                    this.style.background = '#22c55e';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback for older browsers
                    fallbackCopyTextToClipboard(textToCopy);
                });
            }
        });
    });
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

// Interactive Playground
function setupPlayground() {
    const generateBtn = document.getElementById('generate-response');
    const analyzeBtn = document.getElementById('analyze-prompt');
    const improveBtn = document.getElementById('improve-prompt');
    const promptInput = document.getElementById('prompt-input');
    const responseOutput = document.getElementById('response-output');
    const techniqueSelect = document.getElementById('technique-select');
    const modelSelect = document.getElementById('model-select');
    const analysisOutput = document.getElementById('analysis-output');

    if (generateBtn) {
        generateBtn.addEventListener('click', generateResponse);
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzePrompt);
    }
    
    if (improveBtn) {
        improveBtn.addEventListener('click', improvePrompt);
    }

    function generateResponse() {
        const prompt = promptInput.value.trim();
        const technique = techniqueSelect.value;
        const model = modelSelect.value;
        
        if (!prompt) {
            responseOutput.innerHTML = '<p class="response-placeholder">Please enter a prompt first.</p>';
            return;
        }
        
        // Show loading state
        responseOutput.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">Generating response...</p>';
        
        // Simulate API delay
        setTimeout(() => {
            const response = generateSimulatedResponse(prompt, technique, model);
            responseOutput.innerHTML = `<p>${response}</p>`;
        }, 1500);
    }

    function analyzePrompt() {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            return;
        }
        
        analysisOutput.classList.remove('hidden');
        const analysisContent = analysisOutput.querySelector('.analysis-content');
        
        // Show loading
        analysisContent.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">Analyzing prompt...</p>';
        
        setTimeout(() => {
            const analysis = generatePromptAnalysis(prompt);
            analysisContent.innerHTML = `<div>${analysis}</div>`;
        }, 1000);
    }

    function improvePrompt() {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            return;
        }
        
        analysisOutput.classList.remove('hidden');
        const analysisContent = analysisOutput.querySelector('.analysis-content');
        
        // Show loading
        analysisContent.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">Generating improvements...</p>';
        
        setTimeout(() => {
            const improvements = generatePromptImprovements(prompt);
            analysisContent.innerHTML = `<div>${improvements}</div>`;
        }, 1200);
    }
}

function generateSimulatedResponse(prompt, technique, model) {
    const responses = {
        'basic': {
            'claude': "I'll help explain machine learning to a 10-year-old! Think of machine learning like teaching a computer to recognize patterns, just like how you learned to recognize different animals. When you see a dog, you know it's a dog because you've seen many dogs before and learned what makes them special - four legs, tail wagging, barking sounds. Computers can learn the same way! We show them thousands of pictures of dogs, and they start to notice the patterns that make dogs different from cats or birds.",
            'gpt4': "Machine learning is a way to teach computers to learn patterns and make decisions, similar to how humans learn from experience. For a 10-year-old: Imagine you're learning to identify different types of dogs. At first, you might not know the difference between a Golden Retriever and a Labrador. But after seeing many examples and having someone tell you the differences, you start to recognize them on your own. Machine learning works similarly - we show computers lots of examples, and they learn to recognize patterns and make predictions about new things they haven't seen before.",
            'gemini': "Great question! Let me explain machine learning in a way that's fun and easy to understand. Think of machine learning like teaching your brain to get really good at guessing games. You know how after playing a game many times, you get better at predicting what will happen next? That's exactly what we do with computers! We give them lots and lots of examples (like showing them thousands of photos of cats and dogs), and gradually the computer gets really good at telling the difference between cats and dogs, even in photos it's never seen before.",
            'llama': "Machine learning is when we teach computers to learn patterns from examples, just like how you learn to recognize your friends' faces or favorite songs. The computer looks at lots of data and finds patterns to make predictions or decisions about new information it hasn't seen before."
        },
        'cot': {
            'claude': "Let me break down machine learning step by step for a 10-year-old:\n\n1. **What we're trying to do**: Teach a computer to recognize things and make smart guesses\n\n2. **How we start**: Just like when you were little and learned what a dog looks like by seeing many dogs\n\n3. **The learning process**: We show the computer thousands of examples with the right answers\n\n4. **Pattern recognition**: The computer starts noticing what makes each thing special\n\n5. **Testing time**: We give it new examples without the answers to see if it learned\n\n6. **Real-world use**: Now the computer can help identify things it's never seen before!\n\nIt's like training your brain to get really, really good at a guessing game!",
            'gpt4': "I'll explain machine learning step-by-step:\n\n**Step 1: Identify the goal**\nWe want to teach a computer to recognize and categorize things, just like humans do.\n\n**Step 2: Gather examples**\nWe collect thousands of examples with correct labels (like photos labeled 'dog' or 'cat').\n\n**Step 3: Pattern detection**\nThe computer analyzes all examples to find common features and patterns.\n\n**Step 4: Learning process**\nThe computer creates rules based on the patterns it discovered.\n\n**Step 5: Testing**\nWe test the computer with new examples to see if it learned correctly.\n\n**Step 6: Application**\nThe trained computer can now make predictions about new, unseen data.\n\nThink of it like learning to ride a bike - practice makes perfect!",
            'gemini': "Here's how machine learning works, broken down into simple steps:\n\n**Step 1: The Goal** - Teach a computer to be smart about something specific\n\n**Step 2: Collect Examples** - Gather lots and lots of examples (like if we want it to recognize animals, we'd show it thousands of animal photos)\n\n**Step 3: Show and Tell** - We show the computer each example and tell it what it is\n\n**Step 4: Pattern Hunting** - The computer looks for clues and patterns in all the examples\n\n**Step 5: Practice Time** - We test the computer with new examples it's never seen\n\n**Step 6: Success!** - If it does well, the computer has learned and can help us with new problems\n\nIt's like teaching a friend to recognize your favorite video game characters!",
            'llama': "Step-by-step explanation of machine learning:\n\n1. Define the problem we want the computer to solve\n2. Collect many examples of data related to that problem\n3. Show the computer these examples along with the correct answers\n4. The computer finds patterns in the data\n5. Test the computer's understanding with new examples\n6. Use the trained computer to make predictions on new data\n\nThis process is similar to how you learned to recognize letters and numbers in school."
        },
        'few-shot': {
            'claude': "Here are some examples to help explain machine learning:\n\n**Example 1**: Teaching a computer to recognize spam emails\n- Show it 1000 real emails labeled 'good'\n- Show it 1000 spam emails labeled 'spam'\n- Computer learns patterns (spam often has words like 'FREE!' or 'URGENT!')\n- Result: Computer can now identify new spam emails\n\n**Example 2**: Teaching a computer to recommend movies\n- Show it what movies thousands of people liked\n- Computer learns patterns (people who like action movies often like superhero movies)\n- Result: Computer can suggest movies you might enjoy\n\n**Your turn**: Just like these examples, machine learning helps computers get smart by learning from lots of examples, then using what they learned to help with new situations!",
            'gpt4': "Let me show you machine learning through examples:\n\n**Example A**: Photo Recognition\n- Input: 10,000 labeled photos of cats and dogs\n- Learning: Computer identifies features (pointy ears, wet noses, etc.)\n- Output: Can correctly identify cats vs dogs in new photos\n\n**Example B**: Music Recommendations\n- Input: Millions of user music preferences and ratings\n- Learning: Computer finds patterns in listening habits\n- Output: Suggests new songs you'll probably like\n\n**Example C**: Language Translation\n- Input: Thousands of sentence pairs in different languages\n- Learning: Computer maps relationships between words and grammar\n- Output: Can translate new sentences between languages\n\n**Pattern**: In each case, lots of examples → pattern learning → smart predictions!",
            'gemini': "Let me give you some fun examples of machine learning:\n\n**Example 1**: Smart Photo Albums\n- We show the computer 5,000 photos of you and your family\n- It learns to recognize each person's face\n- Now it can automatically sort new photos by who's in them!\n\n**Example 2**: Video Game AI\n- We let the computer play a game thousands of times\n- It learns which moves lead to winning or losing\n- Eventually it becomes super good at the game!\n\n**Example 3**: Voice Assistants\n- We teach the computer by showing it millions of voice recordings and what people said\n- It learns to understand different accents and words\n- Now it can understand when you ask it questions!\n\n**The Pattern**: Give lots of examples → Computer finds patterns → Computer gets smart!",
            'llama': "Examples of machine learning in action:\n\n**Example 1**: Email Sorting\n- Training: Show computer 1000 important emails vs 1000 spam emails\n- Learning: Computer identifies patterns in word usage and formatting\n- Application: Computer can now sort new emails automatically\n\n**Example 2**: Game Playing\n- Training: Computer plays chess millions of times against itself\n- Learning: Computer discovers winning strategies and patterns\n- Application: Computer becomes expert chess player\n\n**Example 3**: Image Recognition\n- Training: Show computer millions of labeled images\n- Learning: Computer learns visual features that distinguish objects\n- Application: Computer can identify objects in new images\n\nNotice the pattern: training data → learning process → practical application."
        },
        'structured': {
            'claude': `<explanation target="10-year-old">
<concept>Machine Learning</concept>

<analogy>
Think of machine learning like training a pet, but instead of a dog or cat, we're training a computer brain!
</analogy>

<process>
<step number="1">Gathering Examples</step>
We show the computer thousands of examples, like photos of different animals.

<step number="2">Pattern Recognition</step>
The computer notices what makes each animal special - dogs have floppy ears, cats have whiskers, birds have feathers.

<step number="3">Testing</step>
We show it new pictures it's never seen and ask "What animal is this?"

<step number="4">Success</step>
If our computer brain learned well, it can tell us the right answer!
</process>

<real_world_examples>
- Photo apps that recognize your friends' faces
- Music apps that suggest songs you'll like
- Games that get harder as you get better
</real_world_examples>

<summary>
Machine learning is teaching computers to be smart by showing them lots of examples, just like how you learned to read by seeing lots of words!
</summary>
</explanation>`,
            'gpt4': `<response format="educational" audience="child">
<topic>Machine Learning Explanation</topic>

<definition>
Machine learning is a method of teaching computers to learn patterns and make decisions from data, similar to how humans learn from experience.
</definition>

<child_friendly_explanation>
<comparison>
Just like you learned to recognize different types of cars by seeing many examples, computers can learn to recognize patterns in information.
</comparison>

<steps>
1. Data Collection: Gather many examples (like thousands of photos)
2. Training: Show the computer these examples with correct labels
3. Pattern Recognition: Computer finds similarities and differences
4. Testing: Check if computer learned correctly with new examples
5. Application: Use the trained computer to solve real problems
</steps>

<examples>
• Photo tagging: Computer learns to identify people in pictures
• Recommendations: Computer suggests movies based on what you've watched
• Games: Computer learns to play games by practicing millions of times
</examples>
</child_friendly_explanation>

<key_takeaway>
Machine learning helps computers get smarter by learning from examples, just like how practice makes you better at sports or music!
</key_takeaway>
</response>`,
            'gemini': `<educational_response>
<audience>10-year-old student</audience>
<topic>Machine Learning Fundamentals</topic>

<introduction>
Machine learning is like giving a computer a super-powered brain that can learn new things!
</introduction>

<main_explanation>
<what_it_is>
It's a way to teach computers to recognize patterns and make smart guesses about new things they see.
</what_it_is>

<how_it_works>
<phase name="learning">
We show the computer tons of examples with the right answers, like showing it 1000 pictures of dogs and saying "this is a dog" each time.
</phase>

<phase name="understanding">
The computer starts noticing patterns - "Oh, dogs usually have four legs, fur, and tails that wag!"
</phase>

<phase name="testing">
We show it a new dog picture (without telling it what it is) and ask "What is this?"
</phase>

<phase name="success">
If it says "That's a dog!" then it learned successfully!
</phase>
</how_it_works>

<fun_examples>
• Netflix knowing what shows you'll like
• Your phone recognizing your face to unlock
• Video games that adapt to how well you play
</fun_examples>
</main_explanation>

<conclusion>
Machine learning is everywhere, helping computers be helpful assistants in our daily lives!
</conclusion>
</educational_response>`,
            'llama': `<structured_explanation>
<target_audience>10-year-old</target_audience>
<subject>Machine Learning</subject>

<core_concept>
Machine learning teaches computers to learn patterns from examples, similar to how humans learn through practice and repetition.
</core_concept>

<step_by_step_process>
<step id="1" name="data_gathering">
Collect thousands of examples with known correct answers
</step>

<step id="2" name="pattern_identification">
Computer analyzes examples to find common characteristics
</step>

<step id="3" name="model_training">
Computer creates rules based on discovered patterns
</step>

<step id="4" name="testing_phase">
Evaluate computer's performance on new, unseen examples
</step>

<step id="5" name="practical_application">
Deploy trained computer to solve real-world problems
</step>
</step_by_step_process>

<relatable_examples>
<example type="recognition">Learning to identify different dog breeds from photos</example>
<example type="prediction">Suggesting which movie you might enjoy watching</example>
<example type="optimization">Getting better at playing video games through practice</example>
</relatable_examples>

<summary>
Machine learning enables computers to improve their performance on tasks through experience, much like how children learn and improve through practice.
</summary>
</structured_explanation>`
        }
    };

    return responses[technique]?.[model] || responses['basic'][model] || "I'll help explain machine learning in a simple way! Machine learning is like teaching a computer to recognize patterns and make smart decisions by showing it lots of examples, similar to how you learn new things by practicing and seeing many examples.";
}

function generatePromptAnalysis(prompt) {
    const analysis = [];
    
    // Analyze clarity
    if (prompt.length < 20) {
        analysis.push("⚠️ **Clarity**: Prompt might be too brief. Consider adding more specific details about what you want.");
    } else if (prompt.length > 500) {
        analysis.push("⚠️ **Length**: Prompt is quite long. Consider breaking it into smaller, more focused instructions.");
    } else {
        analysis.push("✅ **Clarity**: Good length and appears clear.");
    }
    
    // Analyze specificity
    const vagueWords = ['good', 'nice', 'better', 'some', 'many', 'few'];
    const hasVagueWords = vagueWords.some(word => prompt.toLowerCase().includes(word));
    if (hasVagueWords) {
        analysis.push("⚠️ **Specificity**: Contains vague terms. Try to be more specific with your requirements.");
    } else {
        analysis.push("✅ **Specificity**: Uses specific language.");
    }
    
    // Check for examples
    if (prompt.toLowerCase().includes('example') || prompt.toLowerCase().includes('for instance')) {
        analysis.push("✅ **Examples**: Good use of examples to clarify intent.");
    } else {
        analysis.push("💡 **Examples**: Consider adding examples to improve clarity.");
    }
    
    // Check for output format
    if (prompt.toLowerCase().includes('format') || prompt.toLowerCase().includes('structure')) {
        analysis.push("✅ **Output Format**: Specifies desired output format.");
    } else {
        analysis.push("💡 **Output Format**: Consider specifying the desired output format.");
    }
    
    // Check for role definition
    if (prompt.toLowerCase().includes('you are') || prompt.toLowerCase().includes('act as')) {
        analysis.push("✅ **Role Definition**: Clear role or persona defined.");
    } else {
        analysis.push("💡 **Role Definition**: Consider defining a specific role or persona for the AI.");
    }
    
    return analysis.join('\n\n');
}

function generatePromptImprovements(prompt) {
    let improved = prompt;
    const suggestions = [];
    
    // Suggest role definition
    if (!prompt.toLowerCase().includes('you are') && !prompt.toLowerCase().includes('act as')) {
        suggestions.push("**Add Role Definition**: Start with 'You are an expert...' to establish context");
        improved = `You are an expert educator. ${improved}`;
    }
    
    // Suggest structure
    if (!prompt.toLowerCase().includes('step') && !prompt.toLowerCase().includes('first')) {
        suggestions.push("**Add Structure**: Break down the task into clear steps");
        improved = `${improved}\n\nPlease structure your response as follows:\n1. Main explanation\n2. Simple example\n3. Why this matters`;
    }
    
    // Suggest output format
    if (!prompt.toLowerCase().includes('format')) {
        suggestions.push("**Specify Output Format**: Define how you want the response structured");
    }
    
    // Suggest examples
    if (!prompt.toLowerCase().includes('example')) {
        suggestions.push("**Add Examples**: Include specific examples to guide the response");
    }
    
    return `**Improvement Suggestions:**\n${suggestions.join('\n')}\n\n**Improved Prompt:**\n\n${improved}`;
}

// Template System
function setupTemplates() {
    const templateButtons = document.querySelectorAll('.template-btn');
    const promptInput = document.getElementById('prompt-input');
    
    const templates = {
        'metaprompt': `You are an expert prompt engineer. Analyze the following prompt and suggest improvements:

[ORIGINAL PROMPT]

Please evaluate:
1. Clarity and specificity
2. Role definition (if applicable)  
3. Task structure and steps
4. Output format specification
5. Context and examples
6. Potential edge cases

Provide:
- 3 specific improvement suggestions
- A revised version of the prompt
- Explanation of changes made`,

        'structured': `<role>You are a [DEFINE ROLE HERE]</role>
<task>
[DESCRIBE THE MAIN TASK]
</task>

<context>
[PROVIDE RELEVANT CONTEXT]
</context>

<steps>
1. [FIRST STEP]
2. [SECOND STEP]  
3. [THIRD STEP]
</steps>

<output_format>
[SPECIFY DESIRED OUTPUT FORMAT]
</output_format>

<examples>
[PROVIDE RELEVANT EXAMPLES]
</examples>`,

        'few-shot': `Classify the following [TASK TYPE]:

Example 1: "[INPUT EXAMPLE 1]" → [OUTPUT 1]
Example 2: "[INPUT EXAMPLE 2]" → [OUTPUT 2]  
Example 3: "[INPUT EXAMPLE 3]" → [OUTPUT 3]

Now classify: "[NEW INPUT]"`,

        'cot': `Solve this step by step:

1. Identify what we know
2. Determine what we need to find
3. Choose the appropriate method
4. Work through the solution step by step
5. Verify the answer makes sense

Problem: [DESCRIBE YOUR PROBLEM HERE]`
    };
    
    templateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateType = this.getAttribute('data-template');
            const template = templates[templateType];
            
            if (template && promptInput) {
                promptInput.value = template;
                
                // Navigate to playground if not already there
                const playgroundLink = document.querySelector('[data-section="playground"]');
                if (playgroundLink) {
                    playgroundLink.click();
                }
                
                // Visual feedback
                this.textContent = '✓ Template Loaded';
                this.style.background = 'var(--color-success)';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.textContent = 'Use Template';
                    this.style.background = '';
                    this.style.color = '';
                }, 2000);
            }
        });
    });
}

// Technique Cards
function setupTechniqueCards() {
    const techniqueCards = document.querySelectorAll('.technique-card');
    
    techniqueCards.forEach(card => {
        card.addEventListener('click', function() {
            const technique = this.getAttribute('data-technique');
            if (technique) {
                const targetLink = document.querySelector(`[data-section="${technique}"]`);
                if (targetLink) {
                    targetLink.click();
                }
            }
        });
    });
}

// Utility Functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Handle smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function showLoading(element, message = 'Loading...') {
    element.innerHTML = `<div style="display: flex; align-items: center; gap: 8px; color: var(--color-text-secondary); font-style: italic;">
        <div style="width: 16px; height: 16px; border: 2px solid var(--color-border); border-top: 2px solid var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        ${message}
    </div>`;
}

// Add spinner animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Performance optimization: Debounce function for input handlers
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add intersection observer for animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.technique-card, .case-study, .principle-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

console.log('The Prompt Laboratory initialized successfully!');
