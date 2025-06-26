/**
 * Study Manager - Sistema di studio con flashcard, quiz e gamification
 * Implementa funzionalità educative avanzate per l'apprendimento storico
 * 
 * Funzionalità principali:
 * - Flashcard per eventi e persone storiche
 * - Quiz interattivi con diversi tipi di domande
 * - Sistema di ripetizione spaziata (Spaced Repetition)
 * - Gamification con punti, livelli e achievement
 * - Tracciamento progresso e analytics di apprendimento
 * - Dashboard personalizzato per lo studio
 * 
 * Ispirato da: Quizlet, Brainscape, Khan Academy, Anki
 */

class StudyManager {
    constructor() {
        this.currentSession = null;
        this.studyStats = this.loadStudyStats();
        this.achievements = this.loadAchievements();
        this.streakData = this.loadStreakData();
        this.spacedRepetition = new SpacedRepetitionSystem();
        this.gamification = new GamificationSystem();
        this.initializeStudySystem();
    }

    /**
     * Inizializza il sistema di studio
     */
    initializeStudySystem() {
        this.createStudyInterface();
        this.bindStudyEvents();
        this.updateDailyStreak();
        this.checkAchievements();
        logger?.info('Study system initialized');
    }

    /**
     * Crea l'interfaccia di studio
     */
    createStudyInterface() {
        const studyContainer = document.createElement('div');
        studyContainer.id = 'study-container';
        studyContainer.className = 'study-container hidden';
        studyContainer.innerHTML = this.getStudyHTML();
        
        document.body.appendChild(studyContainer);
        this.studyContainer = studyContainer;
    }

