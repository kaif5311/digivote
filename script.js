const Digivote = {
getUser: () => JSON.parse(localStorage.getItem('vw_user') || 'null'),
setUser: (u) => localStorage.setItem('vw_user', JSON.stringify(u)),
clearUser: () => localStorage.removeItem('vw_user'),
getUsers: () => JSON.parse(localStorage.getItem('vw_users') || '[]'),
saveUsers: (u) => localStorage.setItem('vw_users', JSON.stringify(u)),
getVotes: () => JSON.parse(localStorage.getItem('vw_votes') || '{}'),
saveVotes: (v) => localStorage.setItem('vw_votes', JSON.stringify(v)),
getElections: () => JSON.parse(localStorage.getItem('vw_elections') || 'null'),
saveElections:(e) => localStorage.setItem('vw_elections', JSON.stringify(e)),
getApprovals: () => JSON.parse(localStorage.getItem('vw_approvals') || '{}'),
saveApprovals:(a) => localStorage.setItem('vw_approvals', JSON.stringify(a)),
isResultsApproved: (electionId) => {
const a = Digivote.getApprovals();
return !!a[electionId];
},
approveResults: (electionId) => {
const a = Digivote.getApprovals();
a[electionId] = { approvedAt: new Date().toISOString(), approvedBy: 'admin' };
Digivote.saveApprovals(a);
},
revokeResults: (electionId) => {
const a = Digivote.getApprovals();
delete a[electionId];
Digivote.saveApprovals(a);
},
isAdmin: () => {
const u = Digivote.getUser();
return u && (u.role === 'Administrator' || u.id === 'admin_001');
},
hasVoted: (electionId) => {
const user = Digivote.getUser();
if (!user) return false;
return !!Digivote.getVotes()[`${electionId}_${user.id}`];
},
castVote: (electionId, candidateId) => {
const user = Digivote.getUser();
if (!user) return false;
const votes = Digivote.getVotes();
const key = `${electionId}_${user.id}`;
if (votes[key]) return false;
votes[key] = candidateId;
Digivote.saveVotes(votes);
return true;
},
getVoteCounts: (electionId) => {
const votes = Digivote.getVotes();
const counts = {};
for (const [key, candidateId] of Object.entries(votes)) {
if (key.startsWith(electionId + '_')) {
counts[candidateId] = (counts[candidateId] || 0) + 1;
}
}
return counts;
}
};
const defaultElections = [
{
id: 'election_2025_president',
title: 'Presidential Election 2025',
desc: 'Vote for the next President of the Student Union. Your voice shapes the future of our community.',
status: 'active',
endsAt: '2025-12-31',
totalVoters: 0,
candidates: [
{ id: 'c1', name: 'Alexandra Chen', party: 'Progress Alliance', emoji: '👩‍💼', bio: 'Champion of innovation and digital transformation with 5 years of leadership experience.' },
{ id: 'c2', name: 'Marcus Rivera', party: 'Unity Party', emoji: '👨‍💼', bio: 'Advocate for community welfare and transparent governance with proven track record.' },
{ id: 'c3', name: 'Priya Nair', party: 'Future Forward', emoji: '👩‍🔬', bio: 'Technology-first leader focused on sustainable growth and inclusive policies.' },
{ id: 'c4', name: "James O'Brien", party: 'Heritage Party', emoji: '👨‍⚖️', bio: 'Experienced attorney committed to upholding rights and building trust.' }
]
},
{
id: 'election_2025_council',
title: 'City Council Members',
desc: 'Elect your representatives for the city council term 2025-2027.',
status: 'active',
endsAt: '2025-11-15',
totalVoters: 0,
candidates: [
{ id: 'cc1', name: 'Shantosh Shirke', party: 'Green Future', emoji: '🌿', bio: 'Environmental activist pushing for sustainable urban development.' },
{ id: 'cc2', name: 'Vijay Kothawade', party: 'Tech Forward', emoji: '💻', bio: 'Software engineer advocating for smart city infrastructure.' },
{ id: 'cc3', name: 'Pooja Kale', party: 'Community First', emoji: '🤝', bio: 'Social worker dedicated to affordable housing and public services.' }
]
},
{
id: 'election_2025_budget',
title: 'Community Budget Proposal',
desc: "Vote on how to allocate this year's community development fund.",
status: 'closed',
endsAt: '2025-09-01',
totalVoters: 0,
candidates: [
{ id: 'b1', name: 'Parks & Recreation', party: 'Infrastructure', emoji: '🌳', bio: 'Invest in green spaces, playgrounds, and recreational facilities for all ages.' },
{ id: 'b2', name: 'Education Fund', party: 'Education', emoji: '📚', bio: 'Enhance local schools with tech labs, libraries, and scholarship programs.' },
{ id: 'b3', name: 'Public Safety', party: 'Safety', emoji: '🛡️', bio: 'Upgrade emergency services, streetlights, and community watch programs.' }
]
}
];
function getElections() {
return Digivote.getElections() || defaultElections;
}
function seedAccounts() {
const predefined = [
{ id: 'admin_001', username: 'Admin', email: 'admin@digivote.io', password: 'Admin@2025', avatar: 'A', joinedAt: 'Jan 2025', role: 'Administrator' },
{ id: 'user_001', username: 'Dipesh', email: 'dipesh@digivote.io', password: 'Dipesh@451', avatar: 'D', joinedAt: 'Jan 2025', role: 'Voter' },
{ id: 'user_002', username: 'Rushab', email: 'rushab@digivote.io', password: 'Rushab@2025',avatar: 'R', joinedAt: 'Jan 2025', role: 'Voter' },
{ id: 'user_003', username: 'Mohd Kaif', email: 'kaif@digivote.io', password: 'Faif@786', avatar: 'MK', joinedAt: 'Jan 2025', role: 'Voter' },
];
let users = Digivote.getUsers();
predefined.forEach(p => {
const idx = users.findIndex(u => u.id === p.id);
if (idx >= 0) users[idx] = p; else users.push(p);
});
Digivote.saveUsers(users);
if (!localStorage.getItem('vw_elections')) {
Digivote.saveElections(defaultElections);
}
}
seedAccounts();
function initNavbar() {
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
hamburger.addEventListener('click', () => {
hamburger.classList.toggle('open');
mobileMenu.classList.toggle('open');
});
}
const user = Digivote.getUser();
const isAdmin = Digivote.isAdmin();

