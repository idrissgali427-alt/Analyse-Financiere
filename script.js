// Données de base pour le calcul (ratios par rapport à l'huile)
const lyeValues = {
    palm: {
        menage: 0.141, // Ratio Soude/Huile pour le savon de ménage
        antiseptic: 0.144 // Ratio Soude/Huile pour le savon antiseptique
    },
    palmKernel: {
        menage: 0.198,
        antiseptic: 0.201
    }
};

const waterRatio = 0.38; // Ratio Eau/Huile totale
const saltSugarRatio = 0.05; // Ratio Sel/Sucre/Huile totale

// Éléments du DOM
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');

const singleFormulaTableBody = document.querySelector('#singleFormulaTable tbody');
const mixedFormulaTableBody = document.querySelector('#mixedFormulaTable tbody');
const hardFormulaTableBody = document.querySelector('#hardFormulaTable tbody');

// Variables pour les numéros de formule
let singleFormulaCount = localStorage.getItem('singleFormulaCount') ? parseInt(localStorage.getItem('singleFormulaCount')) : 0;
let mixedFormulaCount = localStorage.getItem('mixedFormulaCount') ? parseInt(localStorage.getItem('mixedFormulaCount')) : 0;
let hardFormulaCount = localStorage.getItem('hardFormulaCount') ? parseInt(localStorage.getItem('hardFormulaCount')) : 0;

// Fonction utilitaire pour le formatage
function formatNumber(num) {
    return num.toFixed(2);
}

// Fonction pour mettre à jour la date et l'heure

    