    /**
     * Genera HTML per l'interfaccia di studio
     */
    getStudyHTML() {
        return `
            <div class="study-overlay">
                <div class="study-modal">
                    <div class="study-header">
                        <h2 id="study-title">📚 Centro Studio</h2>
                        <button id="close-study" class="close-btn">×</button>
                    </div>
                    
                    <div class="study-tabs">
                        <button class="study-tab active" data-tab="dashboard">📊 Dashboard</button>
                        <button class="study-tab" data-tab="flashcards">🃏 Flashcard</button>
                        <button class="study-tab" data-tab="quiz">❓ Quiz</button>
                        <button class="study-tab" data-tab="progress">📈 Progresso</button>
                        <button class="study-tab" data-tab="achievements">🏆 Achievement</button>
                    </div>
                    
                    <div class="study-content">
                        <!-- Dashboard Tab -->
                        <div id="dashboard-tab" class="study-tab-content active">
                            <div class="dashboard-grid">
                                <div class="dashboard-card">
                                    <h3>🔥 Streak Giornaliero</h3>
                                    <div class="streak-display">
                                        <span id="current-streak">0</span> giorni
                                    </div>
                                    <div class="streak-calendar" id="streak-calendar"></div>
                                </div>
                                
                                <div class="dashboard-card">
                                    <h3>⭐ Livello Attuale</h3>
                                    <div class="level-display">
                                        <span id="current-level">1</span>
                                        <div class="xp-bar">
                                            <div id="xp-progress" class="xp-fill"></div>
                                        </div>
                                        <span id="xp-text">0 / 100 XP</span>
                                    </div>
                                </div>
                                
                                <div class="dashboard-card">
                                    <h3>📊 Statistiche Oggi</h3>
                                    <div class="today-stats">
                                        <div class="stat-item">
                                            <span class="stat-label">Flashcard studiate:</span>
                                            <span id="today-flashcards">0</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Quiz completati:</span>
                                            <span id="today-quizzes">0</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Tempo di studio:</span>
                                            <span id="today-time">0 min</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="dashboard-card">
                                    <h3>🎯 Sessioni Rapide</h3>
                                    <div class="quick-actions">
                                        <button class="quick-btn" data-action="review-due">📝 Ripasso Programmato</button>
                                        <button class="quick-btn" data-action="random-quiz">🎲 Quiz Casuale</button>
                                        <button class="quick-btn" data-action="weak-areas">💪 Aree Deboli</button>
                                        <button class="quick-btn" data-action="daily-challenge">🌟 Sfida Giornaliera</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Flashcards Tab -->
                        <div id="flashcards-tab" class="study-tab-content">
                            <div class="flashcard-controls">
                                <div class="flashcard-options">
                                    <select id="flashcard-type">
                                        <option value="events">📅 Eventi Storici</option>
                                        <option value="people">👤 Persone Storiche</option>
                                        <option value="mixed">🔀 Misto</option>
                                        <option value="custom">✏️ Personalizzate</option>
                                    </select>
                                    <select id="flashcard-difficulty">
                                        <option value="all">Tutte le difficoltà</option>
                                        <option value="easy">Facile</option>
                                        <option value="medium">Medio</option>
                                        <option value="hard">Difficile</option>
                                        <option value="due">Da ripassare</option>
                                    </select>
                                    <button id="start-flashcards" class="primary-btn">🚀 Inizia Sessione</button>
                                </div>
                            </div>
                            
                            <div id="flashcard-session" class="flashcard-session hidden">
                                <div class="session-header">
                                    <div class="session-progress">
                                        <span id="card-counter">1 / 10</span>
                                        <div class="progress-bar">
                                            <div id="session-progress" class="progress-fill"></div>
                                        </div>
                                    </div>
                                    <button id="end-session" class="secondary-btn">Termina Sessione</button>
                                </div>
                                
                                <div class="flashcard-container">
                                    <div id="flashcard" class="flashcard">
                                        <div class="flashcard-front">
                                            <div class="card-type" id="card-type">EVENTO</div>
                                            <div class="card-question" id="card-question">Caricamento...</div>
                                            <button id="flip-card" class="flip-btn">🔄 Mostra Risposta</button>
                                        </div>
                                        <div class="flashcard-back">
                                            <div class="card-answer" id="card-answer">Risposta...</div>
                                            <div class="difficulty-buttons">
                                                <button class="diff-btn easy" data-difficulty="easy">😊 Facile</button>
                                                <button class="diff-btn medium" data-difficulty="medium">🤔 Medio</button>
                                                <button class="diff-btn hard" data-difficulty="hard">😰 Difficile</button>
                                                <button class="diff-btn again" data-difficulty="again">❌ Ripeti</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="flashcard-results" class="session-results hidden">
                                <h3>🎉 Sessione Completata!</h3>
                                <div class="results-stats">
                                    <div class="result-item">
                                        <span class="result-label">Carte studiate:</span>
                                        <span id="cards-studied">0</span>
                                    </div>
                                    <div class="result-item">
                                        <span class="result-label">Accuratezza:</span>
                                        <span id="session-accuracy">0%</span>
                                    </div>
                                    <div class="result-item">
                                        <span class="result-label">XP guadagnati:</span>
                                        <span id="session-xp">+0 XP</span>
                                    </div>
                                </div>
                                <button id="new-flashcard-session" class="primary-btn">🔄 Nuova Sessione</button>
                            </div>
                        </div>
                        
                        <!-- Quiz Tab -->
                        <div id="quiz-tab" class="study-tab-content">
                            <div class="quiz-selection">
                                <h3>Seleziona Tipo di Quiz</h3>
                                <div class="quiz-types">
                                    <div class="quiz-type-card" data-quiz="chronological">
                                        <h4>⏰ Quiz Cronologico</h4>
                                        <p>Ordina eventi in sequenza temporale</p>
                                    </div>
                                    <div class="quiz-type-card" data-quiz="multiple-choice">
                                        <h4>📝 Scelta Multipla</h4>
                                        <p>Domande con 4 opzioni di risposta</p>
                                    </div>
                                    <div class="quiz-type-card" data-quiz="true-false">
                                        <h4>✅ Vero/Falso</h4>
                                        <p>Verifica la correttezza delle affermazioni</p>
                                    </div>
                                    <div class="quiz-type-card" data-quiz="matching">
                                        <h4>🔗 Associazioni</h4>
                                        <p>Collega persone, eventi e date</p>
                                    </div>
                                    <div class="quiz-type-card" data-quiz="fill-blank">
                                        <h4>📝 Completa</h4>
                                        <p>Riempi gli spazi vuoti</p>
                                    </div>
                                    <div class="quiz-type-card" data-quiz="timeline">
                                        <h4>📊 Timeline</h4>
                                        <p>Posiziona eventi sulla timeline</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="quiz-session" class="quiz-session hidden">
                                <div class="quiz-header">
                                    <div class="quiz-progress">
                                        <span id="quiz-counter">Domanda 1 di 10</span>
                                        <div class="progress-bar">
                                            <div id="quiz-progress" class="progress-fill"></div>
                                        </div>
                                    </div>
                                    <div class="quiz-timer">
                                        <span id="quiz-time">⏱️ 00:30</span>
                                    </div>
                                </div>
                                
                                <div class="quiz-question-container">
                                    <div id="quiz-question" class="quiz-question">Caricamento domanda...</div>
                                    <div id="quiz-options" class="quiz-options"></div>
                                    <button id="submit-answer" class="primary-btn" disabled>Conferma Risposta</button>
                                </div>
                                
                                <div class="quiz-feedback hidden" id="quiz-feedback">
                                    <div class="feedback-content">
                                        <div id="feedback-result"></div>
                                        <div id="feedback-explanation"></div>
                                    </div>
                                    <button id="next-question" class="primary-btn">Prossima Domanda</button>
                                </div>
                            </div>
                            
                            <div id="quiz-results" class="quiz-results hidden">
                                <h3>🎯 Risultati Quiz</h3>
                                <div class="quiz-score">
                                    <div class="score-circle">
                                        <span id="final-score">0%</span>
                                    </div>
                                </div>
                                <div class="quiz-stats">
                                    <div class="stat-item">
                                        <span class="stat-label">Risposte corrette:</span>
                                        <span id="correct-answers">0/0</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Tempo totale:</span>
                                        <span id="total-time">0:00</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">XP guadagnati:</span>
                                        <span id="quiz-xp">+0 XP</span>
                                    </div>
                                </div>
                                <div class="quiz-actions">
                                    <button id="review-answers" class="secondary-btn">📝 Rivedi Risposte</button>
                                    <button id="new-quiz" class="primary-btn">🔄 Nuovo Quiz</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Progress Tab -->
                        <div id="progress-tab" class="study-tab-content">
                            <div class="progress-overview">
                                <h3>📈 Il Tuo Progresso</h3>
                                
                                <div class="progress-cards">
                                    <div class="progress-card">
                                        <h4>📚 Conoscenza Generale</h4>
                                        <div class="knowledge-meter">
                                            <div class="meter-bar">
                                                <div id="knowledge-fill" class="meter-fill"></div>
                                            </div>
                                            <span id="knowledge-percent">0%</span>
                                        </div>
                                    </div>
                                    
                                    <div class="progress-card">
                                        <h4>⚡ Velocità di Risposta</h4>
                                        <div class="speed-indicator">
                                            <span id="avg-response-time">0.0s</span>
                                            <div class="speed-trend" id="speed-trend">📈</div>
                                        </div>
                                    </div>
                                    
                                    <div class="progress-card">
                                        <h4>🎯 Accuratezza</h4>
                                        <div class="accuracy-display">
                                            <span id="overall-accuracy">0%</span>
                                            <div class="accuracy-breakdown">
                                                <small>Eventi: <span id="events-accuracy">0%</span></small>
                                                <small>Persone: <span id="people-accuracy">0%</span></small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="study-heatmap">
                                    <h4>🔥 Heatmap di Studio</h4>
                                    <div id="study-heatmap" class="heatmap-container"></div>
                                </div>
                                
                                <div class="weak-areas">
                                    <h4>💪 Aree da Migliorare</h4>
                                    <div id="weak-areas-list" class="weak-areas-list"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Achievements Tab -->
                        <div id="achievements-tab" class="study-tab-content">
                            <div class="achievements-overview">
                                <h3>🏆 I Tuoi Achievement</h3>
                                
                                <div class="achievement-stats">
                                    <div class="achievement-stat">
                                        <span class="stat-number" id="total-achievements">0</span>
                                        <span class="stat-label">Sbloccati</span>
                                    </div>
                                    <div class="achievement-stat">
                                        <span class="stat-number" id="total-points">0</span>
                                        <span class="stat-label">Punti Totali</span>
                                    </div>
                                    <div class="achievement-stat">
                                        <span class="stat-number" id="completion-rate">0%</span>
                                        <span class="stat-label">Completamento</span>
                                    </div>
                                </div>
                                
                                <div class="achievements-grid" id="achievements-grid"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Collega gli eventi dell'interfaccia di studio
     */
    bindStudyEvents() {
        // Chiusura modal
        document.getElementById('close-study')?.addEventListener('click', () => {
            this.hideStudyInterface();
        });

        // Tab navigation
        document.querySelectorAll('.study-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchStudyTab(e.target.dataset.tab);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.dataset.action);
            });
        });

        // Flashcard events
        this.bindFlashcardEvents();
        
        // Quiz events
        this.bindQuizEvents();
    }

    /**
     * Collega eventi specifici per le flashcard
     */
    bindFlashcardEvents() {
        document.getElementById('start-flashcards')?.addEventListener('click', () => {
            this.startFlashcardSession();
        });

        document.getElementById('flip-card')?.addEventListener('click', () => {
            this.flipFlashcard();
        });

        document.getElementById('end-session')?.addEventListener('click', () => {
            this.endFlashcardSession();
        });

        document.getElementById('new-flashcard-session')?.addEventListener('click', () => {
            this.resetFlashcardSession();
        });

        // Difficulty buttons
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFlashcardDifficulty(e.target.dataset.difficulty);
            });
        });
    }

    /**
     * Collega eventi specifici per i quiz
     */
    bindQuizEvents() {
        document.querySelectorAll('.quiz-type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const quizType = e.currentTarget.dataset.quiz;
                this.startQuiz(quizType);
            });
        });

        document.getElementById('submit-answer')?.addEventListener('click', () => {
            this.submitQuizAnswer();
        });

        document.getElementById('next-question')?.addEventListener('click', () => {
            this.nextQuizQuestion();
        });

        document.getElementById('new-quiz')?.addEventListener('click', () => {
            this.resetQuiz();
        });

        document.getElementById('review-answers')?.addEventListener('click', () => {
            this.reviewQuizAnswers();
        });
    }

    /**
     * Mostra l'interfaccia di studio
     */
    showStudyInterface() {
        this.studyContainer?.classList.remove('hidden');
        this.updateDashboard();
        document.body.style.overflow = 'hidden';
    }

    /**
     * Nasconde l'interfaccia di studio
     */
    hideStudyInterface() {
        this.studyContainer?.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Salva sessione se attiva
        if (this.currentSession) {
            this.saveCurrentSession();
        }
    }

    /**
     * Cambia tab nell'interfaccia di studio
     */
    switchStudyTab(tabName) {
        // Rimuovi classe active da tutti i tab
        document.querySelectorAll('.study-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.study-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Attiva il tab selezionato
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        // Aggiorna contenuto specifico del tab
        this.updateTabContent(tabName);
    }

    /**
     * Aggiorna il contenuto specifico di un tab
     */
    updateTabContent(tabName) {
        switch (tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'progress':
                this.updateProgressTab();
                break;
            case 'achievements':
                this.updateAchievementsTab();
                break;
        }
    }

    /**
     * Aggiorna la dashboard
     */
    updateDashboard() {
        // Aggiorna streak
        const currentStreak = this.streakData.current || 0;
        document.getElementById('current-streak').textContent = currentStreak;
        this.updateStreakCalendar();

        // Aggiorna livello e XP
        const level = this.gamification.getCurrentLevel();
        const xp = this.gamification.getCurrentXP();
        const xpForNext = this.gamification.getXPForNextLevel();
        
        document.getElementById('current-level').textContent = level;
        document.getElementById('xp-text').textContent = `${xp} / ${xpForNext} XP`;
        
        const xpProgress = (xp / xpForNext) * 100;
        document.getElementById('xp-progress').style.width = `${xpProgress}%`;

        // Aggiorna statistiche giornaliere
        const todayStats = this.getTodayStats();
        document.getElementById('today-flashcards').textContent = todayStats.flashcards;
        document.getElementById('today-quizzes').textContent = todayStats.quizzes;
        document.getElementById('today-time').textContent = `${todayStats.studyTime} min`;
    }

    /**
     * Gestisce le azioni rapide dalla dashboard
     */
    handleQuickAction(action) {
        switch (action) {
            case 'review-due':
                this.startReviewSession();
                break;
            case 'random-quiz':
                this.startRandomQuiz();
                break;
            case 'weak-areas':
                this.startWeakAreasSession();
                break;
            case 'daily-challenge':
                this.startDailyChallenge();
                break;
        }
    }

    /**
     * Carica le statistiche di studio
     */
    loadStudyStats() {
        const saved = localStorage.getItem('cronologia_study_stats');
        return saved ? JSON.parse(saved) : {
            totalStudyTime: 0,
            flashcardsStudied: 0,
            quizzesCompleted: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            dailyStats: {},
            weeklyStats: {},
            monthlyStats: {},
            subjectStats: {
                events: { correct: 0, total: 0 },
                people: { correct: 0, total: 0 },
                dates: { correct: 0, total: 0 }
            }
        };
    }

    /**
     * Salva le statistiche di studio
     */
    saveStudyStats() {
        localStorage.setItem('cronologia_study_stats', JSON.stringify(this.studyStats));
    }

    /**
     * Carica i dati dello streak
     */
    loadStreakData() {
        const saved = localStorage.getItem('cronologia_streak_data');
        return saved ? JSON.parse(saved) : {
            current: 0,
            longest: 0,
            lastStudyDate: null,
            studyDates: []
        };
    }

    /**
     * Salva i dati dello streak
     */
    saveStreakData() {
        localStorage.setItem('cronologia_streak_data', JSON.stringify(this.streakData));
    }

    /**
     * Aggiorna lo streak giornaliero
     */
    updateDailyStreak() {
        const today = new Date().toDateString();
        const lastStudy = this.streakData.lastStudyDate;
        
        if (lastStudy !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastStudy === yesterday.toDateString()) {
                // Continua lo streak
                this.streakData.current += 1;
            } else if (lastStudy !== today) {
                // Reset dello streak se non si è studiato ieri
                this.streakData.current = 1;
            }
            
            this.streakData.lastStudyDate = today;
            this.streakData.studyDates.push(today);
            
            // Aggiorna il record
            if (this.streakData.current > this.streakData.longest) {
                this.streakData.longest = this.streakData.current;
            }
            
            this.saveStreakData();
        }
    }

    /**
     * Ottiene le statistiche di oggi
     */
    getTodayStats() {
        const today = new Date().toDateString();
        const dailyStats = this.studyStats.dailyStats[today] || {
            flashcards: 0,
            quizzes: 0,
            studyTime: 0,
            correctAnswers: 0,
            totalAnswers: 0
        };
        return dailyStats;
    }

    /**
     * Aggiorna le statistiche giornaliere
     */
    updateTodayStats(type, value = 1) {
        const today = new Date().toDateString();
        if (!this.studyStats.dailyStats[today]) {
            this.studyStats.dailyStats[today] = {
                flashcards: 0,
                quizzes: 0,
                studyTime: 0,
                correctAnswers: 0,
                totalAnswers: 0
            };
        }
        
        this.studyStats.dailyStats[today][type] += value;
        this.saveStudyStats();
    }

    /**
     * Carica gli achievement
     */
    loadAchievements() {
        const saved = localStorage.getItem('cronologia_achievements');
        const defaultAchievements = this.getDefaultAchievements();
        
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            // Merge con nuovi achievement se aggiunti
            return { ...defaultAchievements, ...savedAchievements };
        }
        
        return defaultAchievements;
    }

    /**
     * Ottiene la lista degli achievement predefiniti
     */
    getDefaultAchievements() {
        return {
            first_study: { unlocked: false, date: null, name: "Primo Studio", description: "Completa la prima sessione di studio", icon: "🎓", points: 10 },
            streak_3: { unlocked: false, date: null, name: "Costanza", description: "Studia per 3 giorni consecutivi", icon: "🔥", points: 25 },
            streak_7: { unlocked: false, date: null, name: "Settimana Perfetta", description: "Studia per 7 giorni consecutivi", icon: "⭐", points: 50 },
            streak_30: { unlocked: false, date: null, name: "Mese Dedicato", description: "Studia per 30 giorni consecutivi", icon: "👑", points: 200 },
            flashcards_100: { unlocked: false, date: null, name: "Studioso", description: "Studia 100 flashcard", icon: "📚", points: 30 },
            flashcards_500: { unlocked: false, date: null, name: "Esperto", description: "Studia 500 flashcard", icon: "🎯", points: 100 },
            quiz_perfect: { unlocked: false, date: null, name: "Perfezione", description: "Completa un quiz con 100% di accuratezza", icon: "💯", points: 40 },
            quiz_speed: { unlocked: false, date: null, name: "Velocista", description: "Completa un quiz in meno di 30 secondi", icon: "⚡", points: 35 },
            level_5: { unlocked: false, date: null, name: "Studente Avanzato", description: "Raggiungi il livello 5", icon: "🏆", points: 75 },
            level_10: { unlocked: false, date: null, name: "Maestro della Storia", description: "Raggiungi il livello 10", icon: "👨‍🎓", points: 150 },
            night_owl: { unlocked: false, date: null, name: "Gufo Notturno", description: "Studia dopo le 22:00", icon: "🦉", points: 20 },
            early_bird: { unlocked: false, date: null, name: "Mattiniero", description: "Studia prima delle 7:00", icon: "🐦", points: 20 },
            weekend_warrior: { unlocked: false, date: null, name: "Guerriero del Weekend", description: "Studia nel weekend", icon: "⚔️", points: 15 },
            accuracy_master: { unlocked: false, date: null, name: "Maestro di Precisione", description: "Mantieni 90% di accuratezza per 10 quiz", icon: "🎯", points: 80 }
        };
    }

    /**
     * Salva gli achievement
     */
    saveAchievements() {
        localStorage.setItem('cronologia_achievements', JSON.stringify(this.achievements));
    }

    /**
     * Controlla e sblocca nuovi achievement
     */
    checkAchievements() {
        const stats = this.studyStats;
        const streak = this.streakData.current;
        const level = this.gamification.getCurrentLevel();
        
        // Achievement per streak
        this.checkAndUnlock('streak_3', streak >= 3);
        this.checkAndUnlock('streak_7', streak >= 7);
        this.checkAndUnlock('streak_30', streak >= 30);
        
        // Achievement per flashcard
        this.checkAndUnlock('flashcards_100', stats.flashcardsStudied >= 100);
        this.checkAndUnlock('flashcards_500', stats.flashcardsStudied >= 500);
        
        // Achievement per livello
        this.checkAndUnlock('level_5', level >= 5);
        this.checkAndUnlock('level_10', level >= 10);
        
        // Achievement per orario
        const hour = new Date().getHours();
        this.checkAndUnlock('night_owl', hour >= 22 || hour < 6);
        this.checkAndUnlock('early_bird', hour < 7);
        
        // Achievement per weekend
        const isWeekend = [0, 6].includes(new Date().getDay());
        this.checkAndUnlock('weekend_warrior', isWeekend);
    }

    /**
     * Controlla e sblocca un achievement specifico
     */
    checkAndUnlock(achievementId, condition) {
        if (condition && !this.achievements[achievementId].unlocked) {
            this.unlockAchievement(achievementId);
        }
    }

    /**
     * Sblocca un achievement
     */
    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.date = new Date().toISOString();
            
            // Aggiungi punti
            this.gamification.addXP(achievement.points);
            
            // Mostra notifica
            this.showAchievementNotification(achievement);
            
            // Salva
            this.saveAchievements();
            
            logger?.info(`Achievement unlocked: ${achievementId}`);
        }
    }

    /**
     * Mostra notifica per achievement sbloccato
     */
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <h4>🏆 Achievement Sbloccato!</h4>
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                    <span class="achievement-points">+${achievement.points} XP</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animazione di entrata
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Rimozione automatica
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /**
     * Inizializza una sessione di flashcard
     */
    startFlashcardSession() {
        const type = document.getElementById('flashcard-type').value;
        const difficulty = document.getElementById('flashcard-difficulty').value;
        
        this.currentSession = {
            type: 'flashcard',
            subtype: type,
            difficulty: difficulty,
            cards: this.generateFlashcards(type, difficulty),
            currentIndex: 0,
            startTime: Date.now(),
            results: []
        };
        
        this.showFlashcardSession();
        this.displayCurrentFlashcard();
        
        logger?.info(`Started flashcard session: ${type}, difficulty: ${difficulty}`);
    }

    /**
     * Genera flashcard per la sessione
     */
    generateFlashcards(type, difficulty) {
        const events = storageManager?.getEvents() || [];
        const people = storageManager?.getPeople() || [];
        let cards = [];
        
        switch (type) {
            case 'events':
                cards = this.generateEventFlashcards(events, difficulty);
                break;
            case 'people':
                cards = this.generatePeopleFlashcards(people, difficulty);
                break;
            case 'mixed':
                const eventCards = this.generateEventFlashcards(events, difficulty);
                const peopleCards = this.generatePeopleFlashcards(people, difficulty);
                cards = [...eventCards, ...peopleCards];
                break;
            case 'custom':
                cards = this.generateCustomFlashcards(difficulty);
                break;
        }
        
        // Mescola le carte
        return this.shuffleArray(cards).slice(0, 20); // Massimo 20 carte per sessione
    }

    /**
     * Genera flashcard per eventi
     */
    generateEventFlashcards(events, difficulty) {
        return events.map(event => {
            const questionTypes = [
                {
                    question: `Quando è avvenuto: ${event.title}?`,
                    answer: event.date,
                    type: 'date'
                },
                {
                    question: `Descrivi l'evento del ${event.date}`,
                    answer: `${event.title}\n\n${event.description}`,
                    type: 'description'
                },
                {
                    question: `In che categoria rientra: ${event.title}?`,
                    answer: event.category || 'Non specificata',
                    type: 'category'
                }
            ];
            
            const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            
            return {
                id: `event_${event.id}_${randomType.type}`,
                question: randomType.question,
                answer: randomType.answer,
                type: 'EVENTO',
                difficulty: this.calculateDifficulty(event, randomType.type),
                source: event
            };
        });
    }

    /**
     * Genera flashcard per persone
     */
    generatePeopleFlashcards(people, difficulty) {
        return people.map(person => {
            const questionTypes = [
                {
                    question: `Chi era ${person.name}?`,
                    answer: `${person.role || 'Ruolo non specificato'}\n\n${person.description || 'Descrizione non disponibile'}`,
                    type: 'description'
                },
                {
                    question: `Quando è nato/a ${person.name}?`,
                    answer: person.birthDate || 'Data non specificata',
                    type: 'birth'
                },
                {
                    question: `Qual era il ruolo di ${person.name}?`,
                    answer: person.role || 'Ruolo non specificato',
                    type: 'role'
                }
            ];
            
            const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            
            return {
                id: `person_${person.id}_${randomType.type}`,
                question: randomType.question,
                answer: randomType.answer,
                type: 'PERSONA',
                difficulty: this.calculateDifficulty(person, randomType.type),
                source: person
            };
        });
    }

    /**
     * Calcola la difficoltà di una flashcard
     */
    calculateDifficulty(item, questionType) {
        // Logica semplificata per calcolare difficoltà
        let difficulty = 'medium';
        
        if (questionType === 'date' || questionType === 'birth') {
            difficulty = 'hard'; // Date sono più difficili
        } else if (questionType === 'description') {
            difficulty = 'easy'; // Descrizioni sono più facili
        }
        
        return difficulty;
    }

    /**
     * Mescola un array (Fisher-Yates shuffle)
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Mostra la sessione di flashcard
     */
    showFlashcardSession() {
        document.querySelector('.flashcard-controls').classList.add('hidden');
        document.getElementById('flashcard-session').classList.remove('hidden');
        document.getElementById('flashcard-results').classList.add('hidden');
    }

    /**
     * Mostra la flashcard corrente
     */
    displayCurrentFlashcard() {
        const session = this.currentSession;
        const card = session.cards[session.currentIndex];
        
        if (!card) {
            this.endFlashcardSession();
            return;
        }
        
        // Aggiorna contatore
        document.getElementById('card-counter').textContent = 
            `${session.currentIndex + 1} / ${session.cards.length}`;
        
        // Aggiorna barra progresso
        const progress = ((session.currentIndex + 1) / session.cards.length) * 100;
        document.getElementById('session-progress').style.width = `${progress}%`;
        
        // Mostra la carta
        document.getElementById('card-type').textContent = card.type;
        document.getElementById('card-question').textContent = card.question;
        document.getElementById('card-answer').textContent = card.answer;
        
        // Reset stato carta
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.remove('flipped');
        document.getElementById('flip-card').style.display = 'block';
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.style.display = 'none';
        });
    }

    /**
     * Gira la flashcard
     */
    flipFlashcard() {
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.add('flipped');
        
        document.getElementById('flip-card').style.display = 'none';
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.style.display = 'inline-block';
        });
    }

    /**
     * Gestisce la valutazione della difficoltà
     */
    handleFlashcardDifficulty(difficulty) {
        const session = this.currentSession;
        const card = session.cards[session.currentIndex];
        
        // Registra il risultato
        session.results.push({
            cardId: card.id,
            difficulty: difficulty,
            responseTime: Date.now() - session.cardStartTime
        });
        
        // Aggiorna sistema di ripetizione spaziata
        this.spacedRepetition.updateCard(card.id, difficulty);
        
        // Prossima carta
        session.currentIndex++;
        session.cardStartTime = Date.now();
        
        if (session.currentIndex < session.cards.length) {
            this.displayCurrentFlashcard();
        } else {
            this.endFlashcardSession();
        }
    }

    /**
     * Termina la sessione di flashcard
     */
    endFlashcardSession() {
        if (!this.currentSession) return;
        
        const session = this.currentSession;
        const totalTime = Date.now() - session.startTime;
        
        // Calcola statistiche
        const cardsStudied = session.results.length;
        const easyCards = session.results.filter(r => r.difficulty === 'easy').length;
        const accuracy = cardsStudied > 0 ? Math.round((easyCards / cardsStudied) * 100) : 0;
        
        // Calcola XP guadagnati
        const baseXP = cardsStudied * 5;
        const bonusXP = Math.round(accuracy / 10); // Bonus per accuratezza
        const totalXP = baseXP + bonusXP;
        
        // Aggiorna statistiche
        this.updateTodayStats('flashcards', cardsStudied);
        this.updateTodayStats('studyTime', Math.round(totalTime / 60000)); // Converti in minuti
        this.studyStats.flashcardsStudied += cardsStudied;
        this.saveStudyStats();
        
        // Aggiungi XP
        this.gamification.addXP(totalXP);
        
        // Aggiorna streak
        this.updateDailyStreak();
        
        // Controlla achievement
        this.checkAchievements();
        
        // Mostra risultati
        this.showFlashcardResults(cardsStudied, accuracy, totalXP);
        
        logger?.info(`Flashcard session completed: ${cardsStudied} cards, ${accuracy}% accuracy, +${totalXP} XP`);
    }

    /**
     * Mostra i risultati della sessione flashcard
     */
    showFlashcardResults(cardsStudied, accuracy, xpGained) {
        document.getElementById('flashcard-session').classList.add('hidden');
        document.getElementById('flashcard-results').classList.remove('hidden');
        
        document.getElementById('cards-studied').textContent = cardsStudied;
        document.getElementById('session-accuracy').textContent = `${accuracy}%`;
        document.getElementById('session-xp').textContent = `+${xpGained} XP`;
    }

    /**
     * Reset della sessione flashcard
     */
    resetFlashcardSession() {
        this.currentSession = null;
        document.querySelector('.flashcard-controls').classList.remove('hidden');
        document.getElementById('flashcard-session').classList.add('hidden');
        document.getElementById('flashcard-results').classList.add('hidden');
    }

    // Metodi pubblici per integrazione
    
    /**
     * Apre il centro studio
     */
    openStudyCenter() {
        this.showStudyInterface();
    }
    
    /**
     * Ottiene le statistiche di studio
     */
    getStudyStatistics() {
        return {
            ...this.studyStats,
            currentStreak: this.streakData.current,
            longestStreak: this.streakData.longest,
            currentLevel: this.gamification.getCurrentLevel(),
            totalXP: this.gamification.getCurrentXP(),
            achievementsUnlocked: Object.values(this.achievements).filter(a => a.unlocked).length,
            totalAchievements: Object.keys(this.achievements).length
        };
    }
    
    /**
     * Esporta i dati di studio
     */
    exportStudyData() {
        return {
            stats: this.studyStats,
            achievements: this.achievements,
            streak: this.streakData,
            gamification: this.gamification.exportData(),
            spacedRepetition: this.spacedRepetition.exportData(),
            exportDate: new Date().toISOString()
        };
    }
    
    /**
     * Importa i dati di studio
     */
    importStudyData(data) {
        try {
            if (data.stats) {
                this.studyStats = data.stats;
                this.saveStudyStats();
            }
            
            if (data.achievements) {
                this.achievements = { ...this.achievements, ...data.achievements };
                this.saveAchievements();
            }
            
            if (data.streak) {
                this.streakData = data.streak;
                this.saveStreakData();
            }
            
            if (data.gamification) {
                this.gamification.importData(data.gamification);
            }
            
            if (data.spacedRepetition) {
                this.spacedRepetition.importData(data.spacedRepetition);
            }
            
            logger?.info('Study data imported successfully');
            return true;
        } catch (error) {
            logger?.error('Failed to import study data:', error);
            return false;
        }
    }
}

