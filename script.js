// Estado da aplicação
let currentMode = 'direct'; // 'direct' ou 'inverse'
let calculationHistory = JSON.parse(localStorage.getItem('ruleOfThreeHistory')) || [];

// Elementos do DOM
const valueA = document.getElementById('valueA');
const valueB = document.getElementById('valueB');
const valueC = document.getElementById('valueC');
const resultX = document.getElementById('resultX');
const stepByStep = document.getElementById('stepByStep');
const historyList = document.getElementById('historyList');
const modeButtons = document.querySelectorAll('.mode-btn');
const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateHistoryDisplay();
    loadLastExample();
    
    // Configurar eventos
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
    
    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearFields);
    exampleBtn.addEventListener('click', loadExample);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Calcular ao pressionar Enter
    [valueA, valueB, valueC].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    });
});

// Definir modo (direta/inversa)
function setMode(mode) {
    currentMode = mode;
    
    // Atualizar botões ativos
    modeButtons.forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Atualizar explicação
    const explanation = mode === 'direct' 
        ? 'Na regra de três direta, as grandezas variam na mesma direção.'
        : 'Na regra de três inversa, as grandezas variam em direções opostas.';
    
    stepByStep.innerHTML = `<p><strong>Modo ${mode === 'direct' ? 'Direta' : 'Inversa'}:</strong> ${explanation}</p>`;
}

// Calcular regra de três
function calculate() {
    const a = parseFloat(valueA.value);
    const b = parseFloat(valueB.value);
    const c = parseFloat(valueC.value);
    
    // Validação
    if (!a || !b || !c || a === 0) {
        stepByStep.innerHTML = `
            <p style="color: #e53e3e;">⚠️ Preencha todos os valores com números diferentes de zero!</p>
            <p>Exemplo válido: A=2, B=10, C=5</p>
        `;
        resultX.value = '';
        return;
    }
    
    let x, formula, explanation;
    const timestamp = new Date().toLocaleTimeString();
    
    if (currentMode === 'direct') {
        // Direta: A/B = C/X  =>  X = (C * B) / A
        x = (c * b) / a;
        formula = 'X = (C × B) ÷ A';
        explanation = `
            <p><strong>Fórmula:</strong> ${formula}</p>
            <p><strong>Substituindo:</strong> X = (${c} × ${b}) ÷ ${a}</p>
            <p><strong>Cálculo:</strong> X = ${(c * b)} ÷ ${a} = <strong>${x.toFixed(2)}</strong></p>
            <p>📈 Como A e B são diretamente proporcionais, se A aumenta, B aumenta na mesma proporção.</p>
        `;
    } else {
        // Inversa: A * B = C * X  =>  X = (A * B) / C
        x = (a * b) / c;
        formula = 'X = (A × B) ÷ C';
        explanation = `
            <p><strong>Fórmura:</strong> ${formula}</p>
            <p><strong>Substituindo:</strong> X = (${a} × ${b}) ÷ ${c}</p>
            <p><strong>Cálculo:</strong> X = ${(a * b)} ÷ ${c} = <strong>${x.toFixed(2)}</strong></p>
            <p>📉 Como A e B são inversamente proporcionais, se A aumenta, B diminui na mesma proporção.</p>
        `;
    }
    
    // Atualizar resultado
    resultX.value = x.toFixed(2);
    stepByStep.innerHTML = explanation;
    
    // Salvar no histórico
    const calculation = {
        mode: currentMode,
        values: { a, b, c, x: parseFloat(x.toFixed(2)) },
        formula,
        timestamp
    };
    
    calculationHistory.unshift(calculation);
    if (calculationHistory.length > 5) {
        calculationHistory = calculationHistory.slice(0, 5);
    }
    
    localStorage.setItem('ruleOfThreeHistory', JSON.stringify(calculationHistory));
    updateHistoryDisplay();
}

// Limpar campos
function clearFields() {
    valueA.value = '';
    valueB.value = '';
    valueC.value = '';
    resultX.value = '';
    stepByStep.innerHTML = '<p class="placeholder">Preencha os valores acima para ver a resolução...</p>';
}

// Carregar exemplo
function loadExample() {
    if (currentMode === 'direct') {
        valueA.value = '2';
        valueB.value = '10';
        valueC.value = '5';
        stepByStep.innerHTML = `
            <p><strong>Exemplo Prático (Direta):</strong></p>
            <p>Se 2 operários constroem 10m de muro por dia, quantos metros 5 operários constroem?</p>
            <p>Clique em "Calcular X" para ver a solução!</p>
        `;
    } else {
        valueA.value = '4';
        valueB.value = '6';
        valueC.value = '2';
        stepByStep.innerHTML = `
            <p><strong>Exemplo Prático (Inversa):</strong></p>
            <p>Se 4 máquinas fazem um trabalho em 6 horas, em quanto tempo 2 máquinas fazem o mesmo trabalho?</p>
            <p>Clique em "Calcular X" para ver a solução!</p>
        `;
    }
}

// Carregar último exemplo do histórico
function loadLastExample() {
    if (calculationHistory.length > 0) {
        const last = calculationHistory[0];
        valueA.value = last.values.a;
        valueB.value = last.values.b;
        valueC.value = last.values.c;
    }
}

// Atualizar display do histórico
function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<li style="color: #a0aec0;">Nenhum cálculo no histórico</li>';
        return;
    }
    
    historyList.innerHTML = calculationHistory.map(calc => `
        <li>
            <div>
                <strong>${calc.mode === 'direct' ? 'Direta' : 'Inversa'}</strong><br>
                ${calc.values.a} → ${calc.values.b} | ${calc.values.c} → ${calc.values.x}
            </div>
            <span class="time">${calc.timestamp}</span>
        </li>
    `).join('');
}

// Limpar histórico
function clearHistory() {
    if (confirm('Tem certeza que quer limpar todo o histórico?')) {
        calculationHistory = [];
        localStorage.removeItem('ruleOfThreeHistory');
        updateHistoryDisplay();
    }
}