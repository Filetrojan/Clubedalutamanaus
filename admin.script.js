document.addEventListener('DOMContentLoaded', () => {

    // --- AUTENTICAÇÃO ---
    const senhaCorreta = '1234'; 
    const senhaDigitada = prompt('Digite a senha para acessar o painel de administrador:');
    if (senhaDigitada !== senhaCorreta) {
        alert('Senha incorreta! Acesso negado.');
        document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50px;">ACESSO NEGADO</h1>';
        return; 
    }
    
    // --- INICIALIZAÇÃO DO PAINEL ---
    alert('Senha correta! Bem-vindo.');
    localStorage.setItem('isAdmin', 'true');
    carregarDadosDosLutadores();
    carregarApostas(); // Carrega a nova tabela de apostas
    adicionarListeners();

    // --- FUNÇÕES DE CARREGAMENTO ---
    function carregarDadosDosLutadores() { /* ... (código como antes) ... */ }

    function carregarApostas() {
        const corpoTabela = document.getElementById('lista-apostas');
        const apostas = JSON.parse(localStorage.getItem('apostas')) || [];
        if (!corpoTabela) return;
        corpoTabela.innerHTML = '';

        if (apostas.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhuma aposta recebida.</td></tr>';
            return;
        }

        apostas.forEach((aposta, index) => {
            const linha = document.createElement('tr');
            const statusClass = aposta.status === 'aprovada' ? 'aprovada' : 'pendente';
            const acaoAprovar = aposta.status === 'pendente' 
                ? `<button class="action-button btn-approve" data-action="approve" data-index="${index}">Aprovar</button>`
                : `<span class="status aprovada">Aprovada</span>`;

            linha.innerHTML = `
                <td>${aposta.apostador}</td>
                <td>${aposta.lutador}</td>
                <td>R$ ${aposta.valor.toFixed(2).replace('.', ',')}</td>
                <td><span class="status ${statusClass}">${aposta.status}</span></td>
                <td>
                    ${acaoAprovar}
                    <button class="action-button btn-delete" data-action="reject-bet" data-index="${index}">Recusar</button>
                </td>
            `;
            corpoTabela.appendChild(linha);
        });
    }

    // --- LISTENERS DE EVENTOS ---
    function adicionarListeners() {
        // Listener da tabela de lutadores
        document.getElementById('lista-admin').addEventListener('click', function(event) {
            const target = event.target;
            const action = target.dataset.action;
            const index = parseInt(target.dataset.index);
            if (!action) return;
            switch(action) {
                case 'edit': abrirModalEdicao(index); break;
                case 'delete': if (confirm('Tem certeza?')) excluirLutador(index); break;
                case 'up': moverLutador(index, 'up'); break;
                case 'down': moverLutador(index, 'down'); break;
            }
        });

        // Listener da nova tabela de apostas
        document.getElementById('lista-apostas').addEventListener('click', function(event) {
            const target = event.target;
            const action = target.dataset.action;
            const index = parseInt(target.dataset.index);
            if (!action) return;
            switch(action) {
                case 'approve': aprovarAposta(index); break;
                case 'reject-bet': if (confirm('Tem certeza?')) recusarAposta(index); break;
            }
        });

        // Outros listeners (deletar tudo, modal, etc.)
        document.getElementById('btn-delete-all').addEventListener('click', excluirTodaAListaDeLutadores);
        document.getElementById('edit-form').addEventListener('submit', salvarEdicao);
        document.getElementById('btn-cancel-edit').addEventListener('click', fecharModalEdicao);
    }

    // --- FUNÇÕES DE CONTROLE (LUTADORES E APOSTAS) ---
    function excluirLutador(index) { /* ... (código como antes) ... */ }
    function excluirTodaAListaDeLutadores() { /* ... (código como antes) ... */ }
    function moverLutador(index, direcao) { /* ... (código como antes) ... */ }

    function aprovarAposta(index) {
        let apostas = JSON.parse(localStorage.getItem('apostas')) || [];
        if (apostas[index]) {
            apostas[index].status = 'aprovada';
            localStorage.setItem('apostas', JSON.stringify(apostas));
            carregarApostas();
        }
    }
    function recusarAposta(index) {
        let apostas = JSON.parse(localStorage.getItem('apostas')) || [];
        apostas.splice(index, 1);
        localStorage.setItem('apostas', JSON.stringify(apostas));
        carregarApostas();
    }

    // --- LÓGICA DO MODAL DE EDIÇÃO ---
    function abrirModalEdicao(index) { /* ... (código como antes) ... */ }
    function fecharModalEdicao() { /* ... (código como antes) ... */ }
    function salvarEdicao(event) { /* ... (código como antes) ... */ }
});