/**
 * Sistema di Ripetizione Spaziata
 * Implementa l'algoritmo SM-2 per ottimizzare la memorizzazione
 */
class SpacedRepetitionSystem {
    constructor() {
        this.cards = this.loadCards();
    }
    
    /**
     * Carica le carte dal localStorage
     */
    loadCards() {
        const saved = localStorage.getItem('cronologia_spaced_repetition');
        return saved ? JSON.parse(saved) : {};
    }
    
    /**
     * Salva le carte nel localStorage
     */
    saveCards() {
        localStorage.setItem('cronologia_spaced_repetition', JSON.stringify(this.cards));
    }
    
    /**
     * Aggiorna una carta basandosi sulla difficoltà
     */
    updateCard(cardId, difficulty) {
        if (!this.cards[cardId]) {
            this.cards[cardId] = {
                easiness: 2.5,
                interval: 1,
                repetitions: 0,
                nextReview: new Date()
            };
        }
        
        const card = this.cards[cardId];
        
        // Algoritmo SM-2 semplificato
        switch (difficulty) {
            case 'again':
                card.repetitions = 0;
                card.interval = 1;
                break;
            case 'hard':
                card.easiness = Math.max(1.3, card.easiness - 0.15);
                card.repetitions++;
                card.interval = Math.max(1, Math.round(card.interval * card.easiness));
                break;
            case 'medium':
                card.repetitions++;
                card.interval = Math.round(card.interval * card.easiness);
                break;
            case 'easy':
                card.easiness = Math.min(2.5, card.easiness + 0.15);
                card.repetitions++;
                card.interval = Math.round(card.interval * card.easiness * 1.3);
                break;
        }
        
        // Calcola prossima data di ripasso
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + card.interval);
        card.nextReview = nextReview;
        
