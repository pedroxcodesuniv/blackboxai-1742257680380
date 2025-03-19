// Simulated database of symptoms and conditions
const symptomsDB = {
    'dor de cabeça': {
        severity: 'mild',
        recommendations: [
            'Descansar em um ambiente calmo e escuro',
            'Beber bastante água',
            'Considerar uso de analgésicos comuns'
        ],
        specialists: ['Clínico Geral', 'Neurologista']
    },
    'febre': {
        severity: 'moderate',
        recommendations: [
            'Monitorar a temperatura',
            'Manter-se hidratado',
            'Tomar antitérmico conforme necessário'
        ],
        specialists: ['Clínico Geral', 'Infectologista']
    },
    'falta de ar': {
        severity: 'severe',
        recommendations: [
            'Procurar atendimento médico imediatamente',
            'Manter-se em posição sentada',
            'Evitar esforços físicos'
        ],
        specialists: ['Pneumologista', 'Cardiologista']
    }
};

class HealthChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleUserMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserMessage();
            }
        });

        // Quick reply buttons
        document.querySelectorAll('.bg-gray-100').forEach(button => {
            button.addEventListener('click', () => {
                this.chatInput.value = button.textContent;
                this.handleUserMessage();
            });
        });
    }

    async handleUserMessage() {
        const message = this.chatInput.value.trim().toLowerCase();
        if (!message) return;

        // Display user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Process the message and get response
        const response = await this.processUserMessage(message);
        
        // Remove typing indicator and show response
        this.removeTypingIndicator();
        this.addMessage(response, 'bot');

        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async processUserMessage(message) {
        // Simulate API call to Infermedica
        try {
            const symptoms = await this.analyzeSymptoms(message);
            return this.formatResponse(symptoms);
        } catch (error) {
            return 'Desculpe, estou tendo dificuldades para processar sua mensagem. Por favor, tente novamente.';
        }
    }

    async analyzeSymptoms(message) {
        // Simulate API processing
        let severity = 'mild';
        let recommendations = [];
        let specialists = [];

        // Check for keywords in the message
        for (const [symptom, data] of Object.entries(symptomsDB)) {
            if (message.includes(symptom)) {
                severity = data.severity;
                recommendations = data.recommendations;
                specialists = data.specialists;
                break;
            }
        }

        return { severity, recommendations, specialists };
    }

    formatResponse(symptoms) {
        const severityMessages = {
            mild: '🟢 Seus sintomas parecem leves.',
            moderate: '🟡 Seus sintomas requerem atenção.',
            severe: '🔴 Seus sintomas são graves e requerem atenção imediata.'
        };

        let response = `${severityMessages[symptoms.severity]}\n\n`;
        response += 'Recomendações:\n';
        symptoms.recommendations.forEach(rec => {
            response += `• ${rec}\n`;
        });
        
        response += '\nEspecialistas recomendados:\n';
        symptoms.specialists.forEach(spec => {
            response += `• ${spec}\n`;
        });

        // If symptoms are severe, add emergency message
        if (symptoms.severity === 'severe') {
            response += '\n⚠️ ATENÇÃO: Procure atendimento médico imediatamente ou ligue para emergência (192).';
        }

        return response;
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start ' + (sender === 'user' ? 'justify-end' : '');

        const iconDiv = document.createElement('div');
        iconDiv.className = 'flex-shrink-0 ' + (sender === 'user' ? 'order-2 ml-3' : 'mr-3');
        iconDiv.innerHTML = sender === 'user' 
            ? '<i class="fas fa-user text-gray-500 text-xl"></i>'
            : '<i class="fas fa-robot text-blue-500 text-xl"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = sender === 'user'
            ? 'bg-blue-500 text-white rounded-lg p-3 max-w-3/4 order-1'
            : 'bg-blue-50 text-gray-900 rounded-lg p-3 max-w-3/4';
        contentDiv.innerHTML = content.replace(/\n/g, '<br>');

        messageDiv.appendChild(iconDiv);
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex items-start';
        indicator.innerHTML = `
            <div class="flex-shrink-0 mr-3">
                <i class="fas fa-robot text-blue-500 text-xl"></i>
            </div>
            <div class="bg-blue-50 rounded-lg p-3 max-w-3/4">
                <div class="flex space-x-2">
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(indicator);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new HealthChatbot();
});
