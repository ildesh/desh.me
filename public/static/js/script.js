document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');
    let activeItem = null;
    let isHovering = false;
    let hoverItem = null;
    
    // Funzione per determinare l'elemento attivo basato sull'URL corrente
    function determineActivePage() {
        const currentPath = window.location.pathname;
        let found = false;
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            
            // Vari metodi per determinare se un link è attivo
            const isActive = (
                href === currentPath ||
                (href === '/' && (currentPath === '/' || currentPath === '/index.html')) ||
                (href !== '/' && currentPath.includes(href.split('/').filter(p => p).pop()))
            );
            
            if (isActive) {
                item.classList.add('active');
                activeItem = item;
                
                // Imposta il colore appropriato solo se non c'è hover
                if (!isHovering) {
                    item.style.color = '#000';
                    updateBackgroundPosition(item);
                }
                
                found = true;
            } else {
                item.classList.remove('active');
                
                // Imposta il colore appropriato solo se non c'è hover
                if (!isHovering) {
                    item.style.color = '#fff';
                }
            }
        });
        
        // Se nessun elemento corrisponde, usa Home come fallback
        if (!found && navItems.length > 0) {
            navItems[0].classList.add('active');
            activeItem = navItems[0];
            if (!isHovering) {
                navItems[0].style.color = '#000';
                updateBackgroundPosition(activeItem);
            }
        }
        
        return activeItem;
    }
    
    // Imposta l'elemento attivo e il background iniziale
    activeItem = determineActivePage();
    
    // Intercetta i clic sui link della navbar
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Se è un link interno, aggiorna immediatamente lo stato senza attendere la navigazione
            if (href.startsWith('/') || href.startsWith('./') || href === '#') {
                navItems.forEach(navItem => {
                    navItem.classList.remove('active');
                    navItem.style.color = '#fff';
                });
                
                this.classList.add('active');
                this.style.color = '#000';
                activeItem = this;
                updateBackgroundPosition(this);
            }
        });
        
        // Gestione hover
        item.addEventListener('mouseenter', function() {
            isHovering = true;
            hoverItem = this;
            
            // Cambia il colore del testo per tutti gli elementi
            navItems.forEach(navItem => {
                if (navItem === this) {
                    navItem.style.color = '#000';
                } else {
                    navItem.style.color = '#fff';
                }
            });
            
            updateBackgroundPosition(this);
        });
    });
    
    // Quando il mouse esce dalla navbar
    navLinks.addEventListener('mouseleave', function() {
        isHovering = false;
        hoverItem = null;
        
        // Reimposta i colori in base all'elemento attivo
        if (activeItem) {
            navItems.forEach(navItem => {
                if (navItem === activeItem) {
                    navItem.style.color = '#000';
                } else {
                    navItem.style.color = '#fff';
                }
            });
            
            updateBackgroundPosition(activeItem);
        }
    });
    
    function updateBackgroundPosition(element) {
        if (!element) return;
        
        // Calcola la posizione e dimensione dell'elemento
        const rect = element.getBoundingClientRect();
        const navRect = navLinks.getBoundingClientRect();
        
        // Calcola la posizione relativa al contenitore della navbar
        const left = rect.left - navRect.left;
        const width = rect.width;
        
        // Applica il posizionamento tramite variabili CSS personalizzate
        navLinks.style.setProperty('--background-left', `${left}px`);
        navLinks.style.setProperty('--background-width', `${width}px`);
    }
    
    // Aggiungi un event listener per quando cambia l'URL (usando History API)
    window.addEventListener('popstate', function() {
        // Ridetermina l'elemento attivo quando cambia l'URL
        setTimeout(determineActivePage, 100); // Piccolo ritardo per assicurarci che l'URL sia aggiornato
    });
    
    // Aggiungi un event listener per i cambiamenti di dimensione della finestra
    window.addEventListener('resize', function() {
        // Riposiziona il background quando la finestra cambia dimensione
        if (activeItem && !isHovering) {
            updateBackgroundPosition(activeItem);
        } else if (hoverItem) {
            updateBackgroundPosition(hoverItem);
        }
    });
    
    // Aggiungi CSS personalizzato per le variabili
    const style = document.createElement('style');
    style.textContent = `
        .nav-links::after {
            left: var(--background-left, 0);
            width: var(--background-width, 0);
        }
    `;
    document.head.appendChild(style);
});