// ── Avatar ──
const avatarEl = document.getElementById('nav-avatar');
if (avatarEl) {
avatarEl.textContent = user ? user.username.charAt(0).toUpperCase() : '?';
avatarEl.style.display = user ? 'grid' : 'none';
}

// ── Auth topbar: swap Login/Signup ↔ Logout ──
const authBar = document.getElementById('auth-topbar');
if (authBar) {
const loginA  = document.getElementById('auth-login-btn');
const signupA = document.getElementById('auth-signup-btn');
if (user) {
// Hide login & signup
if (loginA)  loginA.style.display = 'none';
if (signupA) signupA.style.display = 'none';
// Inject logout button once
if (!document.getElementById('auth-logout-btn')) {
const lb = document.createElement('button');
lb.id = 'auth-logout-btn';
lb.className = 'btn btn-danger btn-sm';
lb.innerHTML = '🚪 Logout';
lb.onclick = logout;
authBar.appendChild(lb);
}
authBar.style.display = 'flex';
} else {
if (loginA)  loginA.style.display = '';
if (signupA) signupA.style.display = '';
const existingLb = document.getElementById('auth-logout-btn');
if (existingLb) existingLb.remove();
authBar.style.display = 'flex';
}
}

// ── Hide old inline nav-logout (replaced by auth-topbar) ──
const oldLogout = document.getElementById('nav-logout');
if (oldLogout) oldLogout.style.display = 'none';

// ── Inject Logout tab into nav-links when logged in ──
const navLinks = document.querySelector('.nav-links');
if (navLinks) {
if (user && !document.getElementById('nav-logout-tab')) {
const li = document.createElement('li');
li.innerHTML = '<a href="#" id="nav-logout-tab" onclick="logout();return false;" style="color:var(--accent-3);font-weight:600;">🚪 Logout</a>';
navLinks.appendChild(li);
} else if (!user) {
const existing = document.getElementById('nav-logout-tab');
if (existing) existing.parentElement.remove();
}
}

// ── Inject Logout into mobile menu when logged in ──
const mobileMenuEl = document.getElementById('mobile-menu');
if (mobileMenuEl) {
if (user && !document.getElementById('mobile-logout-tab')) {
const a = document.createElement('a');
a.href = '#'; a.id = 'mobile-logout-tab';
a.textContent = '🚪 Logout';
a.onclick = (e) => { e.preventDefault(); logout(); };
a.style.cssText = 'color:var(--accent-3);font-weight:600;';
mobileMenuEl.appendChild(a);
} else if (!user) {
const existing = document.getElementById('mobile-logout-tab');
if (existing) existing.remove();
}
}

// ── Admin nav link — inject only if not already present ──
if (isAdmin) {
if (navLinks && !document.getElementById('admin-nav-link') && !navLinks.querySelector('a[href="admin.html"]')) {
const li = document.createElement('li');
li.innerHTML = '<a href="admin.html" id="admin-nav-link" style="color:var(--accent-1);font-weight:700;">⚙️ Admin</a>';
// Insert before logout tab
const logoutTab = document.getElementById('nav-logout-tab');
if (logoutTab) navLinks.insertBefore(li, logoutTab.parentElement);
else navLinks.appendChild(li);
}
if (mobileMenuEl && !document.getElementById('admin-mobile-link') && !mobileMenuEl.querySelector('a[href="admin.html"]')) {
const a = document.createElement('a');
a.href = 'admin.html'; a.id = 'admin-mobile-link';
a.textContent = '⚙️ Admin'; a.style.cssText = 'color:var(--accent-1);font-weight:700;';
mobileMenuEl.insertBefore(a, mobileMenuEl.firstChild);
}
}

