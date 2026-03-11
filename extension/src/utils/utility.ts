// @ts-nocheck

/**
 * Shows a list of improvements with fast typewriter effect and sliding speech bubbles
 * @param {HTMLElement} editor - The editor element to position relative to
 * @param {Array<string>} improvements - Array of improvement messages to display
 * @param {number} duration - Total duration in milliseconds to sync with rewriting animation
 * @param {"info"|"success"|"error"} [type="success"] - The type determines color scheme
 */
function lia_showTemporaryImprovements(editor, improvements, duration = 5000, type = "success") {
    if (!improvements || improvements.length === 0) return;

    const container = document.createElement("div")
    container.style.cssText = `
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: flex-start;
        gap: 12px;
        z-index: 10001;
        pointer-events: none;
    `

    // Color schemes
    const colors = {
        success: { avatar: "#10b981", bubble: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
        error: { avatar: "#ef4444", bubble: "#fef2f2", text: "#991b1b", border: "#fecaca" },
        info: { avatar: "#0a66c2", bubble: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
        warning: { avatar: "#f59e0b", bubble: "#fffbeb", text: "#92400e", border: "#fed7aa" },
    }

    const colorScheme = colors[type] || colors.success

    // Single persistent avatar with pulsing effect
    const avatarContainer = document.createElement("div")
    avatarContainer.style.cssText = `
        width: 44px;
        height: 44px;
        background: ${colorScheme.avatar};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${colorScheme.avatar}40;
        opacity: 0;
        transform: scale(0);
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        flex-shrink: 0;
        position: relative;
    `

    // Add pulsing ring
    const pulseRing = document.createElement("div")
    pulseRing.style.cssText = `
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 2px solid ${colorScheme.avatar};
        border-radius: 50%;
        opacity: 0;
        animation: pulse 2s infinite;
    `

    const pulseStyle = document.createElement("style")
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes slideInBubble {
            0% { 
                opacity: 0;
                transform: scale(0.7) translateY(15px) translateX(-20px);
            }
            100% { 
                opacity: 1;
                transform: scale(1) translateY(0) translateX(0);
            }
        }
        @keyframes slideOutBubble {
            0% { 
                opacity: 1;
                transform: scale(1) translateY(0) translateX(0);
            }
            100% { 
                opacity: 0;
                transform: scale(0.8) translateY(-10px) translateX(20px);
            }
        }
    `
    document.head.appendChild(pulseStyle)

    avatarContainer.appendChild(pulseRing)
    avatarContainer.innerHTML += `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
            <circle cx="16" cy="4" r="2" fill="white"/>
            <path d="M12 8a4 4 0 0 1 4-4" stroke="white"/>
        </svg>
    `

    // Speech bubble container for sliding messages
    const speechBubbleContainer = document.createElement("div")
    speechBubbleContainer.style.cssText = `
        position: relative;
        min-width: 280px;
        max-width: 320px;
    `

    container.appendChild(avatarContainer)
    container.appendChild(speechBubbleContainer)

    const editorParent = editor.closest('.share-box')
    editorParent.style.position = "relative"
    editorParent.appendChild(container)

    // Show avatar first
    setTimeout(() => {
        avatarContainer.style.opacity = "1"
        avatarContainer.style.transform = "scale(1)"
    }, 100)

    // Calculate timing for each improvement
    const improvementDuration = Math.max(1200, (duration - 800) / improvements.length) // Minimum 1.2s per improvement
    const typewriterSpeed = 8 // Fast typewriter (8ms per character)

    let currentImprovementIndex = 0
    let currentBubble = null

    // Helper to show next improvement with typewriter effect and wait for it to finish before removing bubble
    function showNextImprovement() {
        if (currentImprovementIndex >= improvements.length) {
            // All improvements shown, start cleanup
            setTimeout(() => {
                container.style.transform = "translateX(-50%) scale(0.8)"
                container.style.opacity = "0"
                setTimeout(() => {
                    container.remove()
                    pulseStyle.remove()
                }, 800)
            }, 500)
            return
        }

        const improvement = improvements[currentImprovementIndex]

        // Hide previous bubble if exists, but only after typewriter effect is done
        function removeCurrentBubble() {
            if (currentBubble) {
                currentBubble.style.animation = "slideOutBubble 0.3s ease-out forwards"
                setTimeout(() => {
                    if (currentBubble.parentNode) {
                        currentBubble.remove()
                    }
                }, 300)
            }
        }

        // Create new speech bubble
        const speechBubble = document.createElement("div")
        speechBubble.style.cssText = `
            position: relative;
            background: ${colorScheme.bubble};
            color: ${colorScheme.text};
            padding: 14px 18px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid ${colorScheme.border};
            opacity: 0;
            transform: scale(0.7) translateY(15px) translateX(-20px);
            backdrop-filter: blur(10px);
            animation: slideInBubble 0.4s ease-out forwards;
        `

        // Curved tail for modern look
        const bubbleTail = document.createElement("div")
        bubbleTail.style.cssText = `
            position: absolute;
            left: -8px;
            top: 15px;
            width: 20px;
            height: 20px;
            background: ${colorScheme.bubble};
            border: 1px solid ${colorScheme.border};
            border-right: none;
            border-bottom: none;
            transform: rotate(-45deg);
            border-radius: 4px 0 0 0;
        `

        const messageText = document.createElement("span")
        speechBubble.appendChild(bubbleTail)
        speechBubble.appendChild(messageText)
        speechBubbleContainer.appendChild(speechBubble)
        currentBubble = speechBubble

        // Fast typewriter effect, returns a Promise that resolves when done
        function typewriterEffect(text, el) {
            return new Promise(resolve => {
                let i = 0
                function typeMessage() {
                    if (i <= text.length) {
                        el.textContent = text.substring(0, i) + (i < text.length ? "▋" : "")
                        i++
                        if (i <= text.length) {
                            setTimeout(typeMessage, typewriterSpeed)
                        } else {
                            resolve()
                        }
                    }
                }
                typeMessage()
            })
        }

        // Wait for typewriter to finish, then schedule next improvement and remove bubble
        setTimeout(() => {
            typewriterEffect(improvement, messageText).then(() => {
                setTimeout(() => {
                    removeCurrentBubble()
                    currentImprovementIndex++
                    setTimeout(showNextImprovement, 320) // Wait for bubble out animation
                }, Math.max(800, improvementDuration - (improvement.length * typewriterSpeed) - 400))
            })
        }, 400)
    }

    // Start showing improvements after avatar appears
    setTimeout(() => {
        showNextImprovement()
    }, 400)
}

function cleanAIResponse(str) {
  str = str.trim();
  while ((str.startsWith('"') && str.endsWith('"')) || 
         (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

function showImprovementsMade(editor, improvements, originalText) {
    if (!improvements || improvements.length === 0) return;

    // Remove any existing card
    const existing = editor.querySelector('.lia-improvements-card');
    if (existing) existing.remove();

    // Card container
    const card = document.createElement("div");
    card.className = "lia-improvements-card";
    card.style.cssText = `
        position: absolute;
        right: 25px;
        bottom: 65px;
        min-width: 320px;
        max-width: 380px;
        background: #f0fdf4;
        color: #166534;
        border-radius: 18px 18px 24px 24px;
        box-shadow: 0 8px 32px rgba(16,185,129,0.13), 0 1.5px 8px #bbf7d0;
        padding: 20px 24px 18px 24px;
        opacity: 0;
        transform: translateY(40px) scale(0.97);
        transition: opacity 0.35s cubic-bezier(.4,1.4,.6,1), transform 0.35s cubic-bezier(.4,1.4,.6,1);
        z-index: 10002;
        pointer-events: auto;
        font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    `;

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 14px;
        background: none;
        border: none;
        color: #10b981;
        font-size: 22px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        z-index: 1;
    `;
    closeBtn.onmouseenter = () => closeBtn.style.opacity = "1";
    closeBtn.onmouseleave = () => closeBtn.style.opacity = "0.7";
    closeBtn.onclick = () => card.remove();
    card.appendChild(closeBtn);

    // Title
    const title = document.createElement("div");
    title.textContent = "Improvements made:";
    title.style.cssText = `
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 10px;
        letter-spacing: 0.01em;
    `;
    card.appendChild(title);

    // List of improvements
    const ul = document.createElement("ul");
    ul.style.cssText = `
        list-style: none;
        margin: 0;
        padding: 0;
    `;
    improvements.forEach((improvement, idx) => {
        const li = document.createElement("li");
        li.textContent = improvement;
        li.style.cssText = `
            background: #fff;
            color: #166534;
            border-radius: 10px;
            margin-bottom: 8px;
            padding: 9px 14px 9px 12px;
            font-size: 14px;
            box-shadow: 0 1.5px 6px #bbf7d0;
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.35s cubic-bezier(.4,1.4,.6,1), transform 0.35s cubic-bezier(.4,1.4,.6,1);
            will-change: opacity, transform;
        `;
        setTimeout(() => {
            li.style.opacity = "1";
            li.style.transform = "translateY(0)";
        }, 200 + idx * 120);
        ul.appendChild(li);
    });
    card.appendChild(ul);

    // Undo button (if originalText is provided)
    if (typeof originalText === "string") {
        const undoBtn = document.createElement("button");
        undoBtn.textContent = "Undo";
        undoBtn.setAttribute("aria-label", "Undo improvements");
        undoBtn.style.cssText = `
            margin-top: 12px;
            background: #fff;
            color: #10b981;
            border: 1.5px solid #bbf7d0;
            border-radius: 8px;
            padding: 7px 18px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 1.5px 6px #bbf7d0;
            transition: background 0.2s, color 0.2s, border 0.2s;
            display: block;
        `;
        undoBtn.onmouseenter = () => {
            undoBtn.style.background = "#f0fdf4";
            undoBtn.style.color = "#166534";
            undoBtn.style.borderColor = "#10b981";
        };
        undoBtn.onmouseleave = () => {
            undoBtn.style.background = "#fff";
            undoBtn.style.color = "#10b981";
            undoBtn.style.borderColor = "#bbf7d0";
        };
        undoBtn.onclick = () => {
            // Try to set the original text back to the editor
            // Support textarea, input, or contenteditable
            if (editor.tagName === "TEXTAREA" || editor.tagName === "INPUT") {
                editor.value = originalText;
                editor.dispatchEvent(new Event("input", { bubbles: true }));
            } else if (editor.isContentEditable) {
                editor.innerText = originalText;
                editor.dispatchEvent(new Event("input", { bubbles: true }));
            }
            card.remove();

            window.showTemporaryMessage(editor, "Improvements undone", "info");
        };
        card.appendChild(undoBtn);
    }

    // V-pointer (bubble tail)
    const pointer = document.createElement("div");
    pointer.style.cssText = `
        position: absolute;
        left: 50%;
        bottom: -18px;
        transform: translateX(-50%);
        width: 36px;
        height: 18px;
        pointer-events: none;
        z-index: 0;
    `;
    pointer.innerHTML = `
        <svg width="36" height="18" viewBox="0 0 36 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0 Q18 24 36 0" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
        </svg>
    `;
    card.appendChild(pointer);

    // Animate card in
    setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
    }, 30);

    // Remove card after 8s unless closed or undo is clicked
    const autoRemove = setTimeout(() => {
        card.style.opacity = "0";
        card.style.transform = "translateY(40px) scale(0.97)";
        setTimeout(() => card.remove(), 400);
    }, 20000);

    // Cancel auto-remove if closed manually
    closeBtn.onclick = () => {
        clearTimeout(autoRemove);
        card.style.opacity = "0";
        card.style.transform = "translateY(40px) scale(0.97)";
        setTimeout(() => card.remove(), 350);
    };

    // Attach card to editor's parent (relative positioning)
    const parent = editor.closest('.share-box') || editor;
    parent.style.position = "relative";
    parent.appendChild(card);
}

window.cleanAIResponse = cleanAIResponse
window.lia_showTemporaryImprovements = lia_showTemporaryImprovements
window.showImprovementsMade = showImprovementsMade