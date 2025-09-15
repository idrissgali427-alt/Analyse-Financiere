document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.side-nav a');
    const formEntreprise = document.getElementById('form-entreprise');
    const formRapport = document.getElementById('form-rapport');
    const formBenefices = document.getElementById('form-benefices');
    const tableEntreprise = document.getElementById('table-entreprise').querySelector('tbody');
    const tableRapport = document.getElementById('table-rapport').querySelector('tbody');
    const tableBenefices = document.getElementById('table-benefices').querySelector('tbody');
    const selectEntrepriseRapport = document.getElementById('select-entreprise-rapport');
    const selectEntrepriseBenefices = document.getElementById('select-entreprise-benefices');
    const responsableInput = document.getElementById('responsable-input');
    
    // Éléments du bilan
    const selectEntrepriseBilan = document.getElementById('select-entreprise-bilan');
    const moisBilanInput = document.getElementById('mois-bilan-input');
    const anneeBilanInput = document.getElementById('annee-bilan-input');
    const genererBilanBtn = document.getElementById('generer-bilan');
    const imprimerBilanBtn = document.getElementById('imprimer-bilan');
    const bilanContentDiv = document.getElementById('bilan-content');
    const rapportsPieChartCanvas = document.getElementById('rapportsPieChart');

    // Initialisation des données depuis le stockage local
    let entreprises = JSON.parse(localStorage.getItem('entreprises')) || [];
    let rapports = JSON.parse(localStorage.getItem('rapports')) || [];
    let benefices = JSON.parse(localStorage.getItem('benefices')) || [];

    // Fonction pour afficher une section
    const showSection = (sectionId) => {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });

        updateReceipts(sectionId);
        if (sectionId === 'accueil') {
            generateDashboardCharts();
        }
    };

    // Fonction pour mettre à jour les reçus
    const receiptHeaders = document.querySelectorAll('.receipt-header');
    const updateReceipts = (sectionId, customInfo = null) => {
        const dateHeure = new Date().toLocaleString('fr-FR');
        const responsable = responsableInput.value || 'Non renseigné';
        let titre = '';
        let infoSpecifique = '';

        switch (sectionId) {
            case 'accueil':
                titre = 'Tableau de bord financier';
                infoSpecifique = `Vue d'ensemble des 5 derniers rapports.`;
                break;
            case 'type-entreprise':
                titre = 'Récapitulatif des entreprises';
                infoSpecifique = `Nombre d'entreprises enregistrées : ${entreprises.length}`;
                break;
            case 'rapport-financier':
                titre = 'Récapitulatif des rapports';
                infoSpecifique = `Nombre de rapports enregistrés : ${rapports.length}`;
                break;
            case 'suivi-benefices':
                titre = 'Récapitulatif des bénéfices';
                infoSpecifique = `Nombre de suivis de bénéfices : ${benefices.length}`;
                break;
            case 'bilan-global':
                titre = 'Bilan Global';
                infoSpecifique = customInfo || `Veuillez générer un bilan pour voir les informations.`;
                break;
            default:
                titre = 'Récapitulatif';
                infoSpecifique = '';
                break;
        }

        receiptHeaders.forEach(header => {
            if (header.closest('.content-section').id === sectionId) {
                header.innerHTML = `
                    <h3>${titre}</h3>
                    <div class="info">
                        <p>Date et Heure: ${dateHeure}</p>
                        <p>Responsable: ${responsable}</p>
                        <p>${infoSpecifique}</p>
                    </div>
                `;
            } else {
                header.innerHTML = '';
            }
        });
    };

    // Fonctions de mise à jour de l'interface
    const updateDateTime = () => {
        const now = new Date();
        document.getElementById('date-heure').textContent = now.toLocaleString('fr-FR');
    };

    const updateResponsable = () => {
        document.querySelectorAll('.automatic-field#responsable-entreprise').forEach(el => {
            el.value = responsableInput.value;
        });
    };

    // Fonctions de rendu des tableaux
    const renderEntreprises = () => {
        tableEntreprise.innerHTML = '';
        entreprises.forEach((ent, index) => {
            const row = tableEntreprise.insertRow();
            row.innerHTML = `
                <td>${ent.num}</td>
                <td>${ent.type}</td>
                <td>${ent.directeur}</td>
                <td>${ent.masseSalariale}</td>
                <td>${ent.responsable}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Modifier</button>
                    <button class="delete-btn" data-index="${index}">Supprimer</button>
                </td>
            `;
        });
        updateSelects();
    };

    const renderRapports = () => {
        tableRapport.innerHTML = '';
        rapports.forEach((rap, index) => {
            const entreprise = entreprises.find(e => e.num == rap.entrepriseNum);
            const entrepriseNom = entreprise ? entreprise.type : 'Inconnu';
            const dateFormatted = new Date(rap.date).toLocaleDateString('fr-FR');

            const row = tableRapport.insertRow();
            row.innerHTML = `
                <td>${rap.num}</td>
                <td>${entrepriseNom}</td>
                <td>${rap.chiffreAchat}</td>
                <td>${rap.chiffreProduction}</td>
                <td>${rap.chiffreVente}</td>
                <td>${rap.masseSalariale}</td>
                <td>${dateFormatted}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Modifier</button>
                    <button class="delete-btn" data-index="${index}">Supprimer</button>
                </td>
            `;
        });
    };

    const renderBenefices = () => {
        tableBenefices.innerHTML = '';
        benefices.forEach((ben, index) => {
            const entreprise = entreprises.find(e => e.num == ben.entrepriseNum);
            const entrepriseNom = entreprise ? entreprise.type : 'Inconnu';
            const dateFormatted = new Date(ben.date).toLocaleDateString('fr-FR');
            
            const row = tableBenefices.insertRow();
            row.innerHTML = `
                <td>${entrepriseNom}</td>
                <td>${ben.masseSalariale}</td>
                <td>${ben.beneficesPrevus}</td>
                <td>${ben.beneficesRecus}</td>
                <td>${dateFormatted}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Modifier</button>
                    <button class="delete-btn" data-index="${index}">Supprimer</button>
                </td>
            `;
        });
    };

    const updateSelects = () => {
        const selects = [selectEntrepriseRapport, selectEntrepriseBenefices, selectEntrepriseBilan];
        selects.forEach(select => {
            select.innerHTML = '<option value="">Sélectionner une entreprise</option>';
            entreprises.forEach(ent => {
                const option = document.createElement('option');
                option.value = ent.num;
                option.textContent = ent.type;
                select.appendChild(option);
            });
        });
    };

    const calculerBenefices = (entrepriseNum) => {
        const rapportsFiltres = rapports.filter(r => r.entrepriseNum == entrepriseNum);
        const totalVentes = rapportsFiltres.reduce((sum, r) => sum + r.chiffreVente, 0);
        const totalAchats = rapportsFiltres.reduce((sum, r) => sum + r.chiffreAchat, 0);
        const totalProduction = rapportsFiltres.reduce((sum, r) => sum + r.chiffreProduction, 0);
        const totalSalaires = rapportsFiltres.reduce((sum, r) => sum + r.masseSalariale, 0);

        const beneficesPrevus = totalVentes * 0.2; 
        const beneficesReels = totalVentes - totalAchats - totalProduction - totalSalaires;

        document.getElementById('benefices-prevus-input').value = beneficesPrevus.toFixed(2);
        document.getElementById('benefices-recus-input').value = beneficesReels.toFixed(2);
    };

    // Génération des graphiques du tableau de bord
    const generateDashboardCharts = () => {
        const last5Rapports = rapports.slice(-5);
        const labels = last5Rapports.map(r => new Date(r.date).toLocaleDateString('fr-FR'));
        const achatData = last5Rapports.map(r => r.chiffreAchat);
        const productionData = last5Rapports.map(r => r.chiffreProduction);
        const venteData = last5Rapports.map(r => r.chiffreVente);
        const salairesData = last5Rapports.map(r => r.masseSalariale);
        const beneficePrevusData = benefices.filter(b => last5Rapports.some(r => r.entrepriseNum == b.entrepriseNum)).map(b => b.beneficesPrevus);
        const beneficeRecusData = benefices.filter(b => last5Rapports.some(r => r.entrepriseNum == b.entrepriseNum)).map(b => b.beneficesRecus);

        const oldFinancialChart = Chart.getChart('financialChart');
        if (oldFinancialChart) oldFinancialChart.destroy();
        const oldBeneficeChart = Chart.getChart('beneficeChart');
        if (oldBeneficeChart) oldBeneficeChart.destroy();

        new Chart(document.getElementById('financialChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Chiffre d\'achat', data: achatData, borderColor: '#ff6384', fill: false, tension: 0.1 },
                    { label: 'Chiffre de production', data: productionData, borderColor: '#36a2eb', fill: false, tension: 0.1 },
                    { label: 'Chiffre de vente', data: venteData, borderColor: '#4bc0c0', fill: false, tension: 0.1 },
                    { label: 'Masse salariale', data: salairesData, borderColor: '#ffce56', fill: false, tension: 0.1 }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Évolution financière (5 derniers rapports)' }
                }
            }
        });

        new Chart(document.getElementById('beneficeChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Masse salariale', data: salairesData, backgroundColor: '#ffce56' },
                    { label: 'Bénéfices prévus', data: beneficePrevusData, backgroundColor: '#36a2eb' },
                    { label: 'Bénéfices reçus', data: beneficeRecusData, backgroundColor: '#4bc0c0' }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Bénéfices (5 derniers rapports)' }
                }
            }
        });
    };

    // Génération du bilan
    const generateBilan = () => {
        const entrepriseNum = selectEntrepriseBilan.value;
        const mois = moisBilanInput.value;
        const annee = anneeBilanInput.value;
        
        // Mise à jour du reçu en premier
        const moisTexte = moisBilanInput.value ? moisBilanInput.options[moisBilanInput.selectedIndex].text : 'Tous les mois';
        const anneeTexte = anneeBilanInput.value || 'Toutes les années';
        const infoBilan = `Bilan pour : ${moisTexte}, ${anneeTexte}`;
        updateReceipts('bilan-global', infoBilan);

        if (!entrepriseNum) {
            bilanContentDiv.innerHTML = '<p>Veuillez sélectionner une entreprise.</p>';
            const oldPieChart = Chart.getChart('rapportsPieChart');
            if (oldPieChart) oldPieChart.destroy();
            return;
        }

        const rapportsFiltres = rapports.filter(r => {
            const rapportDate = new Date(r.date);
            const rapportAnnee = rapportDate.getFullYear().toString();
            const rapportMois = (rapportDate.getMonth() + 1).toString().padStart(2, '0');
            
            const matchEntreprise = r.entrepriseNum == entrepriseNum;
            const matchMois = !mois || rapportMois === mois;
            const matchAnnee = !annee || rapportAnnee === annee;

            return matchEntreprise && matchMois && matchAnnee;
        });

        if (rapportsFiltres.length === 0) {
            bilanContentDiv.innerHTML = '<p>Aucune donnée de rapport financier pour les critères sélectionnés.</p>';
            const oldPieChart = Chart.getChart('rapportsPieChart');
            if (oldPieChart) oldPieChart.destroy();
            return;
        }

        const totalAchats = rapportsFiltres.reduce((sum, r) => sum + r.chiffreAchat, 0);
        const totalProduction = rapportsFiltres.reduce((sum, r) => sum + r.chiffreProduction, 0);
        const totalVentes = rapportsFiltres.reduce((sum, r) => sum + r.chiffreVente, 0);
        const totalSalaires = rapportsFiltres.reduce((sum, r) => sum + r.masseSalariale, 0);
        const beneficeNet = totalVentes - (totalAchats + totalProduction + totalSalaires);
        
        // Affichage des informations sur la page
        const resultatBilanDiv = document.getElementById('resultat-bilan');
        resultatBilanDiv.style.display = 'block'; // S'assure que la section est visible

        bilanContentDiv.innerHTML = `
            <h3>Résumé Financier</h3>
            <p><strong>Total des Ventes:</strong> ${totalVentes}€</p>
            <p><strong>Total des Achats:</strong> ${totalAchats}€</p>
            <p><strong>Total de la Production:</strong> ${totalProduction}€</p>
            <p><strong>Masse Salariale Totale:</strong> ${totalSalaires}€</p>
            <p><strong>Bénéfice Net:</strong> ${beneficeNet}€</p>
        `;

        generatePieChart(totalAchats, totalProduction, totalVentes, totalSalaires);
    };

    const generatePieChart = (achats, production, ventes, salaires) => {
        const data = [achats, production, salaires, ventes];
        const labels = ['Achats', 'Production', 'Masse Salariale', 'Ventes'];
        const colors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'];

        const oldPieChart = Chart.getChart('rapportsPieChart');
        if (oldPieChart) oldPieChart.destroy();

        new Chart(rapportsPieChartCanvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Répartition des Chiffres'
                    }
                }
            }
        });
    };

    const imprimerBilan = () => {
        window.print();
    };

    // Événements
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(link.dataset.section);
        });
    });

    responsableInput.addEventListener('input', updateResponsable);
    responsableInput.addEventListener('change', () => {
        const activeSection = document.querySelector('.content-section.active').id;
        updateReceipts(activeSection);
    });

    formEntreprise.addEventListener('submit', (e) => {
        e.preventDefault();
        const newEntreprise = {
            num: entreprises.length + 1,
            type: document.getElementById('type-entreprise-input').value,
            directeur: document.getElementById('directeur-general-input').value,
            masseSalariale: parseInt(document.getElementById('masse-salariale-input').value),
            responsable: responsableInput.value
        };
        entreprises.push(newEntreprise);
        localStorage.setItem('entreprises', JSON.stringify(entreprises));
        renderEntreprises();
        formEntreprise.reset();
        updateReceipts('type-entreprise');
    });

    selectEntrepriseRapport.addEventListener('change', () => {
        const entreprise = entreprises.find(e => e.num == selectEntrepriseRapport.value);
        if (entreprise) {
            document.getElementById('masse-salariale-rapport-input').value = entreprise.masseSalariale;
        } else {
            document.getElementById('masse-salariale-rapport-input').value = '';
        }
    });

    formRapport.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRapport = {
            num: rapports.length + 1,
            entrepriseNum: selectEntrepriseRapport.value,
            chiffreAchat: parseInt(document.getElementById('chiffre-achat-input').value),
            chiffreProduction: parseInt(document.getElementById('chiffre-production-input').value),
            chiffreVente: parseInt(document.getElementById('chiffre-vente-input').value),
            masseSalariale: parseInt(document.getElementById('masse-salariale-rapport-input').value),
            date: document.getElementById('date-rapport-input').value
        };
        rapports.push(newRapport);
        localStorage.setItem('rapports', JSON.stringify(rapports));
        renderRapports();
        formRapport.reset();
        updateReceipts('rapport-financier');
    });

    selectEntrepriseBenefices.addEventListener('change', () => {
        const entrepriseNum = parseInt(selectEntrepriseBenefices.value);
        if (entrepriseNum) {
            const entreprise = entreprises.find(e => e.num === entrepriseNum);
            document.getElementById('masse-salariale-benefice-input').value = entreprise.masseSalariale;
            calculerBenefices(entrepriseNum);
        } else {
            document.getElementById('masse-salariale-benefice-input').value = '';
            document.getElementById('benefices-prevus-input').value = '';
            document.getElementById('benefices-recus-input').value = '';
        }
    });

    formBenefices.addEventListener('submit', (e) => {
        e.preventDefault();
        const newBenefice = {
            entrepriseNum: selectEntrepriseBenefices.value,
            masseSalariale: parseInt(document.getElementById('masse-salariale-benefice-input').value),
            beneficesPrevus: parseFloat(document.getElementById('benefices-prevus-input').value),
            beneficesRecus: parseFloat(document.getElementById('benefices-recus-input').value),
            date: document.getElementById('date-benefices-input').value
        };
        benefices.push(newBenefice);
        localStorage.setItem('benefices', JSON.stringify(benefices));
        renderBenefices();
        formBenefices.reset();
        updateReceipts('suivi-benefices');
    });
    
    // Ajout d'événements pour les boutons de bilan
    genererBilanBtn.addEventListener('click', generateBilan);
    imprimerBilanBtn.addEventListener('click', imprimerBilan);

    // Écouteurs pour les boutons de suppression
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            const tableId = e.target.closest('table').id;
            
            if (tableId === 'table-entreprise') {
                entreprises.splice(index, 1);
                localStorage.setItem('entreprises', JSON.stringify(entreprises));
                renderEntreprises();
            } else if (tableId === 'table-rapport') {
                rapports.splice(index, 1);
                localStorage.setItem('rapports', JSON.stringify(rapports));
                renderRapports();
            } else if (tableId === 'table-benefices') {
                benefices.splice(index, 1);
                localStorage.setItem('benefices', JSON.stringify(benefices));
                renderBenefices();
            }
            const activeSection = document.querySelector('.content-section.active').id;
            updateReceipts(activeSection);
        }
    });

    // Initialisation au chargement de la page
    updateDateTime();
    setInterval(updateDateTime, 1000);
    renderEntreprises();
    renderRapports();
    renderBenefices();
    showSection('accueil');
});



//CODE DE PROTECTION



// Définis le mot de passe requis
const motDePasseRequis = '001A';

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