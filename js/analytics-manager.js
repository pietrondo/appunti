/**
 * Analytics Manager for Cronologia Storica
 * Manages the analytics dashboard interface and user interactions
 * Integrates with the LearningAnalytics system for data visualization
 */

class AnalyticsManager {
    constructor(learningAnalytics) {
        this.analytics = learningAnalytics;
        this.dashboard = null;
        this.currentSection = 'overview';
        this.updateInterval = null;
        
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.dashboard = document.getElementById('analytics-dashboard');
        if (!this.dashboard) {
            console.error('Analytics dashboard element not found');
            return;
        }

        this.setupEventListeners();
        this.setupAutoUpdate();
    }

    setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('analytics-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDashboard());
        }

        // Navigation buttons
        const navButtons = document.querySelectorAll('.analytics-nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });

        // Chart control buttons
        const chartControls = document.querySelectorAll('.chart-control-btn');
        chartControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this.updateChartPeriod(period, e.target);
            });
        });

        // Recommendation actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recommendation-action')) {
                this.handleRecommendationAction(e.target.textContent);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.dashboard.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeDashboard();
                }
            }
        });
    }

    setupAutoUpdate() {
        // Update dashboard every 30 seconds when open
        this.updateInterval = setInterval(() => {
            if (this.dashboard && this.dashboard.classList.contains('active')) {
                this.updateDashboardData();
            }
        }, 30000);
    }

    openDashboard() {
        if (!this.dashboard) return;
        
        this.dashboard.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update data when opening
        this.updateDashboardData();
        
        // Focus management for accessibility
        const firstFocusable = this.dashboard.querySelector('.analytics-nav-btn');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    closeDashboard() {
        if (!this.dashboard) return;
        
        this.dashboard.classList.remove('active');
        document.body.style.overflow = '';
    }

    switchSection(sectionName) {
        // Update navigation
        const navButtons = document.querySelectorAll('.analytics-nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionName) {
                btn.classList.add('active');
            }
        });

        // Update sections
        const sections = document.querySelectorAll('.analytics-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentSection = sectionName;
        this.updateSectionData(sectionName);
    }

    updateDashboardData() {
        const dashboardData = this.analytics.generateDashboardData();
        
        this.updateOverviewSection(dashboardData.overview);
        this.updatePerformanceSection(dashboardData.performance);
        this.updateLearningSection(dashboardData.learning);
        this.updateCollaborationSection(dashboardData.collaboration);
        this.updatePredictionsSection(dashboardData.predictions);
        this.updateRecommendationsSection(dashboardData.recommendations);
    }

    updateOverviewSection(overviewData) {
        // Update metrics
        this.updateElement('total-sessions', overviewData.totalSessions);
        this.updateElement('total-study-time', this.formatStudyTime(overviewData.totalStudyTime));
        this.updateElement('streak-days', overviewData.streakDays);
        this.updateElement('engagement-score', Math.round(overviewData.averageEngagement * 100) + '%');

        // Update changes
        this.updateElement('sessions-change', this.formatChange(overviewData.sessionsChange || 0, 'questa settimana'));
        this.updateElement('time-change', this.formatAverageTime(overviewData.averageSessionLength));
        this.updateElement('streak-change', overviewData.streakDays + ' giorni consecutivi');
        this.updateElement('engagement-change', 'Livello ' + this.getEngagementLevel(overviewData.averageEngagement));
    }

    updatePerformanceSection(performanceData) {
        if (!performanceData) return;

        // Update accuracy metrics
        const accuracy = Math.round(performanceData.overallAccuracy || 0);
        this.updateElement('overall-accuracy', accuracy + '%');
        this.updateProgressBar('accuracy-progress', accuracy);

        // Update improvement trend
        this.updateElement('improvement-trend', this.formatTrend(performanceData.improvementTrend));
        
        // Update retention
        const retention = Math.round((performanceData.retentionRate || 0) * 100);
        this.updateElement('retention-rate', retention + '%');
        this.updateProgressBar('retention-progress', retention);
    }

    updateLearningSection(learningData) {
        if (!learningData) return;

        // Update spaced repetition effectiveness
        const srEffectiveness = Math.round((learningData.spacedRepetitionEffectiveness?.effectiveness || 0) * 100);
        this.updateElement('spaced-repetition-effectiveness', srEffectiveness + '%');
        this.updateProgressBar('sr-effectiveness-progress', srEffectiveness);
        this.updateElement('sr-effectiveness-label', srEffectiveness + '%');

        // Update learning velocity
        this.updateElement('learning-velocity', Math.round(learningData.learningVelocity || 0));
        
        // Update concept mastery
        this.updateElement('concept-mastery', learningData.conceptMastery || 0);
    }

    updateCollaborationSection(collaborationData) {
        if (!collaborationData) return;

        this.updateElement('study-groups-count', collaborationData.studyGroupParticipation?.activeGroups || 0);
        this.updateElement('group-sessions', collaborationData.studyGroupParticipation?.sessions || 0);
        this.updateElement('peer-interactions', collaborationData.peerLearningEffectiveness?.interactions || 0);
        this.updateElement('help-given', collaborationData.peerLearningEffectiveness?.helpProvided || 0);
        this.updateElement('shared-resources', collaborationData.knowledgeSharing?.resources || 0);
        this.updateElement('knowledge-score', collaborationData.knowledgeSharing?.score || 0);
    }

    updatePredictionsSection(predictionsData) {
        if (!predictionsData) return;

        // Update retention forecast
        const retentionForecast = Math.round((predictionsData.retentionForecast?.score || 0) * 100);
        this.updateElement('retention-forecast', retentionForecast + '%');
        this.updateElement('retention-confidence', 'Confidenza: ' + (predictionsData.retentionForecast?.confidence || 'Bassa'));

        // Update performance trend
        this.updateElement('performance-trend', this.formatTrend(predictionsData.performanceTrend?.trend));
        
        // Update engagement risk
        this.updateElement('engagement-risk', this.formatRisk(predictionsData.engagementRisk?.risk));
        this.updateElement('engagement-trend', 'Trend: ' + this.formatTrend(predictionsData.engagementRisk?.trend));
    }

    updateRecommendationsSection(recommendations) {
        const container = document.getElementById('recommendations-list');
        if (!container || !recommendations || recommendations.length === 0) {
            return;
        }

        container.innerHTML = '';
        
        recommendations.forEach(rec => {
            const recElement = this.createRecommendationElement(rec);
            container.appendChild(recElement);
        });
    }

    createRecommendationElement(recommendation) {
        const div = document.createElement('div');
        div.className = `recommendation-item ${recommendation.priority}-priority`;
        
        div.innerHTML = `
            <div class="recommendation-priority ${recommendation.priority}">${this.formatPriority(recommendation.priority)}</div>
            <div class="recommendation-message">${recommendation.message}</div>
            <div class="recommendation-actions">
                ${recommendation.actions.map(action => 
                    `<span class="recommendation-action">${action}</span>`
                ).join('')}
            </div>
        `;
        
        return div;
    }

    updateSectionData(sectionName) {
        // Update specific section data when switching
        const dashboardData = this.analytics.generateDashboardData();
        
        switch (sectionName) {
            case 'overview':
                this.updateOverviewSection(dashboardData.overview);
                break;
            case 'performance':
                this.updatePerformanceSection(dashboardData.performance);
                break;
            case 'learning':
                this.updateLearningSection(dashboardData.learning);
                break;
            case 'collaboration':
                this.updateCollaborationSection(dashboardData.collaboration);
                break;
            case 'predictions':
                this.updatePredictionsSection(dashboardData.predictions);
                break;
            case 'recommendations':
                this.updateRecommendationsSection(dashboardData.recommendations);
                break;
        }
    }

    updateChartPeriod(period, button) {
        // Update chart control buttons
        const parentControls = button.parentElement;
        const allButtons = parentControls.querySelectorAll('.chart-control-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Here you would update the actual chart data based on the period
        // For now, we'll just update the placeholder text
        const chartContent = button.closest('.chart-card').querySelector('.chart-content');
        if (chartContent) {
            chartContent.textContent = `Grafico aggiornato per periodo: ${period}`;
        }
    }

    handleRecommendationAction(actionText) {
        // Handle recommendation action clicks
        switch (actionText) {
            case 'Inizia una sessione di studio':
                this.closeDashboard();
                // Trigger study session start
                if (window.studyManager) {
                    window.studyManager.openStudyInterface();
                }
                break;
            case 'Completa un quiz':
                this.closeDashboard();
                // Trigger quiz start
                if (window.studyManager) {
                    window.studyManager.startQuiz();
                }
                break;
            case 'Usa le mappe mentali':
                this.closeDashboard();
                // Open mind map
                if (window.mindMapManager) {
                    window.mindMapManager.openMindMap();
                }
                break;
            default:
                console.log('Recommendation action:', actionText);
        }
    }

    // Utility methods
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateProgressBar(id, percentage) {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = Math.min(Math.max(percentage, 0), 100) + '%';
        }
    }

    formatStudyTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    formatAverageTime(milliseconds) {
        const minutes = Math.round(milliseconds / (1000 * 60));
        return `⏰ Media: ${minutes}m`;
    }

    formatChange(percentage, period) {
        const sign = percentage >= 0 ? '↗️' : '↘️';
        const color = percentage >= 0 ? 'positive' : 'negative';
        return `${sign} ${percentage >= 0 ? '+' : ''}${percentage}% ${period}`;
    }

    getEngagementLevel(engagement) {
        if (engagement >= 0.8) return 'Eccellente';
        if (engagement >= 0.6) return 'Buono';
        if (engagement >= 0.4) return 'Medio';
        return 'Basso';
    }

    formatTrend(trend) {
        if (!trend) return 'Stabile';
        
        switch (trend) {
            case 'improving': return 'In Miglioramento';
            case 'declining': return 'In Calo';
            case 'stable': return 'Stabile';
            default: return 'Stabile';
        }
    }

    formatRisk(risk) {
        if (!risk) return 'Basso';
        
        switch (risk) {
            case 'high': return 'Alto';
            case 'medium': return 'Medio';
            case 'low': return 'Basso';
            default: return 'Basso';
        }
    }

    formatPriority(priority) {
        switch (priority) {
            case 'high': return 'Alta Priorità';
            case 'medium': return 'Media Priorità';
            case 'low': return 'Bassa Priorità';
            default: return 'Priorità';
        }
    }

    // Integration with study system
    trackStudySession(sessionData) {
        if (this.analytics) {
            this.analytics.trackStudySession(sessionData);
            
            // Update dashboard if open
            if (this.dashboard && this.dashboard.classList.contains('active')) {
                this.updateDashboardData();
            }
        }
    }

    // Cleanup
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsManager;
} else {
    window.AnalyticsManager = AnalyticsManager;
}