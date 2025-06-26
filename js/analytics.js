/**
 * Learning Analytics System for Cronologia Storica
 * Inspired by educational research on learning analytics dashboards and collaborative learning
 * 
 * Features:
 * - Performance tracking and analytics
 * - Collaborative learning insights
 * - Predictive analytics for learning outcomes
 * - Adaptive feedback system
 * - Peer comparison and social learning
 * 
 * References:
 * - Learning Analytics Dashboard research (Educational Technology Journal)
 * - Collaborative learning analytics (ScienceDirect)
 * - Spaced repetition effectiveness studies
 */

class LearningAnalytics {
    constructor() {
        this.data = this.loadAnalyticsData();
        this.sessions = [];
        this.collaborativeData = {
            studyGroups: [],
            peerInteractions: [],
            sharedResources: []
        };
        this.predictiveModel = new PredictiveAnalytics();
        this.adaptiveFeedback = new AdaptiveFeedbackSystem();
    }

    // Core Analytics Methods
    trackStudySession(sessionData) {
        const session = {
            id: this.generateId(),
            timestamp: new Date(),
            duration: sessionData.duration,
            activity: sessionData.activity, // 'flashcards', 'quiz', 'mindmap', 'timeline'
            performance: sessionData.performance,
            topics: sessionData.topics,
            difficulty: sessionData.difficulty,
            engagement: this.calculateEngagement(sessionData)
        };

        this.sessions.push(session);
        this.updateAnalytics(session);
        this.saveAnalyticsData();
        
        return session;
    }

    calculateEngagement(sessionData) {
        // Multi-factor engagement calculation
        const timeEngagement = Math.min(sessionData.duration / 1800, 1); // 30 min = max
        const accuracyEngagement = sessionData.performance.accuracy / 100;
        const interactionEngagement = sessionData.interactions ? 
            Math.min(sessionData.interactions / 50, 1) : 0.5;
        
        return (timeEngagement + accuracyEngagement + interactionEngagement) / 3;
    }

    // Dashboard Data Generation
    generateDashboardData() {
        const recentSessions = this.getRecentSessions(30); // Last 30 days
        
        return {
            overview: this.getOverviewMetrics(recentSessions),
            performance: this.getPerformanceMetrics(recentSessions),
            learning: this.getLearningMetrics(recentSessions),
            collaboration: this.getCollaborationMetrics(),
            predictions: this.predictiveModel.generatePredictions(recentSessions),
            recommendations: this.adaptiveFeedback.generateRecommendations(recentSessions)
        };
    }

    getOverviewMetrics(sessions) {
        return {
            totalSessions: sessions.length,
            totalStudyTime: sessions.reduce((sum, s) => sum + s.duration, 0),
            averageSessionLength: sessions.length > 0 ? 
                sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length : 0,
            streakDays: this.calculateStreakDays(),
            topicsStudied: [...new Set(sessions.flatMap(s => s.topics))].length,
            averageEngagement: sessions.length > 0 ?
                sessions.reduce((sum, s) => sum + s.engagement, 0) / sessions.length : 0
        };
    }

    getPerformanceMetrics(sessions) {
        const quizSessions = sessions.filter(s => s.activity === 'quiz');
        const flashcardSessions = sessions.filter(s => s.activity === 'flashcards');
        
        return {
            overallAccuracy: this.calculateAverageAccuracy(sessions),
            quizPerformance: this.analyzeQuizPerformance(quizSessions),
            flashcardRetention: this.analyzeFlashcardRetention(flashcardSessions),
            improvementTrend: this.calculateImprovementTrend(sessions),
            weakAreas: this.identifyWeakAreas(sessions),
            strongAreas: this.identifyStrongAreas(sessions)
        };
    }

    getLearningMetrics(sessions) {
        return {
            spacedRepetitionEffectiveness: this.analyzeSpacedRepetition(sessions),
            retentionRate: this.calculateRetentionRate(sessions),
            learningVelocity: this.calculateLearningVelocity(sessions),
            conceptMastery: this.analyzeConcepMastery(sessions),
            timeDistribution: this.analyzeTimeDistribution(sessions)
        };
    }

