/**
 * Mind Map Module - Sistema di mappe mentali per l'apprendimento
 * Ispirato da MindMeister, Miro e altre piattaforme di mind mapping
 * 
 * Funzionalità:
 * - Creazione di mappe mentali interattive
 * - Nodi collegati gerarchicamente
 * - Drag & drop per riorganizzare
 * - Esportazione e importazione
 * - Integrazione con eventi storici
 * - Collaborazione e condivisione
 * - Templates predefiniti per storia
 * 
 * @author Sistema di Studio Cronologia Storica
 * @version 1.0.0
 */

class MindMapManager {
    constructor() {
        this.mindMaps = this.loadMindMaps();
        this.currentMap = null;
        this.selectedNode = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.zoom = 1;
        this.pan = { x: 0, y: 0 };
        
        // Templates predefiniti per storia
        this.templates = {
            'historical-period': {
                name: 'Periodo Storico',
                description: 'Template per analizzare un periodo storico',
                structure: {
                    center: 'Periodo Storico',
                    branches: [
                        { text: 'Eventi Principali', color: '#e74c3c' },
                        { text: 'Personaggi Chiave', color: '#3498db' },
                        { text: 'Contesto Sociale', color: '#2ecc71' },
                        { text: 'Conseguenze', color: '#f39c12' },
                        { text: 'Fonti', color: '#9b59b6' }
                    ]
                }
            },
            'cause-effect': {
                name: 'Causa-Effetto',
                description: 'Template per analizzare cause e conseguenze',
                structure: {
                    center: 'Evento Storico',
                    branches: [
                        { text: 'Cause Immediate', color: '#e74c3c' },
                        { text: 'Cause Profonde', color: '#c0392b' },
                        { text: 'Effetti Immediati', color: '#3498db' },
                        { text: 'Conseguenze a Lungo Termine', color: '#2980b9' }
                    ]
                }
            },
            'biography': {
                name: 'Biografia',
                description: 'Template per studiare personaggi storici',
                structure: {
                    center: 'Personaggio Storico',
                    branches: [
                        { text: 'Vita Personale', color: '#e74c3c' },
                        { text: 'Carriera/Opere', color: '#3498db' },
                        { text: 'Contesto Storico', color: '#2ecc71' },
                        { text: 'Influenza/Eredità', color: '#f39c12' },
                        { text: 'Relazioni', color: '#9b59b6' }
                    ]
                }
            },
            'timeline-analysis': {
                name: 'Analisi Timeline',
                description: 'Template per analizzare sequenze temporali',
                structure: {
                    center: 'Sequenza Storica',
                    branches: [
                        { text: 'Antecedenti', color: '#95a5a6' },
                        { text: 'Inizio', color: '#e74c3c' },
                        { text: 'Sviluppo', color: '#f39c12' },
                        { text: 'Culmine', color: '#e67e22' },
                        { text: 'Conclusione', color: '#3498db' },
                        { text: 'Eredità', color: '#9b59b6' }
                    ]
                }
            }
        };
        
        this.colors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
            '#e67e22', '#1abc9c', '#34495e', '#f1c40f', '#e91e63'
        ];
        
