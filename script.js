const walletForm = document.getElementById('wallet-form');
const walletAddressInput = document.getElementById('wallet-address');
const walletNote = document.getElementById('wallet-note');
const walletBalance = document.getElementById('wallet-balance');
const txCount = document.getElementById('tx-count');
const receiveCount = document.getElementById('receive-count');
const sendCount = document.getElementById('send-count');
const filterType = document.getElementById('filter-type');
const transactionList = document.getElementById('transaction-list');
const emptyState = document.getElementById('empty-state');
const summaryBox = document.getElementById('summary-box');

let currentData = null;

function randomHex(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function shortenWallet(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function generateMockData(address) {
  const types = ['receive', 'send', 'contract', 'receive', 'send'];
  const labels = {
    receive: 'Nhận',
    send: 'Gửi',
    contract: 'Hợp đồng',
  };

  const transactions = Array.from({ length: 6 }, (_, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = (Math.random() * 1.8 + 0.05).toFixed(4);
    return {
      id: crypto.randomUUID(),
      hash: `0x${randomHex(16)}`,
      type,
      label: labels[type],
      amount,
      time: new Date(Date.now() - index * 3600 * 1000).toLocaleString('vi-VN'),
      from: type === 'receive' ? `0x${randomHex(8)}...${randomHex(4)}` : shortenWallet(address),
      to: type === 'send' ? `0x${randomHex(8)}...${randomHex(4)}` : type === 'contract' ? 'Smart Contract' : shortenWallet(address),
    };
  });

  const receive = transactions.filter((item) => item.type === 'receive').length;
  const send = transactions.filter((item) => item.type === 'send').length;

  return {
    address,
    balance: (Math.random() * 4 + 0.3).toFixed(4),
    transactions,
    receive,
    send,
  };
}

function renderSummary(data) {
  summaryBox.innerHTML = `
    <div class="summary-row">
      <strong>Địa chỉ ví</strong>
      <span>${data.address}</span>
    </div>
    <div class="summary-row">
      <strong>Giao dịch gần nhất</strong>
      <span>${data.transactions[0]?.time || 'Chưa có dữ liệu'}</span>
    </div>
    <div class="summary-row">
      <strong>Hash gần nhất</strong>
      <span>${data.transactions[0]?.hash || 'Chưa có dữ liệu'}</span>
    </div>
  `;
}

function renderTransactions() {
  transactionList.innerHTML = '';

  if (!currentData) {
    emptyState.hidden = false;
    return;
  }

  const selectedType = filterType.value;
  const filtered = selectedType === 'all'
    ? currentData.transactions
    : currentData.transactions.filter((item) => item.type === selectedType);

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  filtered.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'transaction-item';
    li.innerHTML = `
      <div class="transaction-main">
        <strong>${item.hash}</strong>
        <span>Từ: ${item.from}</span><br />
        <span>Đến: ${item.to}</span>
        <div class="badge ${item.type}">${item.label}</div>
      </div>
      <div class="transaction-meta">
        <strong>${item.amount} ETH</strong>
        <span>${item.time}</span>
      </div>
    `;
    transactionList.appendChild(li);
  });
}

function renderDashboard(data) {
  walletBalance.textContent = `${data.balance} ETH`;
  txCount.textContent = String(data.transactions.length);
  receiveCount.textContent = String(data.receive);
  sendCount.textContent = String(data.send);
  walletNote.textContent = `Đang theo dõi ví: ${shortenWallet(data.address)}`;
  renderSummary(data);
  renderTransactions();
}

walletForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const address = walletAddressInput.value.trim();
  if (!address) {
    return;
  }

  currentData = generateMockData(address);
  renderDashboard(currentData);
});

filterType.addEventListener('change', () => {
  renderTransactions();
});
