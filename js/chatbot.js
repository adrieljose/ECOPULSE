/**
 * EcoPulse Floating Chatbot
 * Powered by Google Gemini API (via api/chat.php)
 */

const EcoBot = {
    init() {
        this.injectUI();
        this.bindEvents();
        setTimeout(
            () =>
                this.addMessage(
                    "Hi! I'm ECO AI - here to guide admins and users. Ask for a system health check, sensor uptime, or what today's air quality means for you.",
                    "bot"
                ),
            1000
        );
    },

    injectUI() {
        const html = `
            <div id="ecoBotLauncher" class="ecobot-launcher" title="Chat with ECO AI">
                <i class="fa-solid fa-robot"></i>
                <span class="ecobot-launcher-label">ECO AI</span>
            </div>
            <div id="ecoBotWindow" class="ecobot-window">
                <div class="ecobot-header">
                    <div class="d-flex align-items-center">
                        <div class="ecobot-avatar me-2"><i class="fa-solid fa-robot"></i></div>
                        <div>
                            <div class="fw-bold">ECO AI</div>
                            <div class="ecobot-meta">Guiding admins & users</div>
                        </div>
                    </div>
                    <button id="ecoBotClose" class="btn btn-link text-white p-0"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div id="ecoBotMessages" class="ecobot-messages">
                    <div class="ecobot-helper">
                        <div class="helper-headline">
                            <span>How can I help right now?</span>
                            <span class="helper-note">Quick prompts for admins and users</span>
                        </div>
                        <div class="helper-grid">
                            <div class="helper-card">
                                <h6>Admins</h6>
                                <p>Check system health, alerts, and uptime.</p>
                                <div class="d-flex flex-wrap gap-2">
                                    <button class="ecobot-chip" data-template="Give me a quick system health check and flag any sensors that look offline."><i class="fa-solid fa-heart-pulse"></i>Health check</button>
                                    <button class="ecobot-chip" data-template="Show me any alerts or anomalies in the last 24 hours and what to do next."><i class="fa-solid fa-bell"></i>Alerts & actions</button>
                                </div>
                            </div>
                            <div class="helper-card">
                                <h6>Users</h6>
                                <p>Understand air quality and safe actions.</p>
                                <div class="d-flex flex-wrap gap-2">
                                    <button class="ecobot-chip" data-template="Explain today's air quality for residents and any health precautions they should take."><i class="fa-solid fa-people-roof"></i>Resident guidance</button>
                                    <button class="ecobot-chip" data-template="Summarize outdoor activity guidance for sensitive groups based on current readings."><i class="fa-solid fa-person-walking"></i>Activity tips</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ecobot-quick-actions">
                    <button class="ecobot-chip" data-template="Give me a 30-second system snapshot: online sensors, offline devices, and any alerts to watch."><i class="fa-solid fa-gauge-high"></i>System snapshot</button>
                    <button class="ecobot-chip" data-template="List any sensors that look offline or stale and tell me what to check first."><i class="fa-solid fa-plug-circle-xmark"></i>Offline check</button>
                    <button class="ecobot-chip" data-template="Explain today's air quality for residents in simple terms and what precautions to take."><i class="fa-solid fa-people-roof"></i>Resident brief</button>
                </div>
                <div class="ecobot-input-area">
                    <div class="input-group">
                        <input type="text" id="ecoBotInput" class="form-control" placeholder="Ask about system..." aria-label="Ask about air quality">
                        <button class="btn btn-primary" id="ecoBotSend"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", html);
    },

    bindEvents() {
        const launcher = document.getElementById("ecoBotLauncher");
        const windowEl = document.getElementById("ecoBotWindow");
        const closeBtn = document.getElementById("ecoBotClose");
        const sendBtn = document.getElementById("ecoBotSend");
        const input = document.getElementById("ecoBotInput");

        const toggleChat = () => {
            windowEl.classList.toggle("active");
            launcher.classList.toggle("active");
            if (windowEl.classList.contains("active")) input.focus();
        };

        launcher.addEventListener("click", toggleChat);
        closeBtn.addEventListener("click", toggleChat);

        const sendMessage = () => {
            const msg = input.value.trim();
            if (!msg) return;

            this.addMessage(msg, "user");
            input.value = "";

            this.processMessage(msg);
        };

        sendBtn.addEventListener("click", sendMessage);
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });

        document.body.addEventListener("click", (e) => {
            const chip = e.target.closest(".ecobot-chip");
            if (!chip) return;
            const template = chip.dataset.template || "";
            if (!template.trim()) return;
            input.value = template;
            sendMessage();
        });
    },

    addMessage(text, type) {
        const container = document.getElementById("ecoBotMessages");
        const div = document.createElement("div");
        div.className = `message message-${type}`;
        div.innerHTML = text.replace(/\n/g, "<br>");
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    addTypingIndicator() {
        const container = document.getElementById("ecoBotMessages");
        const id = "typing-" + Date.now();
        const div = document.createElement("div");
        div.id = id;
        div.className = "message message-bot typing-indicator";
        div.innerHTML = "<span>.</span><span>.</span><span>.</span>";
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return id;
    },

    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    // --- Logic Core (Gemini API) ---
    async processMessage(msg) {
        const typingId = this.addTypingIndicator();

        const context = {
            aqi: document.getElementById("mainAqiValue")?.textContent || "--",
            status: document.getElementById("mainAqiStatus")?.textContent || "Unknown",
            health: document.getElementById("healthAdvice")?.textContent || "No specific advice available.",
            pm25: document.getElementById("mainPm25")?.textContent || "--",
            temp: document.getElementById("mainTemp")?.textContent || "--",
        };

        try {
            const response = await fetch("api/chat.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg, context }),
            });

            if (!response.ok) throw new Error("Network error");
            const data = await response.json();

            this.removeTypingIndicator(typingId);
            this.addMessage(data.reply, "bot");
        } catch (error) {
            console.error(error);
            this.removeTypingIndicator(typingId);
            this.addMessage("I'm having trouble reaching the server. Please check your connection.", "bot");
        }
    },
};

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("ecoBotLauncher")) {
        EcoBot.init();
    }
});
