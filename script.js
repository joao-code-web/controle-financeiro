const transactonsUl = window.document.querySelector("#transactions"); //<ul id="transactions" class="transactions"></ul>
const incomeDisplay = window.document.querySelector('#money-plus'); //<p id="money-plus" class="money plus">+ R$0.00</p>
const expenseDisplay = window.document.querySelector('#money-minus'); // <p id="money-minus" class="money minus">- R$0.00</p>
const balanceDisplay = window.document.querySelector('#balance');//<h1 id="balance" class="balance">R$ 0.00</h1>
const form = window.document.querySelector('#form'); //<form id="form"></form>
const inputNameTransaction = window.document.querySelector('#text');
const inputValueTransaction = window.document.querySelector('#amount');
const mensageError = window.document.querySelector('#error');
const closeMensageError =     window.document.getElementsByClassName('close')[0];

const localStoregeTransactions = JSON.parse(localStorage
    .getItem('transactions'));
let transactions = localStorage
    .getItem('transactions') !== null ? localStoregeTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorege();
    init();
}

const addTransantionIntoDOM = transaction => {
    const operator =  transaction.amount < 0 ? '-' : ''; //nunca vi essa sintaxe na vida, pesquisa ai lek. sla é meio que uma forma mais otimizada de usar o if e else
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(transaction.amount); // o Math.abs reseta o numero, suponhamos que voce tenha '-190' se voce colocar Math.abs(-190) = 190, ele tira o operator.
    const li = window.document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
    ${transaction.name} <span>R$ ${operator} ${amountWithoutOperator} </span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
    x   
    </button>
    `
    transactonsUl.append(li);// se caso usar o append a ultima transação ficara em ultimo lugar na ul, o prepend faz o contrario
}

const updatBalanceValues = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount);

    const total = transactionsAmounts
    .reduce((accmulator, transaction) => accmulator + transaction, 0)
    .toFixed(2);

    const income = transactionsAmounts
    .filter(value => value > 0)
    .reduce((accmulator, value) => accmulator + value, 0)
    .toFixed(2);

    const expense = Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accmulator, value) => accmulator + value, 0))
    .toFixed(2);

    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
}

const init = () => {
    transactonsUl.innerHTML = '';
    transactions.forEach(addTransantionIntoDOM);
    updatBalanceValues();
}

init();

const updateLocalStorege = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateId = () => Math.floor(Math.random() * 1000);

const addTotransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateId(),
        name:transactionName,
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () => {
    inputNameTransaction.value = '';
    inputValueTransaction.value = '';
}

const handleFormSubmit = event => {
    event.preventDefault();

    const transactionName = inputNameTransaction.value.trim();
    const transactionAmount = inputValueTransaction.value.trim();
    const isSomeInputEmpty = inputNameTransaction.value.trim() === '' || inputValueTransaction.value.trim() === ''; //faz referencia ao if lá embaixo

    if(isSomeInputEmpty) {
        mensageError.classList.add('show');
        return 
    } 

    addTotransactionsArray(transactionName, transactionAmount);
    init();
    updateLocalStorege();
    cleanInputs();

}

form.addEventListener('submit', handleFormSubmit);

const hideMensageError = () => {
    closeMensageError.addEventListener('click', () => {
        mensageError.classList.remove('show');
    });
}

hideMensageError();