        this.saveCards();
    }
    
    /**
     * Ottiene le carte da ripassare oggi
     */
    getCardsForReview() {
        const today = new Date();
        return Object.entries(this.cards)
            .filter(([id, card]) => new Date(card.nextReview) <= today)
            .map(([id, card]) => id);
    }
    
    /**
     * Esporta i dati
     */
    exportData() {
        return this.cards;
    }
    
    /**
     * Importa i dati
     */
    importData(data) {
        this.cards = data;
        this.saveCards();
    }
}

/**
 * Sistema di Gamification
 * Gestisce livelli, XP, punti e progressione
 */
class GamificationSystem {
    constructor() {
        this.data = this.loadData();
    }
    
    /**
     * Carica i dati di gamification
     */
    loadData() {
        const saved = localStorage.getItem('cronologia_gamification');
        return saved ? JSON.parse(saved) : {
            xp: 0,
            level: 1,
            totalPoints: 0,
            badges: [],
            multiplier: 1.0
        };
    }
    
    /**
     * Salva i dati di gamification
     */
    saveData() {
        localStorage.setItem('cronologia_gamification', JSON.stringify(this.data));
    }
    
    /**
     * Aggiunge XP e controlla level up
     */
    addXP(amount) {
        const multipliedAmount = Math.round(amount * this.data.multiplier);
        this.data.xp += multipliedAmount;
        this.data.totalPoints += multipliedAmount;
        
        const newLevel = this.calculateLevel(this.data.xp);
        if (newLevel > this.data.level) {
            this.levelUp(newLevel);
        }
        
        this.saveData();
        return multipliedAmount;
    }
    