    getCollaborationMetrics() {
        return {
            studyGroupParticipation: this.analyzeStudyGroupParticipation(),
            peerLearningEffectiveness: this.analyzePeerLearning(),
            knowledgeSharing: this.analyzeKnowledgeSharing(),
            collaborativeProjects: this.analyzeCollaborativeProjects()
        };
    }

    // Predictive Analytics
    analyzeSpacedRepetition(sessions) {
        const spacedSessions = sessions.filter(s => s.activity === 'flashcards');
        const intervals = this.calculateReviewIntervals(spacedSessions);
        
        return {
            optimalIntervals: intervals.optimal,
            actualIntervals: intervals.actual,
            effectiveness: intervals.effectiveness,
            recommendations: intervals.recommendations
        };
    }

    calculateReviewIntervals(sessions) {
        if (!sessions || sessions.length === 0) {
            return {
                optimal: [],
                actual: [],
                effectiveness: 0,
                recommendations: ['Inizia a studiare con le flashcards per ottenere dati sugli intervalli']
            };
        }

        // Calcola intervalli ottimali basati sulla curva dell'oblio
        const optimalIntervals = [1, 3, 7, 14, 30, 90]; // giorni
        
        // Calcola intervalli reali dalle sessioni
        const actualIntervals = [];
        for (let i = 1; i < sessions.length; i++) {
            const prevSession = new Date(sessions[i-1].timestamp);
            const currentSession = new Date(sessions[i].timestamp);
            const daysDiff = Math.floor((currentSession - prevSession) / (1000 * 60 * 60 * 24));
            actualIntervals.push(daysDiff);
        }

        // Calcola efficacia
        const effectiveness = this.calculateIntervalEffectiveness(actualIntervals, optimalIntervals);
        
        // Genera raccomandazioni
        const recommendations = this.generateIntervalRecommendations(actualIntervals, optimalIntervals);

        return {
            optimal: optimalIntervals,
            actual: actualIntervals,
            effectiveness: effectiveness,
            recommendations: recommendations
        };
    }

    calculateIntervalEffectiveness(actual, optimal) {
        if (!actual || actual.length === 0) return 0;
        
        let totalScore = 0;
        let comparisons = 0;
        
        actual.forEach(interval => {
            const closestOptimal = optimal.reduce((prev, curr) => 
                Math.abs(curr - interval) < Math.abs(prev - interval) ? curr : prev
            );
            const deviation = Math.abs(interval - closestOptimal) / closestOptimal;
            const score = Math.max(0, 1 - deviation);
            totalScore += score;
            comparisons++;
        });
        
        return comparisons > 0 ? (totalScore / comparisons) * 100 : 0;
    }

    generateIntervalRecommendations(actual, optimal) {
        const recommendations = [];
        
        if (!actual || actual.length === 0) {
            recommendations.push('Inizia a rivedere le flashcards regolarmente');
            return recommendations;
        }
        
        const avgActual = actual.reduce((sum, val) => sum + val, 0) / actual.length;
        const avgOptimal = optimal.reduce((sum, val) => sum + val, 0) / optimal.length;
        
        if (avgActual < avgOptimal * 0.5) {
            recommendations.push('Aumenta gli intervalli tra le revisioni per migliorare la ritenzione');
        } else if (avgActual > avgOptimal * 1.5) {
            recommendations.push('Riduci gli intervalli tra le revisioni per consolidare meglio');
        } else {
            recommendations.push('Gli intervalli di revisione sono appropriati, continua così');
        }
        
        return recommendations;
    }