// ── Active link highlight ──
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
if (a.getAttribute('href') === path) a.classList.add('active');
});
}
function logout() {
Digivote.clearUser();
showToast('Logged out successfully!', 'info');
setTimeout(() => window.location.href = 'index.html', 800);
}
function showToast(message, type = 'info') {
const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
const container = document.getElementById('toast-container');
if (!container) return;
const toast = document.createElement('div');
toast.className = `toast ${type}`;
toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${message}</span>`;
container.appendChild(toast);
setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 3500);
}
function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }
function sanitize(str) { const d = document.createElement('div'); d.appendChild(document.createTextNode(str)); return d.innerHTML; }
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePassword(p) { return p.length >= 6; }
function showFieldError(id, msg) {
const f = document.getElementById(id); const e = document.getElementById(id + '-error');
if (f) f.classList.add('error');
if (e) { e.textContent = msg; e.classList.add('show'); }
}
function clearFieldError(id) {
const f = document.getElementById(id); const e = document.getElementById(id + '-error');
if (f) f.classList.remove('error');
if (e) e.classList.remove('show');
}
function clearAllErrors(fields) { fields.forEach(id => clearFieldError(id)); }
function requireAuth() {
const user = Digivote.getUser();
if (!user) { showToast('Please login to continue', 'warning'); setTimeout(() => window.location.replace('login.html'), 800); return null; }
return user;
}
function requireAdmin() {
const user = requireAuth();
if (!user) return null;
if (!Digivote.isAdmin()) { showToast('Admin access required', 'error'); setTimeout(() => window.location.href = 'dashboard.html', 800); return null; }
return user;
}
function initLogin() {
const alreadyLoggedIn = Digivote.getUser();
if (alreadyLoggedIn) {
window.location.replace(alreadyLoggedIn.role === 'Administrator' ? 'admin.html' : 'dashboard.html');
return;
}
const form = document.getElementById('login-form');
if (!form) return;
document.querySelectorAll('.password-toggle').forEach(btn => {
btn.addEventListener('click', () => {
const input = btn.previousElementSibling;
input.type = input.type === 'password' ? 'text' : 'password';
btn.textContent = input.type === 'password' ? '👁️' : '🙈';
});
});
document.querySelectorAll('[data-demo-email]').forEach(btn => {
btn.addEventListener('click', () => {
document.getElementById('login-email').value = btn.getAttribute('data-demo-email');
document.getElementById('login-password').value = btn.getAttribute('data-demo-pass');
clearAllErrors(['login-email', 'login-password']);
});
});
form.addEventListener('submit', (e) => {
e.preventDefault();
const email = sanitize(document.getElementById('login-email').value.trim());
const password = document.getElementById('login-password').value;
clearAllErrors(['login-email', 'login-password']);
if (!validateEmail(email)) { showFieldError('login-email', 'Enter a valid email'); return; }
if (!password) { showFieldError('login-password', 'Password is required'); return; }
const users = Digivote.getUsers();
const user = users.find(u => u.email === email && u.password === password);
if (!user) { showFieldError('login-password', 'Invalid email or password'); showToast('Login failed — use the quick-fill buttons below', 'error'); return; }
Digivote.setUser(user);
showToast('Welcome back, ' + user.username + '! 👋', 'success');
setTimeout(() => window.location.replace(user.role === 'Administrator' ? 'admin.html' : 'dashboard.html'), 900);
});
}
function initSignup() {
const form = document.getElementById('signup-form');
if (!form) return;
const pwInput = document.getElementById('signup-password');
const strengthBar = document.getElementById('pw-strength');
if (pwInput && strengthBar) {
pwInput.addEventListener('input', () => {
const pw = pwInput.value; let s = 0;
if (pw.length >= 6) s++; if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[^a-zA-Z0-9]/.test(pw)) s++;
const colors = ['','#ff6584','#ffa94d','#6c63ff','#00d4aa'];
const labels = ['','Weak','Fair','Good','Strong'];
strengthBar.style.width = `${s*25}%`; strengthBar.style.background = colors[s];
const lbl = document.getElementById('pw-strength-label');
if (lbl) { lbl.textContent = labels[s]; lbl.style.color = colors[s]; }
});
}
document.querySelectorAll('.password-toggle').forEach(btn => {
btn.addEventListener('click', () => {
const input = btn.previousElementSibling;
input.type = input.type === 'password' ? 'text' : 'password';
btn.textContent = input.type === 'password' ? '👁️' : '🙈';
});
});
form.addEventListener('submit', (e) => {
e.preventDefault();
const username = sanitize(document.getElementById('signup-username').value.trim());
const email = sanitize(document.getElementById('signup-email').value.trim());
const password = document.getElementById('signup-password').value;
const confirm = document.getElementById('signup-confirm').value;
clearAllErrors(['signup-username','signup-email','signup-password','signup-confirm']);
let valid = true;
if (username.length < 3) { showFieldError('signup-username','Username must be at least 3 characters'); valid=false; }
if (!validateEmail(email)) { showFieldError('signup-email','Enter a valid email address'); valid=false; }
if (!validatePassword(password)) { showFieldError('signup-password','Password must be at least 6 characters'); valid=false; }
if (password !== confirm) { showFieldError('signup-confirm','Passwords do not match'); valid=false; }
if (!valid) return;
const users = Digivote.getUsers();
if (users.find(u => u.email === email)) { showFieldError('signup-email','Email already registered'); return; }
const newUser = { id:'user_'+Date.now(), username, email, password, avatar:username.charAt(0).toUpperCase(), joinedAt:new Date().toLocaleDateString(), role:'Voter' };
users.push(newUser); Digivote.saveUsers(users); Digivote.setUser(newUser);
showToast('Account created! Welcome to Digivote 🎉','success');
setTimeout(() => window.location.href='dashboard.html', 1200);
});
}
function initDashboard() {
const user = requireAuth();
if (!user) return;
const elections = getElections();
const greet = document.getElementById('dash-greeting');
const userNameEl = document.getElementById('dash-username');
if (greet) { const h=new Date().getHours(); greet.textContent = h<12?'Good morning':h<18?'Good afternoon':'Good evening'; }
if (userNameEl) userNameEl.textContent = user.username;
const votes = Digivote.getVotes();
const userVotesCount = Object.keys(votes).filter(k=>k.includes(`_${user.id}`)).length;
const activeEl = document.getElementById('dash-active-count');
const votedEl = document.getElementById('dash-voted-count');
if (activeEl) activeEl.textContent = elections.filter(e=>e.status==='active').length;
if (votedEl) votedEl.textContent = userVotesCount;
const listEl = document.getElementById('dash-elections');
if (listEl) {
listEl.innerHTML = '';
elections.filter(e=>e.status==='active').forEach(el => {
const hasVoted = Digivote.hasVoted(el.id);
listEl.innerHTML += `
<div class="election-card">
<div class="election-meta">
<span class="badge ${hasVoted?'badge-success':'badge-primary'} badge-dot">${hasVoted?'Voted':'Active'}</span>
<span class="text-xs text-muted">Ends ${el.endsAt}</span>
</div>
<div class="election-title">${el.title}</div>
<div class="election-desc">${el.desc}</div>
<div class="election-stats mb-4">
<span class="election-stat">🗳️ ${el.candidates.length} candidates</span>
</div>
<div class="flex gap-2">
${!hasVoted ? `<a href="vote.html?id=${el.id}" class="btn btn-primary btn-sm">Cast Vote →</a>` : '<span class="btn btn-success btn-sm" style="pointer-events:none">✓ Vote Submitted</span>'}
${Digivote.isResultsApproved(el.id) || Digivote.isAdmin() ? `<a href="results.html?id=${el.id}" class="btn btn-secondary btn-sm">View Results</a>` : '<span class="btn btn-secondary btn-sm" style="pointer-events:none;opacity:0.5">🔒 Results Pending</span>'}
</div>
</div>`;
});
}
}
function initVotePage() {
const user = requireAuth();
if (!user) return;
const elections = getElections();
const params = new URLSearchParams(window.location.search);
const electionId = params.get('id') || elections[0].id;
const election = elections.find(e=>e.id===electionId) || elections[0];
const titleEl = document.getElementById('vote-title');
const descEl = document.getElementById('vote-desc');
const deadlineEl = document.getElementById('vote-deadline');
if (titleEl) titleEl.textContent = election.title;
if (descEl) descEl.textContent = election.desc;
if (deadlineEl) deadlineEl.textContent = `Voting ends: ${election.endsAt}`;
const hasVoted = Digivote.hasVoted(election.id);
const alreadyBanner = document.getElementById('already-voted-banner');
if (hasVoted && alreadyBanner) alreadyBanner.classList.remove('hidden');
let selectedCandidate = null;
const container = document.getElementById('candidates-container');
if (!container) return;
container.innerHTML = '';
election.candidates.forEach(c => {
const card = document.createElement('div');
card.className = `candidate-card${hasVoted?' voted':''}`;
card.innerHTML = `
<div class="candidate-avatar">${c.emoji}</div>
<div class="candidate-name">${c.name}</div>
<div class="candidate-party">${c.party}</div>
<div class="candidate-bio">${c.bio}</div>
<div class="candidate-footer">
<button class="btn btn-primary btn-full btn-sm vote-btn" data-id="${c.id}" data-name="${c.name}" ${hasVoted?'disabled':''}>
${hasVoted ? '✓ Vote Submitted' : '🗳️ Vote for '+c.name.split(' ')[0]}
</button>
</div>`;
if (!hasVoted) {
card.querySelector('.vote-btn').addEventListener('click', () => {
selectedCandidate = { id:c.id, name:c.name, emoji:c.emoji };
const cn = document.getElementById('modal-candidate-name');
const ce = document.getElementById('modal-candidate-emoji');
if (cn) cn.textContent = c.name;
if (ce) ce.textContent = c.emoji;
openModal('confirm-modal');
});
}
container.appendChild(card);
});
const confirmBtn = document.getElementById('confirm-vote-btn');
if (confirmBtn) {
confirmBtn.addEventListener('click', () => {
if (!selectedCandidate) return;
const success = Digivote.castVote(election.id, selectedCandidate.id);
closeModal('confirm-modal');
if (success) { showToast(`Vote cast for ${selectedCandidate.name}! ✅`,'success'); setTimeout(()=>window.location.reload(),1200); }
else showToast('You have already voted in this election.','warning');
});
}
const sel = document.getElementById('election-selector-vote');
if (sel) {
sel.innerHTML = elections.map(e=>`<option value="${e.id}" ${e.id===electionId?'selected':''}>${e.title}</option>`).join('');
}
const othersEl = document.getElementById('other-elections-list');
if (othersEl) {
othersEl.innerHTML = elections.filter(e=>e.id!==electionId).map(e=>`
<div class="election-card">
<div class="election-meta">
<span class="badge ${e.status==='active'?'badge-success badge-dot':'badge-primary'}">${e.status==='active'?'Active':'Closed'}</span>
<span class="text-xs text-muted">${e.endsAt}</span>
</div>
<div class="election-title">${e.title}</div>
<div class="election-desc">${e.desc}</div>
<div class="flex gap-2 mt-3">
${e.status==='active'?`<a href="vote.html?id=${e.id}" class="btn btn-primary btn-sm">Vote →</a>`:''}
${Digivote.isResultsApproved(e.id)||Digivote.isAdmin()?`<a href="results.html?id=${e.id}" class="btn btn-secondary btn-sm">Results</a>`:'<span class="btn btn-secondary btn-sm" style="pointer-events:none;opacity:0.5">🔒 Pending</span>'}
</div>
</div>`).join('');
}
}
function initResultsPage() {
const elections = getElections();
const params = new URLSearchParams(window.location.search);
const electionId = params.get('id') || elections[0].id;
const election = elections.find(e=>e.id===electionId) || elections[0];
const user = Digivote.getUser();
const isAdmin = Digivote.isAdmin();
const isApproved = Digivote.isResultsApproved(electionId);
if (!isAdmin && !isApproved) {
const mainArea = document.querySelector('.container');
if (mainArea) {
mainArea.innerHTML = `
<div style="text-align:center;padding:80px 20px;">
<div style="font-size:4rem;margin-bottom:20px;">🔒</div>
<h2 style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.8rem;margin-bottom:12px;">Results Not Yet Available</h2>
<p class="text-secondary" style="margin-bottom:28px;max-width:400px;margin-left:auto;margin-right:auto;">The admin has not approved the results for this election yet. Please check back later.</p>
<a href="dashboard.html" class="btn btn-primary">← Back to Dashboard</a>
</div>`;
}
return;
}
const titleEl = document.getElementById('results-title');
const statusEl = document.getElementById('results-status');
if (titleEl) titleEl.textContent = election.title;
if (statusEl) { statusEl.textContent = election.status==='active'?'Live Results':'Final Results'; statusEl.className=`badge ${election.status==='active'?'badge-success badge-dot':'badge-primary'}`; }
const counts = Digivote.getVoteCounts(election.id);
const total = Object.values(counts).reduce((a,b)=>a+b,0);
let winnerCandidate=null, maxVotes=0;
for (const [cid,v] of Object.entries(counts)) { if (v>maxVotes) { maxVotes=v; winnerCandidate=election.candidates.find(c=>c.id===cid); } }
const winnerEl = document.getElementById('winner-section');
if (winnerEl && winnerCandidate) {
winnerEl.innerHTML = `
<div class="winner-banner">
<div class="winner-crown">🏆</div>
<div>
<div class="winner-label">Leading Candidate</div>
<div class="winner-name">${winnerCandidate.emoji} ${winnerCandidate.name}</div>
<div class="winner-votes">${winnerCandidate.party} · ${maxVotes} votes · ${total>0?Math.round(maxVotes/total*100):0}%</div>
</div>
</div>`;
}
const barsEl = document.getElementById('results-bars');
if (barsEl) {
barsEl.innerHTML = '';
const sorted = [...election.candidates].sort((a,b)=>(counts[b.id]||0)-(counts[a.id]||0));
sorted.forEach((c,i)=>{
const v=counts[c.id]||0; const pct=total>0?Math.round(v/total*100):0; const isLeading=i===0&&v>0;
barsEl.innerHTML+=`
<div class="result-bar-wrap">
<div class="result-bar-header">
<div class="flex items-center gap-2">
<span style="font-size:1.3rem">${c.emoji}</span>
<div><div class="result-bar-name">${c.name}</div><div class="result-bar-count">${c.party}</div></div>
${isLeading?'<span class="badge badge-success" style="margin-left:8px">🏅 Leading</span>':''}
</div>
<div style="text-align:right"><div class="result-bar-pct">${pct}%</div><div class="result-bar-count">${v} votes</div></div>
</div>
<div class="progress lg"><div class="progress-bar ${isLeading?'leading':''}" style="width:0%" data-width="${pct}%"></div></div>
</div>`;
});
}
setTimeout(()=>{ document.querySelectorAll('.progress-bar[data-width]').forEach(b=>{ b.style.width=b.getAttribute('data-width'); }); },200);
const totalEl = document.getElementById('total-votes');
if (totalEl) totalEl.textContent = total.toLocaleString();
const selectorEl = document.getElementById('election-selector');
if (selectorEl) {
selectorEl.innerHTML = elections.map(e=>`<option value="${e.id}" ${e.id===electionId?'selected':''}>${e.title}</option>`).join('');
selectorEl.addEventListener('change',()=>{ window.location.href=`results.html?id=${selectorEl.value}`; });
}
const listEl = document.getElementById('all-elections-list');
if (listEl) {
listEl.innerHTML = elections.map(e=>`
<a href="results.html?id=${e.id}" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:${e.id===electionId?'rgba(236,72,153,0.1)':'transparent'};border:1px solid ${e.id===electionId?'rgba(236,72,153,0.25)':'transparent'};transition:var(--transition);">
<span class="text-sm" style="font-weight:500;">${e.title}</span>
<span class="badge ${e.status==='active'?'badge-success':'badge-primary'}" style="font-size:0.65rem;">${e.status}</span>
</a>`).join('');
}
}
function initProfile() {
const user = requireAuth();
if (!user) return;
const elections = getElections();
const nameEl = document.getElementById('profile-name');
const emailEl = document.getElementById('profile-email');
const avatarEl = document.getElementById('profile-avatar');
const joinedEl = document.getElementById('profile-joined');
const roleEl = document.getElementById('profile-role');
if (nameEl) nameEl.textContent = user.username;
if (emailEl) emailEl.textContent = user.email;
if (avatarEl) avatarEl.textContent = user.avatar || user.username.charAt(0).toUpperCase();
if (joinedEl) joinedEl.textContent = user.joinedAt || 'Recently';
if (roleEl) roleEl.textContent = user.role || 'Voter';
const votes = Digivote.getVotes();
const historyEl = document.getElementById('vote-history');
if (historyEl) {
const userVotes = Object.entries(votes).filter(([k])=>k.includes(`_${user.id}`));
if (userVotes.length===0) {
historyEl.innerHTML='<div class="empty-state"><div class="empty-icon">🗳️</div><div class="empty-title">No Votes Yet</div><div class="empty-desc">Your vote history will appear here.</div></div>';
} else {
historyEl.innerHTML=userVotes.map(([key,candidateId])=>{
const elId=key.replace(`_${user.id}`,'');
const el=elections.find(e=>e.id===elId);
const candidate=el?.candidates.find(c=>c.id===candidateId);
return `<div class="activity-item">
<div class="activity-dot success"></div>
<div class="activity-content">
<div class="activity-title">Voted for ${candidate?.emoji||''} ${candidate?.name||'Unknown'}</div>
<div class="activity-time">${el?.title||elId}</div>
</div>
<span class="badge badge-success">✓ Counted</span>
</div>`;
}).join('');
}
}
const editForm = document.getElementById('edit-profile-form');
if (editForm) {
const uInput=document.getElementById('edit-username'); const eInput=document.getElementById('edit-email');
if (uInput) uInput.value=user.username; if (eInput) eInput.value=user.email;
editForm.addEventListener('submit',(e)=>{
e.preventDefault();
const newUsername=sanitize(uInput.value.trim()); const newEmail=sanitize(eInput.value.trim());
if (!newUsername||!validateEmail(newEmail)) { showToast('Please fill in all fields correctly','error'); return; }
const updated={...user,username:newUsername,email:newEmail,avatar:newUsername.charAt(0).toUpperCase()};
Digivote.setUser(updated);
const users=Digivote.getUsers(); const idx=users.findIndex(u=>u.id===user.id);
if (idx>=0) { users[idx]=updated; Digivote.saveUsers(users); }
showToast('Profile updated!','success'); setTimeout(()=>window.location.reload(),1000);
});
}
}
function initAdminPage() {
const user = requireAdmin();
if (!user) return;
renderAdminPage();
}
function renderAdminPage() {
const elections = getElections();
const users = Digivote.getUsers();
const votes = Digivote.getVotes();
const ucEl=document.getElementById('admin-users-count'); if(ucEl) ucEl.setAttribute('data-count', users.length);
const vcEl=document.getElementById('admin-votes-count'); if(vcEl) vcEl.setAttribute('data-count', Object.keys(votes).length);
const teEl=document.getElementById('admin-total-elections'); if(teEl) teEl.textContent=elections.length;
const aeEl=document.getElementById('admin-active-elections'); if(aeEl) aeEl.textContent=elections.filter(e=>e.status==='active').length;
const elEl=document.getElementById('admin-elections-list');
if (elEl) {
elEl.innerHTML = elections.map(e=>`
<div style="padding:14px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
<div>
<div class="text-sm font-bold">${e.title}</div>
<div class="text-xs text-muted">Ends ${e.endsAt} · ${e.candidates.length} candidates</div>
</div>
<span class="badge ${e.status==='active'?'badge-success badge-dot':'badge-primary'}">${e.status}</span>
</div>
<div style="display:flex;gap:6px;flex-wrap:wrap;">
<button class="btn btn-secondary btn-sm" style="font-size:0.72rem;padding:4px 10px;" onclick="editElection('${e.id}')">✏️ Edit</button>
<button class="btn btn-secondary btn-sm" style="font-size:0.72rem;padding:4px 10px;" onclick="editCandidates('${e.id}')">👥 Members</button>
<button class="btn btn-${e.status==='active'?'warning':'success'} btn-sm" style="font-size:0.72rem;padding:4px 10px;background:${e.status==='active'?'rgba(255,169,77,0.2)':'rgba(0,212,170,0.15)'};color:${e.status==='active'?'#b07800':'#00a080'};border:1px solid ${e.status==='active'?'rgba(255,169,77,0.4)':'rgba(0,212,170,0.3)'};" onclick="toggleElectionStatus('${e.id}')">${e.status==='active'?'⏸ Close':'▶ Activate'}</button>
<button class="btn btn-sm" style="font-size:0.72rem;padding:4px 10px;background:${Digivote.isResultsApproved(e.id)?'rgba(0,212,170,0.15)':'rgba(236,72,153,0.1)'};color:${Digivote.isResultsApproved(e.id)?'#00a080':'#9d174d'};border:1px solid ${Digivote.isResultsApproved(e.id)?'rgba(0,212,170,0.3)':'rgba(236,72,153,0.25)'};" onclick="toggleResultsApproval('${e.id}')">${Digivote.isResultsApproved(e.id)?'🔓 Revoke Results':'🔐 Approve Results'}</button>
<button class="btn btn-sm" style="font-size:0.72rem;padding:4px 10px;background:rgba(157,23,77,0.12);color:#9d174d;border:1px solid rgba(157,23,77,0.25);" onclick="deleteElection('${e.id}')">🗑️ Delete</button>
</div>
</div>`).join('');
}
const ulEl=document.getElementById('admin-users-list');
if (ulEl) {
const nonAdmin = users.filter(u=>u.role!=='Administrator');
if (nonAdmin.length===0) {
ulEl.innerHTML='<div class="text-secondary text-sm" style="padding:10px;">No registered users yet.</div>';
} else {
ulEl.innerHTML=nonAdmin.map(u=>`
<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;">
<div class="flex items-center gap-2">
<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent-1),var(--accent-3));display:grid;place-items:center;font-size:0.75rem;font-weight:700;">${u.avatar||u.username.charAt(0)}</div>
<div>
<div class="text-sm font-bold">${u.username}</div>
<div class="text-xs text-muted">${u.email}</div>
</div>
</div>
<div class="flex gap-2 items-center">
<span class="badge badge-success badge-dot" style="font-size:0.65rem;">Active</span>
<button class="btn btn-sm" style="font-size:0.68rem;padding:3px 8px;background:rgba(157,23,77,0.12);color:#9d174d;border:1px solid rgba(157,23,77,0.25);" onclick="removeUser('${u.id}')">✕</button>
</div>
</div>`).join('');
}
}
const talliesEl=document.getElementById('admin-tallies');
if (talliesEl) {
talliesEl.innerHTML=elections.map(e=>{
const counts=Digivote.getVoteCounts(e.id);
const total=Object.values(counts).reduce((a,b)=>a+b,0);
return `
<div style="margin-bottom:20px;">
<div class="flex items-center justify-between mb-2">
<div style="font-weight:600;">${e.title}</div>
<div class="flex items-center gap-2">
<span class="text-xs text-muted">${total} votes</span>
${Digivote.isResultsApproved(e.id)?'<span class="badge badge-success" style="font-size:0.65rem;">🔓 Public</span>':'<span class="badge badge-danger" style="font-size:0.65rem;">🔒 Private</span>'}
</div>
</div>
${e.candidates.map(c=>{
const v=counts[c.id]||0; const pct=total>0?Math.round(v/total*100):0;
return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
<span style="font-size:1.2rem;">${c.emoji}</span>
<span style="font-size:0.82rem;min-width:120px;font-weight:500;">${c.name}</span>
<div class="progress" style="flex:1;height:6px;"><div class="progress-bar" style="width:${pct}%"></div></div>
<span style="font-size:0.78rem;color:var(--text-secondary);min-width:50px;text-align:right;">${v} (${pct}%)</span>
</div>`;
}).join('')}
</div>`;
}).join('<div class="divider"></div>');
}
}
function toggleElectionStatus(id) {
const elections = getElections();
const e = elections.find(e=>e.id===id);
if (!e) return;
e.status = e.status==='active' ? 'closed' : 'active';
Digivote.saveElections(elections);
showToast(`Election ${e.status==='active'?'activated':'closed'}!`, 'success');
renderAdminPage();
}
function toggleResultsApproval(id) {
if (Digivote.isResultsApproved(id)) {
Digivote.revokeResults(id);
showToast('Results access revoked — users can no longer view results.', 'warning');
} else {
Digivote.approveResults(id);
showToast('Results approved — users can now view results! 🔓', 'success');
}
renderAdminPage();
}
function deleteElection(id) {
if (!confirm('Delete this election and all its votes? This cannot be undone.')) return;
let elections = getElections();
elections = elections.filter(e=>e.id!==id);
Digivote.saveElections(elections);
const votes = Digivote.getVotes();
for (const key of Object.keys(votes)) { if (key.startsWith(id+'_')) delete votes[key]; }
Digivote.saveVotes(votes);
Digivote.revokeResults(id);
showToast('Election deleted.', 'info');
renderAdminPage();
}
function editElection(id) {
const elections = getElections();
const e = elections.find(e=>e.id===id);
if (!e) return;
const formEl = document.getElementById('edit-election-form');
if (!formEl) return;
formEl.classList.remove('hidden');
document.getElementById('edit-election-id').value = e.id;
document.getElementById('edit-election-title').value = e.title;
document.getElementById('edit-election-desc').value = e.desc;
document.getElementById('edit-election-ends').value = e.endsAt;
document.getElementById('edit-election-status').value = e.status;
formEl.scrollIntoView({ behavior:'smooth', block:'center' });
}
function saveEditElection() {
const id = document.getElementById('edit-election-id').value;
const title = document.getElementById('edit-election-title').value.trim();
const desc = document.getElementById('edit-election-desc').value.trim();
const ends = document.getElementById('edit-election-ends').value;
const status= document.getElementById('edit-election-status').value;
if (!title||!desc||!ends) { showToast('Please fill in all fields','warning'); return; }
const elections = getElections();
const idx = elections.findIndex(e=>e.id===id);
if (idx<0) return;
elections[idx] = { ...elections[idx], title, desc, endsAt:ends, status };
Digivote.saveElections(elections);
showToast('Election updated!','success');
document.getElementById('edit-election-form').classList.add('hidden');
renderAdminPage();
}
function editCandidates(id) {
const elections = getElections();
const e = elections.find(e=>e.id===id);
if (!e) return;
const formEl = document.getElementById('edit-candidates-form');
if (!formEl) return;
formEl.classList.remove('hidden');
document.getElementById('edit-candidates-election-id').value = e.id;
document.getElementById('edit-candidates-title').textContent = e.title;
renderCandidateEditor(e);
formEl.scrollIntoView({ behavior:'smooth', block:'center' });
}
function renderCandidateEditor(e) {
const list = document.getElementById('candidates-editor-list');
if (!list) return;
list.innerHTML = e.candidates.map((c,i)=>`
<div style="display:grid;grid-template-columns:60px 1fr 1fr 1fr 36px;gap:8px;align-items:center;padding:10px;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;margin-bottom:8px;">
<input type="text" value="${c.emoji}" class="form-control" style="font-size:1.4rem;text-align:center;padding:6px;" id="c-emoji-${i}"/>
<input type="text" value="${c.name}" class="form-control" style="font-size:0.82rem;padding:8px;" placeholder="Name" id="c-name-${i}"/>
<input type="text" value="${c.party}" class="form-control" style="font-size:0.82rem;padding:8px;" placeholder="Party" id="c-party-${i}"/>
<input type="text" value="${c.bio}" class="form-control" style="font-size:0.82rem;padding:8px;" placeholder="Bio" id="c-bio-${i}"/>
<button class="btn btn-sm" style="padding:6px;background:rgba(157,23,77,0.12);color:#9d174d;border:1px solid rgba(157,23,77,0.25);min-width:32px;" onclick="removeCandidate('${e.id}',${i})">✕</button>
</div>`).join('');
}
function removeCandidate(electionId, idx) {
const elections = getElections();
const e = elections.find(e=>e.id===electionId);
if (!e || e.candidates.length<=1) { showToast('Must have at least 1 candidate','warning'); return; }
e.candidates.splice(idx,1);
Digivote.saveElections(elections);
renderCandidateEditor(e);
showToast('Candidate removed','info');
}
function saveCandidates() {
const id = document.getElementById('edit-candidates-election-id').value;
const elections = getElections();
const e = elections.find(e=>e.id===id);
if (!e) return;
const updated = [];
let i=0;
while (document.getElementById(`c-name-${i}`)) {
const name = document.getElementById(`c-name-${i}`).value.trim();
const party = document.getElementById(`c-party-${i}`).value.trim();
const bio = document.getElementById(`c-bio-${i}`).value.trim();
const emoji = document.getElementById(`c-emoji-${i}`).value.trim();
if (name) updated.push({ id: e.candidates[i]?.id || 'c_'+Date.now()+'_'+i, name, party, bio, emoji: emoji||'👤' });
i++;
}
if (updated.length===0) { showToast('Must have at least 1 candidate','warning'); return; }
e.candidates = updated;
Digivote.saveElections(elections);
showToast('Council members updated!','success');
document.getElementById('edit-candidates-form').classList.add('hidden');
renderAdminPage();
}
function addNewCandidate() {
const id = document.getElementById('edit-candidates-election-id').value;
const elections = getElections();
const e = elections.find(e=>e.id===id);
if (!e) return;
e.candidates.push({ id:'c_'+Date.now(), name:'New Candidate', party:'Party', emoji:'👤', bio:'Bio description.' });
Digivote.saveElections(elections);
renderCandidateEditor(e);
}
function saveNewElection() {
const title = document.getElementById('new-election-title').value.trim();
const desc = document.getElementById('new-election-desc').value.trim();
const ends = document.getElementById('new-election-ends').value;
if (!title||!desc||!ends) { showToast('Please fill in all fields','warning'); return; }
const elections = getElections();
const newEl = {
id: 'election_'+Date.now(),
title, desc, status:'active', endsAt:ends, totalVoters:0,
candidates:[
{ id:'nc1', name:'Candidate 1', party:'Party A', emoji:'👤', bio:'Add bio here.' },
{ id:'nc2', name:'Candidate 2', party:'Party B', emoji:'👤', bio:'Add bio here.' }
]
};
elections.push(newEl);
Digivote.saveElections(elections);
showToast('New election created! ✅','success');
document.getElementById('add-election-form').classList.add('hidden');
document.getElementById('new-election-title').value='';
document.getElementById('new-election-desc').value='';
document.getElementById('new-election-ends').value='';
renderAdminPage();
}
function removeUser(userId) {
if (!confirm('Remove this user? This cannot be undone.')) return;
const users = Digivote.getUsers().filter(u=>u.id!==userId);
Digivote.saveUsers(users);
const votes = Digivote.getVotes();
for (const key of Object.keys(votes)) { if (key.endsWith('_'+userId)) delete votes[key]; }
Digivote.saveVotes(votes);
showToast('User removed.','info');
renderAdminPage();
}
function clearAllData() {
if (!confirm('Reset ALL voting data? This cannot be undone.')) return;
localStorage.removeItem('vw_votes');
Digivote.saveApprovals({});
showToast('All voting data cleared!','info');
setTimeout(()=>window.location.reload(),900);
}
function showAddElectionForm() {
document.getElementById('add-election-form').classList.remove('hidden');
document.getElementById('add-election-form').scrollIntoView({behavior:'smooth',block:'center'});
}
function initTabs() {
document.querySelectorAll('.tabs').forEach(tabGroup=>{
tabGroup.querySelectorAll('.tab-btn').forEach(btn=>{
btn.addEventListener('click',()=>{
const target=btn.getAttribute('data-tab');
tabGroup.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
const panels=tabGroup.nextElementSibling;
if (panels) panels.querySelectorAll('.tab-panel').forEach(p=>{ p.classList.toggle('active',p.id===target); });
});
});
});
}
function animateCounters() {
document.querySelectorAll('[data-count]').forEach(el=>{
const target=parseInt(el.getAttribute('data-count'));
let current=0; const step=Math.ceil(target/60);
const timer=setInterval(()=>{ current=Math.min(current+step,target); el.textContent=current.toLocaleString(); if(current>=target) clearInterval(timer); },20);
});
}
document.addEventListener('DOMContentLoaded',()=>{
initNavbar(); initTabs();
const page=window.location.pathname.split('/').pop()||'index.html';
if (page==='signup.html') initSignup();
else if (page==='login.html') initLogin();
else if (page==='dashboard.html') initDashboard();
else if (page==='vote.html') initVotePage();
else if (page==='results.html') initResultsPage();
else if (page==='profile.html') initProfile();
else if (page==='admin.html') initAdminPage();
document.body.classList.add('page-transition');
setTimeout(animateCounters,300);
document.querySelectorAll('.modal-overlay').forEach(overlay=>{
overlay.addEventListener('click',(e)=>{ if(e.target===overlay) overlay.classList.remove('open'); });
});
document.querySelectorAll('.password-toggle').forEach(btn=>{ btn.textContent='👁️'; });
});