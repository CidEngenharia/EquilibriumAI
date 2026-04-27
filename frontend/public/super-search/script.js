// Funções Auxiliares
function getSearchTerm() {
    return document.getElementById('searchInput').value.trim();
}

function getFileTypeQuery() {
    const fileType = document.getElementById('fileType').value;
    return fileType ? ` filetype:${fileType}` : '';
}

function clearInput() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchInput').focus();
}

// Escuta a tecla Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchAll();
    }
});

// Motores de Busca
function searchGoogle() {
    let term = getSearchTerm();
    if (!term) return;
    term += getFileTypeQuery();
    const url = `https://www.google.com/search?q=${encodeURIComponent(term)}`;
    window.open(url, '_blank');
}

function searchDrive() {
    let term = getSearchTerm();
    if (!term) return;
    term = `site:drive.google.com ${term}` + getFileTypeQuery();
    const url = `https://www.google.com/search?q=${encodeURIComponent(term)}`;
    window.open(url, '_blank');
}

function searchGithub() {
    const term = getSearchTerm();
    if (!term) return;
    // Github search nativo não usa sempre os mesmos dorks, mas o `q=` base funciona bem
    // Pode-se usar advanced operators no term (language:python, etc)
    const url = `https://github.com/search?q=${encodeURIComponent(term)}`;
    window.open(url, '_blank');
}

function searchBing() {
    let term = getSearchTerm();
    if (!term) return;
    term += getFileTypeQuery();
    const url = `https://www.bing.com/search?q=${encodeURIComponent(term)}`;
    window.open(url, '_blank');
}

function searchDuckDuckGo() {
    let term = getSearchTerm();
    if (!term) return;
    term += getFileTypeQuery();
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(term)}`;
    window.open(url, '_blank');
}

function searchReddit() {
    let term = getSearchTerm();
    if (!term) return;
    // Usar a busca do reddit
    const url = `https://www.reddit.com/search/?q=${encodeURIComponent(term)}`;
    window.open(url, '_blank');
}

// Ações Múltiplas
function searchAll() {
    const term = getSearchTerm();
    if (!term) {
        alert('Por favor, digite algo para buscar.');
        return;
    }
    searchGoogle();
    searchDrive();
    searchGithub();
}

function deepSearch() {
    const term = getSearchTerm();
    if (!term) {
        alert('Por favor, digite algo para buscar.');
        return;
    }
    // Pode bloquear popup nos navegadores, mas como foi pedido DEEP SEARCH com abas:
    searchGoogle();
    setTimeout(searchDrive, 200);
    setTimeout(searchGithub, 400);
    setTimeout(searchBing, 600);
    setTimeout(searchDuckDuckGo, 800);
    setTimeout(searchReddit, 1000);
}

// Presets (Atalhos Inteligentes)
function presetPdfDrive() {
    const term = getSearchTerm() || 'relatório OR manual OR guia';
    const query = `site:drive.google.com filetype:pdf "${term}"`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
}

function presetSpreadsheets() {
    const term = getSearchTerm() || 'planilha OR orçamento OR lista';
    const query = `(filetype:xls OR filetype:xlsx OR filetype:csv) "${term}"`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
}

function presetResumes() {
    const term = getSearchTerm() || 'desenvolvedor';
    const query = `(intitle:curriculo OR intitle:resume) (filetype:pdf OR filetype:doc OR filetype:docx) "${term}"`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
}

function presetCodeGithub() {
    const term = getSearchTerm() || 'authentication';
    // Usando dorks específicos do github no q= (ex: language, stars, filename)
    const query = `${term} filename:.env OR filename:config stars:>50`;
    window.open(`https://github.com/search?q=${encodeURIComponent(query)}&type=code`, '_blank');
}