    calculateLearningVelocity(sessions) {
        if (!sessions || sessions.length < 2) {
            return {
                conceptsPerHour: 0,
                improvementRate: 0,
                learningTrend: 'insufficient_data',
                velocity: 0,
                recommendations: ['Completa più sessioni di studio per calcolare la velocità di apprendimento']
            };
        }

        // Ordina le sessioni per timestamp
        const sortedSessions = sessions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Calcola concetti appresi per ora
        const totalConcepts = sortedSessions.reduce((sum, session) => {
            return sum + (session.conceptsLearned || session.topics?.length || 1);
        }, 0);
        
        const totalHours = sortedSessions.reduce((sum, session) => {
            return sum + (session.duration || 30) / 60; // default 30 min
        }, 0);
        
        const conceptsPerHour = totalHours > 0 ? totalConcepts / totalHours : 0;
        
        // Calcola tasso di miglioramento
        const firstHalfSessions = sortedSessions.slice(0, Math.floor(sortedSessions.length / 2));
        const secondHalfSessions = sortedSessions.slice(Math.floor(sortedSessions.length / 2));
        
        const firstHalfAvg = this.calculateAverageAccuracy(firstHalfSessions);
        const secondHalfAvg = this.calculateAverageAccuracy(secondHalfSessions);
        
        const improvementRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;
        
        // Determina trend
        let learningTrend = 'stable';
        if (improvementRate > 10) learningTrend = 'accelerating';
        else if (improvementRate < -10) learningTrend = 'declining';
        
        // Calcola velocità complessiva (0-100)
        const velocity = Math.min(100, Math.max(0, (conceptsPerHour * 10) + Math.max(0, improvementRate)));
        
        // Genera raccomandazioni
        const recommendations = this.generateVelocityRecommendations(conceptsPerHour, improvementRate, learningTrend);
        
        return {
            conceptsPerHour: Math.round(conceptsPerHour * 100) / 100,
            improvementRate: Math.round(improvementRate * 100) / 100,
            learningTrend: learningTrend,
            velocity: Math.round(velocity * 100) / 100,
            recommendations: recommendations
        };
    }

    generateVelocityRecommendations(conceptsPerHour, improvementRate, trend) {
        const recommendations = [];
        
        if (conceptsPerHour < 2) {
            recommendations.push('Aumenta il ritmo di studio per apprendere più concetti per ora');
        }
        
        if (improvementRate < 0) {
            recommendations.push('Rivedi i concetti precedenti per consolidare l\'apprendimento');
        }
        
        if (trend === 'declining') {
            recommendations.push('Considera una pausa o cambia metodo di studio');
        } else if (trend === 'accelerating') {
            recommendations.push('Ottimo progresso! Mantieni questo ritmo di studio');
        }
        
        if (conceptsPerHour > 5) {
            recommendations.push('Velocità elevata: assicurati di comprendere bene ogni concetto');
        }
        
        return recommendations.length > 0 ? recommendations : ['Continua con il tuo metodo di studio attuale'];
    }

    calculateRetentionRate(sessions) {
        // Analyze retention based on review sessions
        const reviewSessions = sessions.filter(s => s.isReview);
        if (reviewSessions.length === 0) return 0;
        
        const retentionScores = reviewSessions.map(session => {
            const timeSinceLastStudy = this.getTimeSinceLastStudy(session.topics[0], session.timestamp);
            const expectedRetention = this.calculateExpectedRetention(timeSinceLastStudy);
            const actualRetention = session.performance.accuracy / 100;
            
            return actualRetention / expectedRetention;
        });
        
        return retentionScores.reduce((sum, score) => sum + score, 0) / retentionScores.length;
    }

    // Collaborative Learning Features
    createStudyGroup(groupData) {
        const studyGroup = {
            id: this.generateId(),
            name: groupData.name,
            members: groupData.members,
            topics: groupData.topics,
            created: new Date(),
            activities: [],
            performance: {
                groupAccuracy: 0,
                collaborationScore: 0,
                knowledgeSharing: 0
            }
        };
        
        this.collaborativeData.studyGroups.push(studyGroup);
        this.saveAnalyticsData();
        
        return studyGroup;
    }

    trackPeerInteraction(interactionData) {
        const interaction = {
            id: this.generateId(),
            timestamp: new Date(),
            type: interactionData.type, // 'help', 'discussion', 'resource_share'
            participants: interactionData.participants,
            topic: interactionData.topic,
            outcome: interactionData.outcome,
            effectiveness: this.calculateInteractionEffectiveness(interactionData)
        };
        
        this.collaborativeData.peerInteractions.push(interaction);
        this.updateCollaborativeMetrics(interaction);
        
        return interaction;
    }

    // Adaptive Feedback System
    generatePersonalizedInsights(userId) {
        const userSessions = this.sessions.filter(s => s.userId === userId);
        const dashboardData = this.generateDashboardData();
        
        return {
            strengths: this.identifyUserStrengths(userSessions),
            improvements: this.identifyImprovementAreas(userSessions),
            recommendations: this.generatePersonalizedRecommendations(userSessions),
            goals: this.suggestLearningGoals(userSessions),
            peerComparison: this.generatePeerComparison(userSessions)
        };
    }

