import { useMemo, useState, type FormEvent } from 'react';
import { LayoutDashboard, Users, ClipboardList, Settings, Search, Plus, Bell, ChevronDown, X, Mail, Building2, CheckCircle2, Clock3, ArrowUpRight, Trash2 } from 'lucide-react';

type Status = '対応中' | '商談中' | '契約済み';
type Customer = { id: number; name: string; company: string; email: string; status: Status; updated: string; initials: string; color: string };
const initialCustomers: Customer[] = [
  { id: 1, name: '田中 太郎', company: '株式会社サンプル', email: 'tanaka@example.com', status: '契約済み', updated: '2026/11/10', initials: '田中', color: 'violet' },
  { id: 2, name: '佐藤 花子', company: 'テックソリューション株式会社', email: 'sato@example.com', status: '商談中', updated: '2026/11/09', initials: '佐藤', color: 'blue' },
  { id: 3, name: '鈴木 一郎', company: 'ABC商事', email: 'suzuki@example.com', status: '対応中', updated: '2026/11/08', initials: '鈴木', color: 'orange' },
  { id: 4, name: '高橋 美咲', company: 'ネクストデザイン', email: 'takahashi@example.com', status: '契約済み', updated: '2026/11/06', initials: '高橋', color: 'green' },
  { id: 5, name: '山本 健太', company: 'グローバルシステムズ', email: 'yamamoto@example.com', status: '商談中', updated: '2026/11/05', initials: '山本', color: 'pink' },
];
const statusOptions: Array<'すべて' | Status> = ['すべて', '対応中', '商談中', '契約済み'];
export default function App() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'すべて' | Status>('すべて');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [newStatus, setNewStatus] = useState<Status>('対応中');
  const [toast, setToast] = useState('');
  const [activeMenu, setActiveMenu] = useState('顧客管理');
  const visible = useMemo(() => customers.filter((c) => {
    const q = search.toLocaleLowerCase().trim();
    return (status === 'すべて' || status === c.status) && (!q || [c.name, c.company, c.email].some((v) => v.toLocaleLowerCase().includes(q)));
  }), [customers, search, status]);
  const count = (s: Status) => customers.filter((c) => c.status === s).length;
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  function addCustomer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !email.trim()) return;
    const next: Customer = { id: Date.now(), name: name.trim(), company: company.trim(), email: email.trim(), status: newStatus, updated: new Date().toLocaleDateString('ja-JP'), initials: name.trim().slice(0, 2), color: 'blue' };
    setCustomers((prev) => [next, ...prev]);
    setModalOpen(false); setName(''); setCompany(''); setEmail(''); setNewStatus('対応中'); setStatus('すべて'); setSearch('');
    showToast('顧客を登録しました');
  }
  function removeCustomer(id: number) {
    setCustomers((prev) => prev.filter((c) => c.id !== id)); setSelected(null); showToast('顧客を削除しました');
  }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon">C</div><span>ClientFlow<span className="brand-dot">.</span></span></div>
      <div className="section-label">ワークスペース</div>
      <nav className="nav">
        {[{ label: 'ダッシュボード', icon: LayoutDashboard }, { label: '顧客管理', icon: Users }, { label: 'タスク管理', icon: ClipboardList }, { label: '設定', icon: Settings }].map(({ label, icon: Icon }) => <button className={`nav-item ${activeMenu === label ? 'active' : ''}`} key={label} onClick={() => { setActiveMenu(label); if (label !== '顧客管理') showToast(`${label}はデモ画面です。顧客管理をご利用ください。`); }}><Icon size={18}/>{label}{label === '顧客管理' && <span className="nav-count">{customers.length}</span>}</button>)}
      </nav>
      <div className="side-bottom"><div className="profile-avatar">管</div><div><strong>管理者ユーザー</strong><small>admin@example.com</small></div><ChevronDown size={16}/></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumbs">ワークスペース <span>/</span> <strong>顧客管理</strong></div><div className="top-actions"><span className="today">React + TypeScript デモ</span><button className="icon-button" aria-label="通知" onClick={() => showToast('新しい通知はありません')}><Bell size={19}/></button><span className="top-avatar">管</span></div></header>
      <div className="content">
        <div className="page-head"><div><div className="eyebrow">CUSTOMER MANAGEMENT</div><h1>顧客管理</h1><p>顧客情報とステータスをひとつの画面で管理できます。</p></div><button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={18}/> 新規顧客を登録</button></div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-heading"><span>登録顧客数</span><span className="stat-icon purple"><Users size={19}/></span></div><div className="stat-value">{customers.length}<span>件</span></div><small>登録済みのすべての顧客</small></div>
          <div className="stat-card"><div className="stat-heading"><span>対応中</span><span className="stat-icon amber"><Clock3 size={19}/></span></div><div className="stat-value">{count('対応中')}<span>件</span></div><small>フォローアップが必要</small></div>
          <div className="stat-card"><div className="stat-heading"><span>商談中</span><span className="stat-icon blue"><ArrowUpRight size={19}/></span></div><div className="stat-value">{count('商談中')}<span>件</span></div><small>進行中の商談</small></div>
          <div className="stat-card"><div className="stat-heading"><span>契約済み</span><span className="stat-icon green"><CheckCircle2 size={19}/></span></div><div className="stat-value">{count('契約済み')}<span>件</span></div><small>契約完了の顧客</small></div>
        </div>
        <section className="table-panel"><div className="panel-heading"><div><h2>顧客一覧</h2><p>顧客情報の検索とステータスによる絞り込みができます。</p></div><span className="result-count">{visible.length} 件表示</span></div>
          <div className="filters"><div className="search-field"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="名前・会社名・メールアドレスで検索" aria-label="顧客検索" /></div><select value={status} onChange={(e) => setStatus(e.target.value as 'すべて' | Status)} aria-label="ステータスで絞り込み">{statusOptions.map((s) => <option key={s} value={s}>{s === 'すべて' ? 'すべてのステータス' : s}</option>)}</select></div>
          <div className="table-wrap"><table><thead><tr><th>顧客名</th><th>会社名</th><th>ステータス</th><th>更新日</th><th></th></tr></thead><tbody>{visible.map((c) => <tr key={c.id}><td><div className="person"><span className={`initials ${c.color}`}>{c.initials}</span><div><strong>{c.name}</strong><small>{c.email}</small></div></div></td><td>{c.company}</td><td><span className={`status-badge ${c.status === '契約済み' ? 'contracted' : c.status === '商談中' ? 'negotiating' : 'pending'}`}><span className="status-dot"/>{c.status}</span></td><td className="date-cell">{c.updated}</td><td><button className="detail-button" onClick={() => setSelected(c)}>詳細を見る <span>›</span></button></td></tr>)}</tbody></table>{visible.length === 0 && <div className="empty">該当する顧客がいません。検索条件を変更してください。</div>}</div><div className="panel-footer">全 {customers.length} 件の顧客データ <span>※ サンプルデータはブラウザ内でのみ管理されます</span></div>
        </section><div className="footer-note">Built with React, TypeScript & Vite</div>
      </div>
    </main>
    {modalOpen && <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}><div className="dialog" role="dialog" aria-modal="true" aria-label="新規顧客の登録"><div className="dialog-head"><div><h2>新規顧客を登録</h2><p>顧客情報を入力してください。</p></div><button className="icon-button" aria-label="閉じる" onClick={() => setModalOpen(false)}><X size={20}/></button></div><form onSubmit={addCustomer}><label>顧客名 <span>*</span><div className="field-icon"><Users size={17}/><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="例：田中 太郎"/></div></label><label>会社名 <span>*</span><div className="field-icon"><Building2 size={17}/><input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="例：株式会社サンプル"/></div></label><label>メールアドレス <span>*</span><div className="field-icon"><Mail size={17}/><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sample@example.com"/></div></label><label>ステータス<select value={newStatus} onChange={(e) => setNewStatus(e.target.value as Status)}>{statusOptions.filter((s) => s !== 'すべて').map((s) => <option key={s}>{s}</option>)}</select></label><div className="dialog-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>キャンセル</button><button type="submit" className="primary-button"><Plus size={17}/> 登録する</button></div></form></div></div>}
    {selected && <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><div className="dialog" role="dialog" aria-modal="true" aria-label="顧客詳細"><div className="dialog-head"><div><h2>顧客詳細</h2><p>登録されている顧客情報</p></div><button className="icon-button" aria-label="閉じる" onClick={() => setSelected(null)}><X size={20}/></button></div><div className="detail-row"><span>氏名</span><strong>{selected.name}</strong></div><div className="detail-row"><span>会社名</span><strong>{selected.company}</strong></div><div className="detail-row"><span>メールアドレス</span><strong>{selected.email}</strong></div><div className="detail-row"><span>ステータス</span><select value={selected.status} onChange={(e) => { const newValue = e.target.value as Status; setCustomers((prev) => prev.map((c) => c.id === selected.id ? { ...c, status: newValue } : c)); setSelected({ ...selected, status: newValue }); showToast('ステータスを更新しました'); }}><option>対応中</option><option>商談中</option><option>契約済み</option></select></div><div className="detail-row"><span>最終更新日</span><strong>{selected.updated}</strong></div><div className="dialog-actions"><button className="danger-button" onClick={() => removeCustomer(selected.id)}><Trash2 size={16}/> 削除</button><button className="secondary-button" onClick={() => setSelected(null)}>閉じる</button></div></div></div>}
    {toast && <div role="status" className="toast">{toast}</div>}
  </div>;
}
