// Simulated SUS (Sistema Único de Saúde) database
const susDatabase = {
    symptoms: {
        'dor de cabeça': {
            id: 'headache',
            possibleConditions: ['enxaqueca', 'tensão', 'sinusite'],
            urgencyLevel: 'low',
            commonCauses: [
                'Estresse',
                'Desidratação',
                'Má postura',
                'Problemas de visão'
            ]
        },
        'febre': {
            id: 'fever',
            possibleConditions: ['gripe', 'covid-19', 'infecção'],
            urgencyLevel: 'medium',
            commonCauses: [
                'Infecções virais',
                'Infecções bacterianas',
                'Inflamações'
            ]
        },
        'tosse': {
            id: 'cough',
            possibleConditions: ['resfriado', 'bronquite', 'covid-19'],
            urgencyLevel: 'medium',
            commonCauses: [
                'Infecções respiratórias',
                'Alergias',
                'Refluxo gástrico'
            ]
        },
        'falta de ar': {
            id: 'shortness_of_breath',
            possibleConditions: ['asma', 'covid-19', 'ansiedade'],
            urgencyLevel: 'high',
            commonCauses: [
                'Doenças respiratórias',
                'Ansiedade',
                'Problemas cardíacos'
            ]
        },
        'dor no peito': {
            id: 'chest_pain',
            possibleConditions: ['angina', 'infarto', 'ansiedade'],
            urgencyLevel: 'high',
            commonCauses: [
                'Problemas cardíacos',
                'Ansiedade',
                'Problemas musculares'
            ]
        }
    },

    conditions: {
        'enxaqueca': {
            severity: 'moderate',
            requiresImediateAttention: false,
            recommendations: [
                'Repousar em ambiente escuro e silencioso',
                'Evitar luzes fortes e barulhos',
                'Consultar neurologista se frequente'
            ],
            medications: [
                'Analgésicos comuns',
                'Medicamentos específicos para enxaqueca (com prescrição)'
            ]
        },
        'covid-19': {
            severity: 'high',
            requiresImediateAttention: true,
            recommendations: [
                'Isolamento imediato',
                'Monitorar temperatura e saturação',
                'Procurar atendimento se sintomas graves'
            ],
            medications: [
                'Antitérmicos para febre',
                'Seguir prescrição médica'
            ]
        },
        'ansiedade': {
            severity: 'moderate',
            requiresImediateAttention: false,
            recommendations: [
                'Praticar exercícios de respiração',
                'Manter rotina de sono regular',
                'Buscar apoio psicológico'
            ],
            medications: [
                'Medicamentos ansiolíticos (apenas com prescrição)',
                'Chás calmantes'
            ]
        }
    },

    emergencyServices: {
        'SAMU': {
            phone: '192',
            when_to_call: [
                'Problemas cardíacos',
                'Acidentes graves',
                'Dificuldade respiratória severa'
            ]
        },
        'Bombeiros': {
            phone: '193',
            when_to_call: [
                'Acidentes com fogo',
                'Acidentes de trânsito',
                'Resgates'
            ]
        }
    },

    preventiveCare: {
        'checkups': [
            {
                type: 'Exame de sangue',
                frequency: 'Anual',
                importance: 'Detectar alterações metabólicas e doenças'
            },
            {
                type: 'Pressão arterial',
                frequency: 'Semestral',
                importance: 'Prevenir problemas cardiovasculares'
            }
        ],
        'vaccines': [
            {
                name: 'Gripe',
                frequency: 'Anual',
                target: 'População geral'
            },
            {
                name: 'COVID-19',
                frequency: 'Conforme calendário',
                target: 'População geral'
            }
        ]
    },

    // Função para avaliar a gravidade dos sintomas
    evaluateSymptoms(symptoms) {
        let urgencyScore = 0;
        let recommendations = [];
        let conditions = new Set();

        symptoms.forEach(symptom => {
            const symptomData = this.symptoms[symptom.toLowerCase()];
            if (symptomData) {
                switch (symptomData.urgencyLevel) {
                    case 'high':
                        urgencyScore += 3;
                        break;
                    case 'medium':
                        urgencyScore += 2;
                        break;
                    case 'low':
                        urgencyScore += 1;
                        break;
                }

                // Adicionar possíveis condições
                symptomData.possibleConditions.forEach(condition => {
                    conditions.add(condition);
                });
            }
        });

        // Determinar nível de urgência geral
        let urgencyLevel;
        if (urgencyScore >= 5) {
            urgencyLevel = 'severe';
            recommendations.push('Procure atendimento médico imediatamente');
        } else if (urgencyScore >= 3) {
            urgencyLevel = 'moderate';
            recommendations.push('Recomenda-se consulta médica em breve');
        } else {
            urgencyLevel = 'mild';
            recommendations.push('Monitore os sintomas e descanse');
        }

        return {
            urgencyLevel,
            recommendations,
            possibleConditions: Array.from(conditions)
        };
    },

    // Função para obter recomendações específicas
    getRecommendations(condition) {
        const conditionData = this.conditions[condition.toLowerCase()];
        if (conditionData) {
            return {
                severity: conditionData.severity,
                recommendations: conditionData.recommendations,
                medications: conditionData.medications
            };
        }
        return null;
    }
};

// Export the database for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = susDatabase;
} else {
    window.susDatabase = susDatabase;
}