    // Utility Methods
    calculateStreakDays() {
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);
        
        while (true) {
            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dayHasSessions = this.sessions.some(session => 
                session.timestamp >= dayStart && session.timestamp <= dayEnd
            );
            
            if (dayHasSessions) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    }

    generateId() {
        return 'analytics_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Data Persistence
    loadAnalyticsData() {
        try {
            const saved = localStorage.getItem('cronologia_analytics');
            return saved ? JSON.parse(saved) : this.getDefaultAnalyticsData();
        } catch (error) {
            console.error('Error loading analytics data:', error);
            return this.getDefaultAnalyticsData();
        }
    }

    saveAnalyticsData() {
        try {
            const dataToSave = {
                sessions: this.sessions,
                collaborativeData: this.collaborativeData,
                lastUpdated: new Date()
            };
            localStorage.setItem('cronologia_analytics', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving analytics data:', error);
        }
    }

    getDefaultAnalyticsData() {
        return {
            sessions: [],
            collaborativeData: {
                studyGroups: [],
                peerInteractions: [],
                sharedResources: []
            },
            lastUpdated: new Date()
        };
    }

    // Additional helper methods for complex calculations
    calculateAverageAccuracy(sessions) {
        const sessionsWithAccuracy = sessions.filter(s => s.performance && s.performance.accuracy);
        if (sessionsWithAccuracy.length === 0) return 0;
        
        return sessionsWithAccuracy.reduce((sum, s) => sum + s.performance.accuracy, 0) / sessionsWithAccuracy.length;
    }

    analyzeQuizPerformance(quizSessions) {
        if (quizSessions.length === 0) {
            return {
                averageScore: 0,
                totalQuizzes: 0,
                improvementRate: 0,
                topicPerformance: {}
            };
        }

        const averageScore = this.calculateAverageAccuracy(quizSessions);
        const topicPerformance = {};
        
        quizSessions.forEach(session => {
            session.topics.forEach(topic => {
                if (!topicPerformance[topic]) {
                    topicPerformance[topic] = { scores: [], average: 0 };
                }
                topicPerformance[topic].scores.push(session.performance.accuracy);
            });
        });

        // Calculate average for each topic
        Object.keys(topicPerformance).forEach(topic => {
            const scores = topicPerformance[topic].scores;
            topicPerformance[topic].average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        });

        return {
            averageScore,
            totalQuizzes: quizSessions.length,
            improvementRate: this.calculateImprovementRate(quizSessions),
            topicPerformance
        };
    }

    analyzeFlashcardRetention(flashcardSessions) {
        if (flashcardSessions.length === 0) {
            return {
                retentionRate: 0,
                averageReviewTime: 0,
                masteredCards: 0,
                strugglingCards: []
            };
        }

        const retentionRate = this.calculateAverageAccuracy(flashcardSessions);
        const averageReviewTime = flashcardSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / flashcardSessions.length;
        
        return {
            retentionRate,
            averageReviewTime,
            masteredCards: flashcardSessions.filter(s => s.performance.accuracy >= 90).length,
            strugglingCards: flashcardSessions.filter(s => s.performance.accuracy < 60).map(s => s.topics).flat()
        };
    }

    calculateImprovementTrend(sessions) {
        if (sessions.length < 2) return 0;
        
        const sortedSessions = sessions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const firstHalf = sortedSessions.slice(0, Math.floor(sessions.length / 2));
        const secondHalf = sortedSessions.slice(Math.floor(sessions.length / 2));
        
        const firstHalfAvg = this.calculateAverageAccuracy(firstHalf);
        const secondHalfAvg = this.calculateAverageAccuracy(secondHalf);
        
        return secondHalfAvg - firstHalfAvg;
    }

    identifyWeakAreas(sessions) {
        const topicPerformance = {};
        
        sessions.forEach(session => {
            session.topics.forEach(topic => {
                if (!topicPerformance[topic]) {
                    topicPerformance[topic] = [];
                }
                topicPerformance[topic].push(session.performance.accuracy);
            });
        });
        
        const weakAreas = [];
        Object.keys(topicPerformance).forEach(topic => {
            const scores = topicPerformance[topic];
            const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            if (average < 70) {
                weakAreas.push({ topic, average, sessions: scores.length });
            }
        });
        
        return weakAreas.sort((a, b) => a.average - b.average);
    }

    identifyStrongAreas(sessions) {
        const topicPerformance = {};
        
        sessions.forEach(session => {
            session.topics.forEach(topic => {
                if (!topicPerformance[topic]) {
                    topicPerformance[topic] = [];
                }
                topicPerformance[topic].push(session.performance.accuracy);
            });
        });
        
        const strongAreas = [];
        Object.keys(topicPerformance).forEach(topic => {
            const scores = topicPerformance[topic];
            const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            if (average >= 85) {
                strongAreas.push({ topic, average, sessions: scores.length });
            }
        });
        
        return strongAreas.sort((a, b) => b.average - a.average);
    }

    calculateImprovementRate(sessions) {
        if (sessions.length < 2) return 0;
        
        const sortedSessions = sessions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const firstScore = sortedSessions[0].performance.accuracy;
        const lastScore = sortedSessions[sortedSessions.length - 1].performance.accuracy;
        
        return ((lastScore - firstScore) / firstScore) * 100;
    }

    getRecentSessions(days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return this.sessions.filter(session => new Date(session.timestamp) >= cutoffDate);
    }
}

// Predictive Analytics Module
class PredictiveAnalytics {
    constructor() {
        this.models = {
            retention: new RetentionPredictor(),
            performance: new PerformancePredictor(),
            engagement: new EngagementPredictor()
        };
    }

    generatePredictions(sessions) {
        return {
            retentionForecast: this.models.retention.predict(sessions),
            performanceTrend: this.models.performance.predict(sessions),
            engagementRisk: this.models.engagement.predict(sessions),
            optimalStudyTimes: this.predictOptimalStudyTimes(sessions),
            difficultyProgression: this.predictDifficultyProgression(sessions)
        };
    }

    predictOptimalStudyTimes(sessions) {
        // Analyze when user performs best
        const hourlyPerformance = {};
        
        sessions.forEach(session => {
            const hour = new Date(session.timestamp).getHours();
            if (!hourlyPerformance[hour]) {
                hourlyPerformance[hour] = { total: 0, count: 0 };
            }
            hourlyPerformance[hour].total += session.performance.accuracy || 0;
            hourlyPerformance[hour].count++;
        });
        
        const averages = Object.keys(hourlyPerformance).map(hour => ({
            hour: parseInt(hour),
            average: hourlyPerformance[hour].total / hourlyPerformance[hour].count
        }));
        
        return averages.sort((a, b) => b.average - a.average).slice(0, 3);
    }
}

// Adaptive Feedback System
class AdaptiveFeedbackSystem {
    constructor() {
        this.feedbackRules = this.initializeFeedbackRules();
    }

    generateRecommendations(sessions) {
        const recommendations = [];
        
        // Analyze patterns and generate adaptive recommendations
        if (this.detectLowEngagement(sessions)) {
            recommendations.push({
                type: 'engagement',
                priority: 'high',
                message: 'Prova a variare le attività di studio per mantenere alto l\'interesse',
                actions: ['Usa le mappe mentali', 'Prova i quiz interattivi', 'Studia in gruppo']
            });
        }
        
        if (this.detectSpacingIssues(sessions)) {
            recommendations.push({
                type: 'spacing',
                priority: 'medium',
                message: 'Ottimizza gli intervalli di ripetizione per migliorare la ritenzione',
                actions: ['Rivedi i concetti dopo 1 giorno', 'Ripeti dopo 3 giorni', 'Consolida dopo 1 settimana']
            });
        }
        
        return recommendations;
    }

    initializeFeedbackRules() {
        return {
            engagement: {
                low: { threshold: 0.3, feedback: 'Aumenta la varietà delle attività' },
                medium: { threshold: 0.6, feedback: 'Buon livello di coinvolgimento' },
                high: { threshold: 0.8, feedback: 'Eccellente coinvolgimento!' }
            },
            accuracy: {
                low: { threshold: 0.5, feedback: 'Concentrati sui concetti base' },
                medium: { threshold: 0.75, feedback: 'Buoni progressi, continua così' },
                high: { threshold: 0.9, feedback: 'Ottima padronanza!' }
            }
        };
    }

    detectLowEngagement(sessions) {
        const recentSessions = sessions.slice(-10);
        const avgEngagement = recentSessions.reduce((sum, s) => sum + s.engagement, 0) / recentSessions.length;
        return avgEngagement < 0.4;
    }

    detectSpacingIssues(sessions) {
        // Detect if user is cramming instead of using spaced repetition
        const flashcardSessions = sessions.filter(s => s.activity === 'flashcards');
        if (flashcardSessions.length < 3) return false;
        
        const intervals = [];
        for (let i = 1; i < flashcardSessions.length; i++) {
            const interval = new Date(flashcardSessions[i].timestamp) - new Date(flashcardSessions[i-1].timestamp);
            intervals.push(interval / (1000 * 60 * 60 * 24)); // Convert to days
        }
        
        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        return avgInterval < 0.5; // Less than 12 hours between sessions
    }
}

// Simple predictive models
class RetentionPredictor {
    predict(sessions) {
        // Simple retention prediction based on spaced repetition theory
        const flashcardSessions = sessions.filter(s => s.activity === 'flashcards');
        if (flashcardSessions.length === 0) return { score: 0.5, confidence: 'low' };
        
        const avgAccuracy = flashcardSessions.reduce((sum, s) => sum + (s.performance.accuracy || 0), 0) / flashcardSessions.length;
        const sessionFrequency = flashcardSessions.length / 30; // Sessions per day over last 30 days
        
        const retentionScore = (avgAccuracy / 100) * 0.7 + Math.min(sessionFrequency, 1) * 0.3;
        
        return {
            score: retentionScore,
            confidence: flashcardSessions.length > 10 ? 'high' : 'medium',
            factors: {
                accuracy: avgAccuracy,
                frequency: sessionFrequency
            }
        };
    }
}

class PerformancePredictor {
    predict(sessions) {
        if (sessions.length < 5) return { trend: 'insufficient_data' };
        
        const recentSessions = sessions.slice(-10);
        const accuracies = recentSessions.map(s => s.performance.accuracy || 0);
        
        // Simple linear trend calculation
        const trend = this.calculateTrend(accuracies);
        
        return {
            trend: trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable',
            slope: trend,
            prediction: accuracies[accuracies.length - 1] + trend * 5 // Predict 5 sessions ahead
        };
    }
    
    calculateTrend(values) {
        const n = values.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, i) => sum + val * i, 0);
        const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
        
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }
}