    /**
     * Calcola il livello basandosi sull'XP
     */
    calculateLevel(xp) {
        // Formula: livello = floor(sqrt(xp / 100)) + 1
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }
    
    /**
     * Calcola XP necessari per il prossimo livello
     */
    getXPForNextLevel() {
        const nextLevel = this.data.level + 1;
        return Math.pow(nextLevel - 1, 2) * 100;
    }
    
    /**
     * Gestisce il level up
     */
    levelUp(newLevel) {
        const oldLevel = this.data.level;
        this.data.level = newLevel;
        
        // Bonus XP per level up
        const bonusXP = (newLevel - oldLevel) * 50;
        this.data.xp += bonusXP;
        
        // Mostra notifica level up
        this.showLevelUpNotification(newLevel, bonusXP);
        
        logger?.info(`Level up! New level: ${newLevel}, bonus XP: ${bonusXP}`);
    }
    
    /**
     * Mostra notifica di level up
     */
    showLevelUpNotification(level, bonusXP) {
        const notification = document.createElement('div');
        notification.className = 'levelup-notification';
        notification.innerHTML = `
            <div class="levelup-popup">
                <div class="levelup-icon">🎉</div>
                <div class="levelup-text">
                    <h3>LEVEL UP!</h3>
                    <h2>Livello ${level}</h2>
                    <p>Bonus: +${bonusXP} XP</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    /**
     * Ottiene il livello corrente
     */
    getCurrentLevel() {
        return this.data.level;
    }
    
    /**
     * Ottiene l'XP corrente
     */
    getCurrentXP() {
        return this.data.xp;
    }
    
    /**
     * Esporta i dati
     */
    exportData() {
        return this.data;
    }
    
    /**
     * Importa i dati
     */
    importData(data) {
        this.data = data;
        this.saveData();
    }
}

// Inizializzazione globale
let studyManager;

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        studyManager = new StudyManager();
    });
} else {
    studyManager = new StudyManager();
}

// Export per uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StudyManager, SpacedRepetitionSystem, GamificationSystem };
}