        this.init();
    }
    
    init() {
        this.createMindMapInterface();
        this.setupEventListeners();
        console.log('Mind Map Manager initialized');
    }
    
    createMindMapInterface() {
        // L'interfaccia sarà creata dinamicamente quando richiesta
        console.log('Mind Map interface ready');
    }
    
    setupEventListeners() {
        // Setup base event listeners per MindMapManager
        // Gli event listeners specifici saranno configurati quando l'interfaccia viene aperta
        console.log('MindMap event listeners configured');
    }
    
    openMindMapInterface() {
        const container = document.createElement('div');
        container.className = 'mindmap-container';
        container.innerHTML = this.getMindMapHTML();
        
        document.body.appendChild(container);
        
        // Setup event listeners per la nuova interfaccia
        this.setupMindMapEventListeners();
        
        // Mostra l'interfaccia
        setTimeout(() => container.classList.add('show'), 10);
    }
    
    getMindMapHTML() {
        return `
            <div class="mindmap-overlay"></div>
            <div class="mindmap-modal">
                <div class="mindmap-header">
                    <h2>🧠 Mappe Mentali</h2>
                    <button class="mindmap-close-btn">&times;</button>
                </div>
                
                <div class="mindmap-tabs">
                    <button class="mindmap-tab active" data-tab="create">Crea</button>
                    <button class="mindmap-tab" data-tab="library">Libreria</button>
                    <button class="mindmap-tab" data-tab="templates">Template</button>
                    <button class="mindmap-tab" data-tab="export">Esporta</button>
                </div>
                
                <div class="mindmap-content">
                    <!-- Create Tab -->
                    <div class="mindmap-tab-content active" id="create-tab">
                        <div class="mindmap-toolbar">
                            <div class="toolbar-group">
                                <button id="add-node-btn" class="toolbar-btn" title="Aggiungi Nodo">
                                    <span class="icon">➕</span> Nodo
                                </button>
                                <button id="delete-node-btn" class="toolbar-btn" title="Elimina Nodo">
                                    <span class="icon">🗑️</span> Elimina
                                </button>
                                <button id="edit-node-btn" class="toolbar-btn" title="Modifica Nodo">
                                    <span class="icon">✏️</span> Modifica
                                </button>
                            </div>
                            <div class="toolbar-group">
                                <button id="zoom-in-btn" class="toolbar-btn" title="Zoom In">
                                    <span class="icon">🔍</span>+
                                </button>
                                <button id="zoom-out-btn" class="toolbar-btn" title="Zoom Out">
                                    <span class="icon">🔍</span>-
                                </button>
                                <button id="reset-view-btn" class="toolbar-btn" title="Reset Vista">
                                    <span class="icon">🎯</span> Reset
                                </button>
                            </div>
                            <div class="toolbar-group">
                                <button id="save-mindmap-btn" class="toolbar-btn primary" title="Salva Mappa">
                                    <span class="icon">💾</span> Salva
                                </button>
                            </div>
                        </div>
                        
                        <div class="mindmap-canvas-container">
                            <canvas id="mindmap-canvas" class="mindmap-canvas"></canvas>
                            <div class="mindmap-info">
                                <div id="node-info" class="node-info hidden">
                                    <h4>Informazioni Nodo</h4>
                                    <input type="text" id="node-text" placeholder="Testo del nodo">
                                    <div class="color-picker">
                                        <label>Colore:</label>
                                        <div class="color-options"></div>
                                    </div>
                                    <textarea id="node-notes" placeholder="Note aggiuntive..."></textarea>
                                    <div class="node-actions">
                                        <button id="save-node-btn" class="btn-primary">Salva</button>
                                        <button id="cancel-node-btn" class="btn-secondary">Annulla</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Library Tab -->
                    <div class="mindmap-tab-content" id="library-tab">
                        <div class="mindmap-library">
                            <div class="library-header">
                                <h3>Le tue Mappe Mentali</h3>
                                <button id="new-mindmap-btn" class="btn-primary">+ Nuova Mappa</button>
                            </div>
                            <div id="mindmap-list" class="mindmap-list">
                                <!-- Mind maps will be listed here -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Templates Tab -->
                    <div class="mindmap-tab-content" id="templates-tab">
                        <div class="templates-grid">
                            <!-- Templates will be generated here -->
                        </div>
                    </div>
                    
                    <!-- Export Tab -->
                    <div class="mindmap-tab-content" id="export-tab">
                        <div class="export-options">
                            <h3>Esporta Mappa Mentale</h3>
                            <div class="export-formats">
                                <button class="export-btn" data-format="json">
                                    <span class="icon">📄</span>
                                    <div>
                                        <h4>JSON</h4>
                                        <p>Formato dati per backup</p>
                                    </div>
                                </button>
                                <button class="export-btn" data-format="png">
                                    <span class="icon">🖼️</span>
                                    <div>
                                        <h4>PNG</h4>
                                        <p>Immagine ad alta risoluzione</p>
                                    </div>
                                </button>
                                <button class="export-btn" data-format="svg">
                                    <span class="icon">🎨</span>
                                    <div>
                                        <h4>SVG</h4>
                                        <p>Grafica vettoriale scalabile</p>
                                    </div>
                                </button>
                                <button class="export-btn" data-format="pdf">
                                    <span class="icon">📋</span>
                                    <div>
                                        <h4>PDF</h4>
                                        <p>Documento stampabile</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupMindMapEventListeners() {
        // Close button
        const closeBtn = document.querySelector('.mindmap-close-btn');
        const overlay = document.querySelector('.mindmap-overlay');
        
        [closeBtn, overlay].forEach(el => {
            if (el) {
                el.addEventListener('click', () => this.closeMindMapInterface());
            }
        });
        
        // Tab switching
        document.querySelectorAll('.mindmap-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchMindMapTab(tabName);
            });
        });
        
        // Canvas setup
        this.setupCanvas();
        
        // Toolbar buttons
        this.setupToolbarListeners();
        
        // Templates
        this.loadTemplates();
        
        // Library
        this.loadMindMapLibrary();
    }
    
    setupCanvas() {
        const canvas = document.getElementById('mindmap-canvas');
        if (!canvas) return;
        
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Initialize with empty mind map or load current
        if (!this.currentMap) {
            this.createNewMindMap('Nuova Mappa Mentale');
        }
        
        this.drawMindMap();
        
        // Canvas event listeners
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        
        // Keyboard listeners
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    setupToolbarListeners() {
        // Add node
        const addNodeBtn = document.getElementById('add-node-btn');
        if (addNodeBtn) {
            addNodeBtn.addEventListener('click', () => this.addNode());
        }
        
        // Delete node
        const deleteNodeBtn = document.getElementById('delete-node-btn');
        if (deleteNodeBtn) {
            deleteNodeBtn.addEventListener('click', () => this.deleteSelectedNode());
        }
        
        // Edit node
        const editNodeBtn = document.getElementById('edit-node-btn');
        if (editNodeBtn) {
            editNodeBtn.addEventListener('click', () => this.editSelectedNode());
        }
        
        // Zoom controls
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const resetViewBtn = document.getElementById('reset-view-btn');
        
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
        if (resetViewBtn) resetViewBtn.addEventListener('click', () => this.resetView());
        
        // Save
        const saveMindMapBtn = document.getElementById('save-mindmap-btn');
        if (saveMindMapBtn) {
            saveMindMapBtn.addEventListener('click', () => this.saveMindMap());
        }
        
        // Node editing
        const saveNodeBtn = document.getElementById('save-node-btn');
        const cancelNodeBtn = document.getElementById('cancel-node-btn');
        
        if (saveNodeBtn) saveNodeBtn.addEventListener('click', () => this.saveNodeEdit());
        if (cancelNodeBtn) cancelNodeBtn.addEventListener('click', () => this.cancelNodeEdit());
        
        // Color picker
        this.setupColorPicker();
    }
    
    setupColorPicker() {
        const colorOptions = document.querySelector('.color-options');
        if (!colorOptions) return;
        
        this.colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-option';
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                colorDiv.classList.add('selected');
            });
            colorOptions.appendChild(colorDiv);
        });
    }
    
    createNewMindMap(title = 'Nuova Mappa Mentale') {
        this.currentMap = {
            id: Date.now().toString(),
            title: title,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            nodes: [
                {
                    id: 'root',
                    text: title,
                    x: 400,
                    y: 300,
                    color: '#3498db',
                    isRoot: true,
                    children: [],
                    notes: ''
                }
            ],
            connections: []
        };
    }
    
    addNode(parentId = null) {
        if (!this.currentMap) return;
        
        const newNode = {
            id: Date.now().toString(),
            text: 'Nuovo Nodo',
            x: 200,
            y: 200,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            isRoot: false,
            children: [],
            notes: ''
        };
        
        // Se c'è un nodo selezionato, aggiungi come figlio
        if (this.selectedNode) {
            parentId = this.selectedNode.id;
            // Posiziona il nuovo nodo vicino al genitore
            const angle = Math.random() * 2 * Math.PI;
            const distance = 150;
            newNode.x = this.selectedNode.x + Math.cos(angle) * distance;
            newNode.y = this.selectedNode.y + Math.sin(angle) * distance;
        } else if (!parentId) {
            // Aggiungi come figlio del root
            const rootNode = this.currentMap.nodes.find(n => n.isRoot);
            if (rootNode) {
                parentId = rootNode.id;
                const angle = Math.random() * 2 * Math.PI;
                const distance = 150;
                newNode.x = rootNode.x + Math.cos(angle) * distance;
                newNode.y = rootNode.y + Math.sin(angle) * distance;
            }
        }
        
        this.currentMap.nodes.push(newNode);
        
        // Crea connessione
        if (parentId) {
            this.currentMap.connections.push({
                from: parentId,
                to: newNode.id
            });
            
            // Aggiungi ai children del genitore
            const parentNode = this.currentMap.nodes.find(n => n.id === parentId);
            if (parentNode) {
                parentNode.children.push(newNode.id);
            }
        }
        
        this.selectedNode = newNode;
        this.drawMindMap();
        this.editSelectedNode();
    }
    
    deleteSelectedNode() {
        if (!this.selectedNode || this.selectedNode.isRoot) return;
        
        const nodeId = this.selectedNode.id;
        
        // Rimuovi il nodo
        this.currentMap.nodes = this.currentMap.nodes.filter(n => n.id !== nodeId);
        
        // Rimuovi le connessioni
        this.currentMap.connections = this.currentMap.connections.filter(
            c => c.from !== nodeId && c.to !== nodeId
        );
        
        // Rimuovi dai children dei genitori
        this.currentMap.nodes.forEach(node => {
            node.children = node.children.filter(childId => childId !== nodeId);
        });
        
        this.selectedNode = null;
        this.drawMindMap();
        this.hideNodeInfo();
    }
    
    editSelectedNode() {
        if (!this.selectedNode) return;
        
        const nodeInfo = document.getElementById('node-info');
        const nodeText = document.getElementById('node-text');
        const nodeNotes = document.getElementById('node-notes');
        
        if (nodeInfo && nodeText && nodeNotes) {
            nodeInfo.classList.remove('hidden');
            nodeText.value = this.selectedNode.text;
            nodeNotes.value = this.selectedNode.notes || '';
            
            // Seleziona il colore corrente
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.style.backgroundColor === this.selectedNode.color) {
                    option.classList.add('selected');
                }
            });
            
            nodeText.focus();
            nodeText.select();
        }
    }
    
    saveNodeEdit() {
        if (!this.selectedNode) return;
        
        const nodeText = document.getElementById('node-text');
        const nodeNotes = document.getElementById('node-notes');
        const selectedColor = document.querySelector('.color-option.selected');
        
        if (nodeText) {
            this.selectedNode.text = nodeText.value || 'Nodo';
        }
        
        if (nodeNotes) {
            this.selectedNode.notes = nodeNotes.value || '';
        }
        
        if (selectedColor) {
            this.selectedNode.color = selectedColor.style.backgroundColor;
        }
        
        this.currentMap.modified = new Date().toISOString();
        this.drawMindMap();
        this.hideNodeInfo();
    }
    
    cancelNodeEdit() {
        this.hideNodeInfo();
    }
    
    hideNodeInfo() {
        const nodeInfo = document.getElementById('node-info');
        if (nodeInfo) {
            nodeInfo.classList.add('hidden');
        }
    }
    
    drawMindMap() {
        if (!this.ctx || !this.currentMap) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply zoom and pan
        this.ctx.save();
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(this.pan.x, this.pan.y);
        
        // Draw connections first
        this.drawConnections();
        
        // Draw nodes
        this.drawNodes();
        
        this.ctx.restore();
    }
    
    drawConnections() {
        this.ctx.strokeStyle = '#bdc3c7';
        this.ctx.lineWidth = 2;
        
        this.currentMap.connections.forEach(connection => {
            const fromNode = this.currentMap.nodes.find(n => n.id === connection.from);
            const toNode = this.currentMap.nodes.find(n => n.id === connection.to);
            
            if (fromNode && toNode) {
                this.ctx.beginPath();
                this.ctx.moveTo(fromNode.x, fromNode.y);
                
                // Curved line
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                const offset = 20;
                
                this.ctx.quadraticCurveTo(
                    midX + offset,
                    midY - offset,
                    toNode.x,
                    toNode.y
                );
                
                this.ctx.stroke();
            }
        });
    }
    
    drawNodes() {
        this.currentMap.nodes.forEach(node => {
            this.drawNode(node);
        });
    }
    
    drawNode(node) {
        const radius = node.isRoot ? 40 : 30;
        const isSelected = this.selectedNode && this.selectedNode.id === node.id;
        
        // Node circle
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = node.color;
        this.ctx.fill();
        
        // Selection border
        if (isSelected) {
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
        
        // Node text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = node.isRoot ? 'bold 14px Arial' : '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Wrap text if too long
        const maxWidth = radius * 1.5;
        const words = node.text.split(' ');
        let line = '';
        let y = node.y;
        
        if (words.length === 1 && this.ctx.measureText(node.text).width <= maxWidth) {
            this.ctx.fillText(node.text, node.x, y);
        } else {
            const lines = [];
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                if (this.ctx.measureText(testLine).width > maxWidth && i > 0) {
                    lines.push(line);
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);
            
            const lineHeight = 14;
            const startY = y - (lines.length - 1) * lineHeight / 2;
            
            lines.forEach((line, index) => {
                this.ctx.fillText(line.trim(), node.x, startY + index * lineHeight);
            });
        }
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom - this.pan.x;
        const y = (e.clientY - rect.top) / this.zoom - this.pan.y;
        
        // Check if clicking on a node
        const clickedNode = this.getNodeAt(x, y);
        
        if (clickedNode) {
            this.selectedNode = clickedNode;
            this.isDragging = true;
            this.dragOffset.x = x - clickedNode.x;
            this.dragOffset.y = y - clickedNode.y;
            this.drawMindMap();
        } else {
            this.selectedNode = null;
            this.hideNodeInfo();
            this.drawMindMap();
        }
    }
    
    handleMouseMove(e) {
        if (!this.isDragging || !this.selectedNode) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom - this.pan.x;
        const y = (e.clientY - rect.top) / this.zoom - this.pan.y;
        
        this.selectedNode.x = x - this.dragOffset.x;
        this.selectedNode.y = y - this.dragOffset.y;
        
        this.drawMindMap();
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
    }
    
    handleDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom - this.pan.x;
        const y = (e.clientY - rect.top) / this.zoom - this.pan.y;
        
        const clickedNode = this.getNodeAt(x, y);
        
        if (clickedNode) {
            this.selectedNode = clickedNode;
            this.editSelectedNode();
        }
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        const zoomFactor = 0.1;
        const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
        
        this.zoom = Math.max(0.1, Math.min(3, this.zoom + delta));
        this.drawMindMap();
    }
    
    handleKeyDown(e) {
        if (!document.querySelector('.mindmap-container')) return;
        
        switch (e.key) {
            case 'Delete':
            case 'Backspace':
                if (this.selectedNode && !this.selectedNode.isRoot) {
                    this.deleteSelectedNode();
                }
                break;
            case 'Enter':
                if (this.selectedNode) {
                    this.addNode(this.selectedNode.id);
                }
                break;
            case 'Escape':
                this.selectedNode = null;
                this.hideNodeInfo();
                this.drawMindMap();
                break;
        }
    }
    
    getNodeAt(x, y) {
        for (let node of this.currentMap.nodes) {
            const radius = node.isRoot ? 40 : 30;
            const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
            if (distance <= radius) {
                return node;
            }
        }
        return null;
    }
    
    zoomIn() {
        this.zoom = Math.min(3, this.zoom + 0.2);
        this.drawMindMap();
    }
    
    zoomOut() {
        this.zoom = Math.max(0.1, this.zoom - 0.2);
        this.drawMindMap();
    }
    
    resetView() {
        this.zoom = 1;
        this.pan = { x: 0, y: 0 };
        this.drawMindMap();
    }
    
    saveMindMap() {
        if (!this.currentMap) return;
        
        this.currentMap.modified = new Date().toISOString();
        
        // Salva nella lista delle mappe mentali
        const existingIndex = this.mindMaps.findIndex(m => m.id === this.currentMap.id);
        if (existingIndex >= 0) {
            this.mindMaps[existingIndex] = this.currentMap;
        } else {
            this.mindMaps.push(this.currentMap);
        }
        
        this.saveMindMaps();
        
        // Mostra notifica di salvataggio
        this.showNotification('Mappa mentale salvata con successo!', 'success');
    }
    
    loadTemplates() {
        const templatesGrid = document.querySelector('.templates-grid');
        if (!templatesGrid) return;
        
        templatesGrid.innerHTML = '';
        
        Object.entries(this.templates).forEach(([key, template]) => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.innerHTML = `
                <div class="template-icon">🧠</div>
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <button class="use-template-btn" data-template="${key}">Usa Template</button>
            `;
            
            templatesGrid.appendChild(templateCard);
        });
        
        // Event listeners per i template
        document.querySelectorAll('.use-template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateKey = e.target.dataset.template;
                this.createFromTemplate(templateKey);
            });
        });
    }
    
    createFromTemplate(templateKey) {
        const template = this.templates[templateKey];
        if (!template) return;
        
        this.createNewMindMap(template.structure.center);
        
        // Aggiungi i branch del template
        const rootNode = this.currentMap.nodes[0];
        const angleStep = (2 * Math.PI) / template.structure.branches.length;
        const radius = 150;
        
        template.structure.branches.forEach((branch, index) => {
            const angle = index * angleStep;
            const x = rootNode.x + Math.cos(angle) * radius;
            const y = rootNode.y + Math.sin(angle) * radius;
            
            const branchNode = {
                id: Date.now().toString() + index,
                text: branch.text,
                x: x,
                y: y,
                color: branch.color,
                isRoot: false,
                children: [],
                notes: ''
            };
            
            this.currentMap.nodes.push(branchNode);
            
            // Crea connessione
            this.currentMap.connections.push({
                from: rootNode.id,
                to: branchNode.id
            });
            
            rootNode.children.push(branchNode.id);
        });
        
        this.drawMindMap();
        this.switchMindMapTab('create');
    }
    
    loadMindMapLibrary() {
        const mindMapList = document.getElementById('mindmap-list');
        if (!mindMapList) return;
        
        mindMapList.innerHTML = '';
        
        if (this.mindMaps.length === 0) {
            mindMapList.innerHTML = `
                <div class="empty-library">
                    <div class="empty-icon">🧠</div>
                    <h3>Nessuna mappa mentale</h3>
                    <p>Crea la tua prima mappa mentale per iniziare!</p>
                </div>
            `;
            return;
        }
        
        this.mindMaps.forEach(mindMap => {
            const mapCard = document.createElement('div');
            mapCard.className = 'mindmap-card';
            mapCard.innerHTML = `
                <div class="mindmap-preview">
                    <div class="preview-icon">🧠</div>
                </div>
                <div class="mindmap-details">
                    <h4>${mindMap.title}</h4>
                    <p class="mindmap-meta">
                        Creata: ${new Date(mindMap.created).toLocaleDateString()}<br>
                        Modificata: ${new Date(mindMap.modified).toLocaleDateString()}<br>
                        Nodi: ${mindMap.nodes.length}
                    </p>
                    <div class="mindmap-actions">
                        <button class="load-mindmap-btn" data-id="${mindMap.id}">Apri</button>
                        <button class="duplicate-mindmap-btn" data-id="${mindMap.id}">Duplica</button>
                        <button class="delete-mindmap-btn" data-id="${mindMap.id}">Elimina</button>
                    </div>
                </div>
            `;
            
            mindMapList.appendChild(mapCard);
        });
        
        // Event listeners
        document.querySelectorAll('.load-mindmap-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mapId = e.target.dataset.id;
                this.loadMindMap(mapId);
            });
        });
        
        document.querySelectorAll('.duplicate-mindmap-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mapId = e.target.dataset.id;
                this.duplicateMindMap(mapId);
            });
        });
        
        document.querySelectorAll('.delete-mindmap-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mapId = e.target.dataset.id;
                this.deleteMindMap(mapId);
            });
        });
        
        // New mind map button
        const newMindMapBtn = document.getElementById('new-mindmap-btn');
        if (newMindMapBtn) {
            newMindMapBtn.addEventListener('click', () => {
                this.createNewMindMap();
                this.switchMindMapTab('create');
            });
        }
    }
    
    loadMindMap(mapId) {
        const mindMap = this.mindMaps.find(m => m.id === mapId);
        if (mindMap) {
            this.currentMap = JSON.parse(JSON.stringify(mindMap)); // Deep copy
            this.selectedNode = null;
            this.drawMindMap();
            this.switchMindMapTab('create');
        }
    }
    
    duplicateMindMap(mapId) {
        const mindMap = this.mindMaps.find(m => m.id === mapId);
        if (mindMap) {
            const duplicate = JSON.parse(JSON.stringify(mindMap));
            duplicate.id = Date.now().toString();
            duplicate.title = `${duplicate.title} (Copia)`;
            duplicate.created = new Date().toISOString();
            duplicate.modified = new Date().toISOString();
            
            this.mindMaps.push(duplicate);
            this.saveMindMaps();
            this.loadMindMapLibrary();
            
            this.showNotification('Mappa mentale duplicata!', 'success');
        }
    }
    
    deleteMindMap(mapId) {
        if (confirm('Sei sicuro di voler eliminare questa mappa mentale?')) {
            this.mindMaps = this.mindMaps.filter(m => m.id !== mapId);
            this.saveMindMaps();
            this.loadMindMapLibrary();
            
            this.showNotification('Mappa mentale eliminata!', 'success');
        }
    }
    
    switchMindMapTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.mindmap-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.mindmap-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Add active class to selected tab button
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        // Refresh canvas if switching to create tab
        if (tabName === 'create') {
            setTimeout(() => {
                this.setupCanvas();
            }, 100);
        }
    }
    
    closeMindMapInterface() {
        const container = document.querySelector('.mindmap-container');
        if (container) {
            container.classList.remove('show');
            setTimeout(() => {
                container.remove();
            }, 300);
        }
    }
    
    // Export functions
    exportMindMap(format) {
        if (!this.currentMap) return;
        
        switch (format) {
            case 'json':
                this.exportAsJSON();
                break;
            case 'png':
                this.exportAsPNG();
                break;
            case 'svg':
                this.exportAsSVG();
                break;
            case 'pdf':
                this.exportAsPDF();
                break;
        }
    }
    
    exportAsJSON() {
        const dataStr = JSON.stringify(this.currentMap, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.currentMap.title}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    exportAsPNG() {
        const link = document.createElement('a');
        link.download = `${this.currentMap.title}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    exportAsSVG() {
        // Implementazione SVG export
        this.showNotification('Export SVG in sviluppo', 'info');
    }
    
    exportAsPDF() {
        // Implementazione PDF export
        this.showNotification('Export PDF in sviluppo', 'info');
    }
    
    // Storage functions
    loadMindMaps() {
        try {
            const saved = localStorage.getItem('cronologia_mindmaps');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading mind maps:', error);
            return [];
        }
    }
    
    saveMindMaps() {
        try {
            localStorage.setItem('cronologia_mindmaps', JSON.stringify(this.mindMaps));
        } catch (error) {
            console.error('Error saving mind maps:', error);
        }
    }
    
    // Integration with historical data
    createMindMapFromEvent(eventData) {
        this.createNewMindMap(eventData.title);
        
        const rootNode = this.currentMap.nodes[0];
        const branches = [
            { text: `Data: ${eventData.date}`, color: '#e74c3c' },
            { text: `Luogo: ${eventData.location || 'N/A'}`, color: '#3498db' },
            { text: `Periodo: ${eventData.period}`, color: '#2ecc71' },
            { text: `Importanza: ${eventData.importance}`, color: '#f39c12' }
        ];
        
        if (eventData.people && eventData.people.length > 0) {
            branches.push({ text: `Persone: ${eventData.people.join(', ')}`, color: '#9b59b6' });
        }
        
        this.addBranchesToNode(rootNode, branches);
        this.drawMindMap();
    }
    
    addBranchesToNode(parentNode, branches) {
        const angleStep = (2 * Math.PI) / branches.length;
        const radius = 150;
        
        branches.forEach((branch, index) => {
            const angle = index * angleStep;
            const x = parentNode.x + Math.cos(angle) * radius;
            const y = parentNode.y + Math.sin(angle) * radius;
            
            const branchNode = {
                id: Date.now().toString() + index,
                text: branch.text,
                x: x,
                y: y,
                color: branch.color,
                isRoot: false,
                children: [],
                notes: ''
            };
            
            this.currentMap.nodes.push(branchNode);
            
            this.currentMap.connections.push({
                from: parentNode.id,
                to: branchNode.id
            });
            
            parentNode.children.push(branchNode.id);
        });
    }
    
    showNotification(message, type = 'info') {
        // Implementazione notifiche
        console.log(`${type.toUpperCase()}: ${message}`);
    }
    
    // Public methods for integration
    getMindMapStats() {
        return {
            totalMaps: this.mindMaps.length,
            totalNodes: this.mindMaps.reduce((sum, map) => sum + map.nodes.length, 0),
            lastCreated: this.mindMaps.length > 0 ? 
                Math.max(...this.mindMaps.map(m => new Date(m.created).getTime())) : null
        };
    }
}

// Initialize Mind Map Manager when DOM is loaded
if (typeof window !== 'undefined') {
    window.MindMapManager = MindMapManager;
    
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.mindMapManager) {
            window.mindMapManager = new MindMapManager();
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MindMapManager;
}