class EngagementPredictor {
    predict(sessions) {
        const recentSessions = sessions.slice(-7); // Last 7 sessions
        if (recentSessions.length === 0) return { risk: 'unknown' };
        
        const avgEngagement = recentSessions.reduce((sum, s) => sum + s.engagement, 0) / recentSessions.length;
        const engagementTrend = this.calculateEngagementTrend(recentSessions);
        
        let risk = 'low';
        if (avgEngagement < 0.3 || engagementTrend < -0.1) risk = 'high';
        else if (avgEngagement < 0.5 || engagementTrend < -0.05) risk = 'medium';
        
        return {
            risk,
            currentLevel: avgEngagement,
            trend: engagementTrend,
            recommendations: this.getEngagementRecommendations(risk)
        };
    }
    
    calculateEngagementTrend(sessions) {
        const engagements = sessions.map(s => s.engagement);
        const trend = new PerformancePredictor().calculateTrend(engagements);
        return trend;
    }
    
    getEngagementRecommendations(risk) {
        const recommendations = {
            high: ['Prova nuove attività di studio', 'Studia con amici', 'Fai pause più frequenti'],
            medium: ['Varia le tecniche di studio', 'Imposta obiettivi più piccoli'],
            low: ['Continua così!', 'Mantieni la routine attuale']
        };
        
        return recommendations[risk] || [];
    }
}

// Export the main class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LearningAnalytics, PredictiveAnalytics, AdaptiveFeedbackSystem };
} else {
    window.LearningAnalytics = LearningAnalytics;
    window.PredictiveAnalytics = PredictiveAnalytics;
    window.AdaptiveFeedbackSystem = AdaptiveFeedbackSystem;
}