// Fonction pour gérer la navigation
function switchSection(targetId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
        const activeLink = document.querySelector(`a[href="#${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Gérer les clics sur les liens de navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        switchSection(targetId);
    });
});

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    

    // Afficher la première section par défaut
    switchSection('singleOilForm');

    // Charger les données sauvegardées
    loadSavedFormulas();
});

// --- Fonctions de Calcul ---

function calculateSingleOil() {
    const oilType = document.getElementById('oilTypeSingle').value;
    const soapType = document.getElementById('soapTypeSingle').value;
    const oilAmount = parseFloat(document.getElementById('oilAmountSingle').value);
    const managerName = document.getElementById('productionManagerName').value;

    if (isNaN(oilAmount) || oilAmount <= 0) {
        alert("Veuillez entrer une quantité d'huile valide.");
        return;
    }
    if (!managerName) {
        alert("Veuillez entrer le nom du responsable.");
        return;
    }

    const lyeRatio = lyeValues[oilType][soapType];
    const lyeAmount = oilAmount * lyeRatio;
    const waterAmount = oilAmount * waterRatio;
    const saltSugarAmount = oilAmount * saltSugarRatio;

    // Afficher les résultats
    document.getElementById('totalOilGramsSingle').textContent = formatNumber(oilAmount);
    document.getElementById('totalOilKgSingle').textContent = formatNumber(oilAmount / 1000);
    document.getElementById('lyeGramsSingle').textContent = formatNumber(lyeAmount);
    document.getElementById('lyeKgSingle').textContent = formatNumber(lyeAmount / 1000);
    document.getElementById('waterGramsSingle').textContent = formatNumber(waterAmount);
    document.getElementById('waterKgSingle').textContent = formatNumber(waterAmount / 1000);
    document.getElementById('saltSugarGramsSingle').textContent = formatNumber(saltSugarAmount);
    document.getElementById('saltSugarKgSingle').textContent = formatNumber(saltSugarAmount / 1000);

    // Mettre à jour le numéro de formule
    singleFormulaCount++;
    const formulaNumber = `S${String(singleFormulaCount).padStart(3, '0')}`;
    document.getElementById('formulaNumberSingle').value = formulaNumber;

    // Stocker les résultats temporairement pour la sauvegarde
    const result = {
        formulaNumber,
        managerName,
        date: new Date().toLocaleString('fr-FR'),
        oilType,
        soapType,
        oilAmount: formatNumber(oilAmount),
        lyeAmount: formatNumber(lyeAmount),
        waterAmount: formatNumber(waterAmount),
        saltSugarAmount: formatNumber(saltSugarAmount)
    };
    localStorage.setItem('tempSingleResult', JSON.stringify(result));
}

function calculateMixedOils() {
    const palmOilAmount = parseFloat(document.getElementById('palmOilAmountMixed').value);
    const palmKernelOilAmount = parseFloat(document.getElementById('palmKernelOilAmountMixed').value);
    const soapType = document.getElementById('soapTypeMixed').value;
    const managerName = document.getElementById('productionManagerName').value;

    if ((isNaN(palmOilAmount) && isNaN(palmKernelOilAmount)) || (palmOilAmount + palmKernelOilAmount) <= 0) {
        alert("Veuillez entrer au moins une quantité d'huile valide.");
        return;
    }
    if (!managerName) {
        alert("Veuillez entrer le nom du responsable.");
        return;
    }

    const totalOilAmount = (isNaN(palmOilAmount) ? 0 : palmOilAmount) + (isNaN(palmKernelOilAmount) ? 0 : palmKernelOilAmount);

    const lyePalm = (isNaN(palmOilAmount) ? 0 : palmOilAmount) * lyeValues.palm[soapType];
    const lyePalmKernel = (isNaN(palmKernelOilAmount) ? 0 : palmKernelOilAmount) * lyeValues.palmKernel[soapType];
    const totalLyeAmount = lyePalm + lyePalmKernel;

    const waterAmount = totalOilAmount * waterRatio;
    const saltSugarAmount = totalOilAmount * saltSugarRatio;

    // Afficher les résultats
    document.getElementById('palmOilGramsMixed').textContent = formatNumber(isNaN(palmOilAmount) ? 0 : palmOilAmount);
    document.getElementById('palmOilKgMixed').textContent = formatNumber((isNaN(palmOilAmount) ? 0 : palmOilAmount) / 1000);
    document.getElementById('palmKernelOilGramsMixed').textContent = formatNumber(isNaN(palmKernelOilAmount) ? 0 : palmKernelOilAmount);
    document.getElementById('palmKernelOilKgMixed').textContent = formatNumber((isNaN(palmKernelOilAmount) ? 0 : palmKernelOilAmount) / 1000);
    document.getElementById('totalOilGramsMixed').textContent = formatNumber(totalOilAmount);
    document.getElementById('totalOilKgMixed').textContent = formatNumber(totalOilAmount / 1000);
    document.getElementById('lyeGramsMixed').textContent = formatNumber(totalLyeAmount);
    document.getElementById('lyeKgMixed').textContent = formatNumber(totalLyeAmount / 1000);
    document.getElementById('waterGramsMixed').textContent = formatNumber(waterAmount);
    document.getElementById('waterKgMixed').textContent = formatNumber(waterAmount / 1000);
    document.getElementById('saltSugarGramsMixed').textContent = formatNumber(saltSugarAmount);
    document.getElementById('saltSugarKgMixed').textContent = formatNumber(saltSugarAmount / 1000);

    // Mettre à jour le numéro de formule
    mixedFormulaCount++;
    const formulaNumber = `M${String(mixedFormulaCount).padStart(3, '0')}`;
    document.getElementById('formulaNumberMixed').value = formulaNumber;

    // Stocker les résultats temporairement pour la sauvegarde
    const result = {
        formulaNumber,
        managerName,
        date: new Date().toLocaleString('fr-FR'),
        soapType,
        palmOilAmount: formatNumber(isNaN(palmOilAmount) ? 0 : palmOilAmount),
        palmKernelOilAmount: formatNumber(isNaN(palmKernelOilAmount) ? 0 : palmKernelOilAmount),
        lyeAmount: formatNumber(totalLyeAmount),
        waterAmount: formatNumber(waterAmount),
        saltSugarAmount: formatNumber(saltSugarAmount)
    };
    localStorage.setItem('tempMixedResult', JSON.stringify(result));
}

function calculateHardSoap() {
    const lyeKg = parseFloat(document.getElementById('lyeAmountHardSoap').value);
    const soapType = document.getElementById('soapTypeHardSoap').value;
    const managerName = document.getElementById('productionManagerName').value;

    if (isNaN(lyeKg) || lyeKg <= 0) {
        alert("Veuillez entrer une quantité de soude valide.");
        return;
    }
    if (!managerName) {
        alert("Veuillez entrer le nom du responsable.");
        return;
    }

    const lyeGrams = lyeKg * 1000;

    const palmOilLyeRatio = lyeValues.palm[soapType];
    const palmKernelLyeRatio = lyeValues.palmKernel[soapType];

    // Formule 1 : 70% Palme, 30% Palmiste
    // Calcule la quantité totale d'huile pour la quantité de soude donnée, en utilisant un ratio combiné.
    const combinedLyeRatio = (0.7 * palmOilLyeRatio) + (0.3 * palmKernelLyeRatio);
    const totalOilGrams1 = lyeGrams / combinedLyeRatio;
    const palmOilGrams1 = totalOilGrams1 * 0.7;
    const palmKernelOilGrams1 = totalOilGrams1 * 0.3;
    const waterGrams1 = totalOilGrams1 * waterRatio;
    const saltSugarGrams1 = totalOilGrams1 * saltSugarRatio;

    // Formule 2 : 100% Palmiste
    const palmKernelOilGrams2 = lyeGrams / palmKernelLyeRatio;
    const waterGrams2 = palmKernelOilGrams2 * waterRatio;
    const saltSugarGrams2 = palmKernelOilGrams2 * saltSugarRatio;

    const resultsDiv = document.getElementById('hardSoapResults');
    resultsDiv.innerHTML = `
        <div class="result-section">
            <h4>Formule 1: Savon 70% Palme, 30% Palmiste</h4>
            <p><strong>Soude (NaOH) :</strong> ${formatNumber(lyeGrams)} g (${formatNumber(lyeKg)} kg)</p>
            <p><strong>Huile de Palme :</strong> ${formatNumber(palmOilGrams1)} g (${formatNumber(palmOilGrams1 / 1000)} kg)</p>
            <p><strong>Huile de Palmiste :</strong> ${formatNumber(palmKernelOilGrams1)} g (${formatNumber(palmKernelOilGrams1 / 1000)} kg)</p>
            <p><strong>Huile Totale :</strong> ${formatNumber(totalOilGrams1)} g (${formatNumber(totalOilGrams1 / 1000)} kg)</p>
            <p><strong>Eau :</strong> ${formatNumber(waterGrams1)} g (${formatNumber(waterGrams1 / 1000)} kg)</p>
            <p><strong>Sel ou Sucre :</strong> ${formatNumber(saltSugarGrams1)} g (${formatNumber(saltSugarGrams1 / 1000)} kg)</p>
            <div class="form-actions-small">
                <button onclick="saveHardSoapFormula('mixed')" class="btn btn-success">Enregistrer Formule 1</button>
            </div>
        </div>
        <div class="result-section">
            <h4>Formule 2: Savon 100% Huile de Palmiste</h4>
            <p><strong>Soude (NaOH) :</strong> ${formatNumber(lyeGrams)} g (${formatNumber(lyeKg)} kg)</p>
            <p><strong>Huile de Palme :</strong> 0 g (0 kg)</p>
            <p><strong>Huile de Palmiste :</strong> ${formatNumber(palmKernelOilGrams2)} g (${formatNumber(palmKernelOilGrams2 / 1000)} kg)</p>
            <p><strong>Huile Totale :</strong> ${formatNumber(palmKernelOilGrams2)} g (${formatNumber(palmKernelOilGrams2 / 1000)} kg)</p>
            <p><strong>Eau :</strong> ${formatNumber(waterGrams2)} g (${formatNumber(waterGrams2 / 1000)} kg)</p>
            <p><strong>Sel ou Sucre :</strong> ${formatNumber(saltSugarGrams2)} g (${formatNumber(saltSugarGrams2 / 1000)} kg)</p>
            <div class="form-actions-small">
                <button onclick="saveHardSoapFormula('palmKernel')" class="btn btn-success">Enregistrer Formule 2</button>
            </div>
        </div>
    `;

    // Stocker les résultats temporairement pour la sauvegarde
    const result1 = {
        reportNumber: `H${String(hardFormulaCount + 1).padStart(3, '0')}`,
        managerName,
        date: new Date().toLocaleString('fr-FR'),
        soapType: `${soapType} (70% Palme, 30% Palmiste)`,
        lyeAmount: formatNumber(lyeGrams),
        palmOilAmount: formatNumber(palmOilGrams1),
        palmKernelOilAmount: formatNumber(palmKernelOilGrams1),
        waterAmount: formatNumber(waterGrams1),
        saltSugarAmount: formatNumber(saltSugarGrams1)
    };

    const result2 = {
        reportNumber: `H${String(hardFormulaCount + 2).padStart(3, '0')}`,
        managerName,
        date: new Date().toLocaleString('fr-FR'),
        soapType: `${soapType} (100% Palmiste)`,
        lyeAmount: formatNumber(lyeGrams),
        palmOilAmount: 0,
        palmKernelOilAmount: formatNumber(palmKernelOilGrams2),
        waterAmount: formatNumber(waterGrams2),
        saltSugarAmount: formatNumber(saltSugarGrams2)
    };

    localStorage.setItem('tempHardResult1', JSON.stringify(result1));
    localStorage.setItem('tempHardResult2', JSON.stringify(result2));
}

// --- Fonctions de Sauvegarde et de Chargement ---

function saveSingleFormula() {
    const result = JSON.parse(localStorage.getItem('tempSingleResult'));
    if (!result) {
        alert("Veuillez d'abord calculer une formule simple.");
        return;
    }

    let savedFormulas = JSON.parse(localStorage.getItem('singleFormulas')) || [];
    savedFormulas.push(result);
    localStorage.setItem('singleFormulas', JSON.stringify(savedFormulas));
    localStorage.setItem('singleFormulaCount', singleFormulaCount);

    addSingleFormulaToTable(result);
    alert('Formule simple enregistrée avec succès!');
    localStorage.removeItem('tempSingleResult');
}

function saveMixedFormula() {
    const result = JSON.parse(localStorage.getItem('tempMixedResult'));
    if (!result) {
        alert("Veuillez d'abord calculer une formule mixte.");
        return;
    }

    let savedFormulas = JSON.parse(localStorage.getItem('mixedFormulas')) || [];
    savedFormulas.push(result);
    localStorage.setItem('mixedFormulas', JSON.stringify(savedFormulas));
    localStorage.setItem('mixedFormulaCount', mixedFormulaCount);

    addMixedFormulaToTable(result);
    alert('Formule mixte enregistrée avec succès!');
    localStorage.removeItem('tempMixedResult');
}

function saveHardSoapFormula(oilType) {
    let result = null;
    if (oilType === 'mixed') {
        result = JSON.parse(localStorage.getItem('tempHardResult1'));
    } else if (oilType === 'palmKernel') {
        result = JSON.parse(localStorage.getItem('tempHardResult2'));
    }

    if (!result) {
        alert("Veuillez d'abord calculer une formule de savon dur.");
        return;
    }

    let savedFormulas = JSON.parse(localStorage.getItem('hardFormulas')) || [];
    savedFormulas.push(result);
    localStorage.setItem('hardFormulas', JSON.stringify(savedFormulas));

    // Mettre à jour le compteur en fonction du numéro de rapport sauvegardé
    const newCount = parseInt(result.reportNumber.substring(1));
    if (newCount > hardFormulaCount) {
        hardFormulaCount = newCount;
        localStorage.setItem('hardFormulaCount', hardFormulaCount);
    }

    addHardFormulaToTable(result);
    alert('Formule de savon dur enregistrée avec succès!');
    localStorage.removeItem('tempHardResult1');
    localStorage.removeItem('tempHardResult2');
}

function addSingleFormulaToTable(formula) {
    const row = singleFormulaTableBody.insertRow();
    row.innerHTML = `
        <td>${formula.formulaNumber}</td>
        <td>${formula.managerName}</td>
        <td>${formula.date}</td>
        <td>${formula.soapType === 'menage' ? 'Ménage' : 'Antiseptique'} (${formula.oilType === 'palm' ? 'Palme' : 'Palmiste'})</td>
        <td>${formula.oilAmount}</td>
        <td>${formula.lyeAmount}</td>
        <td>${formula.waterAmount}</td>
        <td>${formula.saltSugarAmount}</td>
    `;
}

function addMixedFormulaToTable(formula) {
    const row = mixedFormulaTableBody.insertRow();
    row.innerHTML = `
        <td>${formula.formulaNumber}</td>
        <td>${formula.managerName}</td>
        <td>${formula.date}</td>
        <td>${formula.soapType === 'menage' ? 'Ménage' : 'Antiseptique'}</td>
        <td>${formula.palmOilAmount}</td>
        <td>${formula.palmKernelOilAmount}</td>
        <td>${formula.lyeAmount}</td>
        <td>${formula.waterAmount}</td>
        <td>${formula.saltSugarAmount}</td>
    `;
}

function addHardFormulaToTable(formula) {
    const row = hardFormulaTableBody.insertRow();
    row.innerHTML = `
        <td>${formula.reportNumber}</td>
        <td>${formula.managerName}</td>
        <td>${formula.date}</td>
        <td>${formula.soapType}</td>
        <td>${formula.lyeAmount}</td>
        <td>${formula.palmOilAmount}</td>
        <td>${formula.palmKernelOilAmount}</td>
        <td>${formula.waterAmount}</td>
        <td>${formula.saltSugarAmount}</td>
    `;
}

function loadSavedFormulas() {
    const singleFormulas = JSON.parse(localStorage.getItem('singleFormulas')) || [];
    const mixedFormulas = JSON.parse(localStorage.getItem('mixedFormulas')) || [];
    const hardFormulas = JSON.parse(localStorage.getItem('hardFormulas')) || [];

    singleFormulaTableBody.innerHTML = '';
    mixedFormulaTableBody.innerHTML = '';
    hardFormulaTableBody.innerHTML = '';

    singleFormulas.forEach(formula => addSingleFormulaToTable(formula));
    mixedFormulas.forEach(formula => addMixedFormulaToTable(formula));
    hardFormulas.forEach(formula => addHardFormulaToTable(formula));
}

// --- Fonctions de Recherche ---

function searchFormula() {
    const searchNumber = document.getElementById('searchFormulaNumber').value.trim().toUpperCase();
    if (!searchNumber) {
        alert("Veuillez entrer un numéro de formule à rechercher.");
        return;
    }

    let found = false;

    // Recherche dans les formules simples
    const singleFormulas = JSON.parse(localStorage.getItem('singleFormulas')) || [];
    const singleResult = singleFormulas.find(f => f.formulaNumber === searchNumber);
    if (singleResult) {
        alert(`Formule Simple trouvée :
        N° Formule: ${singleResult.formulaNumber}
        Responsable: ${singleResult.managerName}
        Date: ${singleResult.date}
        Type Savon: ${singleResult.soapType === 'menage' ? 'Ménage' : 'Antiseptique'} (${singleResult.oilType === 'palm' ? 'Palme' : 'Palmiste'})
        Huile: ${singleResult.oilAmount} g
        Soude: ${singleResult.lyeAmount} g
        Eau: ${singleResult.waterAmount} g
        Sel/Sucre: ${singleResult.saltSugarAmount} g`);
        found = true;
    }

    // Recherche dans les formules mixtes
    const mixedFormulas = JSON.parse(localStorage.getItem('mixedFormulas')) || [];
    const mixedResult = mixedFormulas.find(f => f.formulaNumber === searchNumber);
    if (mixedResult) {
        alert(`Formule Mixte trouvée :
        N° Formule: ${mixedResult.formulaNumber}
        Responsable: ${mixedResult.managerName}
        Date: ${mixedResult.date}
        Type Savon: ${mixedResult.soapType === 'menage' ? 'Ménage' : 'Antiseptique'}
        Huile Palme: ${mixedResult.palmOilAmount} g
        Huile Palmiste: ${mixedResult.palmKernelOilAmount} g
        Soude: ${mixedResult.lyeAmount} g
        Eau: ${mixedResult.waterAmount} g
        Sel/Sucre: ${mixedResult.saltSugarAmount} g`);
        found = true;
    }

    // Recherche dans les formules de savon dur
    const hardFormulas = JSON.parse(localStorage.getItem('hardFormulas')) || [];
    const hardResult = hardFormulas.find(f => f.reportNumber === searchNumber);
    if (hardResult) {
        alert(`Formule Savon Dur trouvée :
        N° Rapport: ${hardResult.reportNumber}
        Responsable: ${hardResult.managerName}
        Date: ${hardResult.date}
        Type Savon: ${hardResult.soapType}
        Soude: ${hardResult.lyeAmount} g
        Huile Palme: ${hardResult.palmOilAmount} g
        Huile Palmiste: ${hardResult.palmKernelOilAmount} g
        Eau: ${hardResult.waterAmount} g
        Sel/Sucre: ${hardResult.saltSugarAmount} g`);
        found = true;
    }

    if (!found) {
        alert(`Aucune formule ou rapport ne correspond au numéro "${searchNumber}".`);
    }
}


//CODE DE PROTECTION



// Définis le mot de passe requis
const motDePasseRequis = '00C1';

// Demande à l'utilisateur d'entrer le mot de passe
let motDePasseSaisi = prompt('Veuillez entrer le mot de passe pour accéder à l\'application.');

// Vérifie si le mot de passe saisi est correct
if (motDePasseSaisi === motDePasseRequis) {
  // Le mot de passe est correct, tu peux continuer
  alert('Accès accordé !');
  // Ici, tu peux mettre tout le code de ton application
  // Par exemple, afficher le contenu de la page
} else {
  // Le mot de passe est incorrect
  alert('Mot de passe incorrect. Accès refusé !');
  // Tu peux rediriger l'utilisateur ou cacher le contenu
  window.location.href = ''; // Exemple de redirection
}

